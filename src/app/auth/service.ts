import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser,
    ICognitoUserAttributeData,
    CognitoUserAttribute,
    CognitoUserSession
} from 'amazon-cognito-identity-js';
import { CognitoIdentityCredentials, config as AWSConfig, AWSError } from 'aws-sdk';

import { cognitoConfig } from '../../config';
import { User, SignupData } from './types';
import { Dictionary } from '../../types';
import { URLUtil } from '../../utils';

@Injectable()
export class AuthService {
    public static statusCodes = {
        success: 'success',
        signedIn: 'signedIn',
        signedOut: 'signedOut',
        incompletedSigninData: 'incompletedSigninData',
        newPasswordRequired: 'newPasswordRequired',
        verificationCodeRequired: 'verificationCodeRequired',
        passwordChanged: 'passwordChanged',
        noSuchUser: 'noSuchUser',
        unknownError: 'unknownError'
    };

    private static userPoolLoginKey = `cognito-idp.${cognitoConfig.userPool.region}.amazonaws.com/${cognitoConfig.userPool.UserPoolId}`;

    private userPool = new CognitoUserPool(cognitoConfig.userPool);
    private previousAppParams: any;
    private signupData: SignupData = {};
    cognitoAwsCredentials: CognitoIdentityCredentials;
    currentStatus = 'unknown';

    constructor(private router: Router) { }

    private getCognitoUser(username?: string) {
        username = username || this.signupData.username;
        if (!username) {
            return undefined;
        }
        return new CognitoUser({
            Username: username,
            Pool: this.userPool
        });
    }

    authenticate(user: SignupData,
        callback?: (err: Error, statusCode: string) => void) {
        const authService = this;
        const username = user.username || this.signupData.username;
        const password = user.password || this.signupData.password;
        if (!username || !password) {
            callback(new Error('AuthenticationDetails are incomplete.'),
                AuthService.statusCodes.incompletedSigninData);
            return;
        } else {
            this.signupData.username = username;
            this.signupData.password = password;
        }

        const cognitoUser = this.getCognitoUser(username);
        const auth = new AuthenticationDetails({ Username: username, Password: password });
        cognitoUser.authenticateUser(auth, {
            onSuccess: function (authResult) {
                authService.currentStatus = AuthService.statusCodes.signedIn;
                authService.signupData = {};
                callback(null, AuthService.statusCodes.signedIn);
            },

            onFailure: function (err) {
                authService.currentStatus = AuthService.statusCodes.unknownError;
                if (err.code === 'UserNotFoundException' || err.code === 'NotAuthorizedException') {
                    callback(err, AuthService.statusCodes.noSuchUser);
                } else {
                    callback(err, AuthService.statusCodes.unknownError);
                }
            },
            newPasswordRequired: function (userAttributes, requiredAttributes) {
                if (!user.newPassword) {
                    const newNoNewPasswordError = new Error('First time logged in but new password is not provided');
                    if (callback) {
                        authService.currentStatus = AuthService.statusCodes.newPasswordRequired;
                        callback(newNoNewPasswordError, AuthService.statusCodes.newPasswordRequired);
                        return;
                    } else {
                        throw newNoNewPasswordError;
                    }
                }
                if (authService.signupData) {
                    userAttributes = Object.assign(userAttributes, authService.signupData.additionalData);
                }
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(user.newPassword, userAttributes, this);
            }
        });
    }

    forgotPassword(username: string, callback: (error: Error, statusCode: string) => void) {
        const authService = this;
        this.signupData.username = username;
        const cognitoUser = this.getCognitoUser(username);
        cognitoUser.forgotPassword({
            onSuccess: function () {
                authService.currentStatus = AuthService.statusCodes.verificationCodeRequired;
                callback(null, AuthService.statusCodes.verificationCodeRequired);
            },
            onFailure: function (err) {
                authService.currentStatus = AuthService.statusCodes.unknownError;
                if (err.name === 'UserNotFoundException') {
                    callback(err, AuthService.statusCodes.noSuchUser);
                } else {
                    callback(err, AuthService.statusCodes.unknownError);
                }
            },
            inputVerificationCode: function (data) {
                authService.currentStatus = AuthService.statusCodes.verificationCodeRequired;
                callback(null, AuthService.statusCodes.verificationCodeRequired);
            }
        });
    }

    confirmPassword(verficationCode: string, newPassword: string, callback: (error: Error, statusCode: string) => void) {
        if (!this.signupData.username) {
            callback(new Error('Username is Empty.'), AuthService.statusCodes.incompletedSigninData);
            return;
        }
        const authService = this;
        const cognitoUser = new CognitoUser({
            Username: this.signupData.username,
            Pool: this.userPool
        });

        cognitoUser.confirmPassword(verficationCode, newPassword, {
            onSuccess: () => {
                authService.currentStatus = AuthService.statusCodes.passwordChanged;
                callback(null, AuthService.statusCodes.success);
            },
            onFailure: (err: Error) => {
                authService.currentStatus = AuthService.statusCodes.unknownError;
                callback(err, AuthService.statusCodes.unknownError);
            }
        });
    }

    signout() {
        const currentUser = this.userPool.getCurrentUser();
        if (currentUser) {
            this.userPool.getCurrentUser().signOut();
        }
        this.router.navigate(['']);
    }

    getUserAttributes(callback: (err?: Error, data?: Dictionary<any>) => void) {
        this.getCurrentCognitoUser((err1, cognitoUser) => {
            if (!cognitoUser) {
                callback(new Error('Cognito User is not found'));
                return;
            }
            cognitoUser.getUserAttributes((err2?: Error, cognitoAttributes?: CognitoUserAttribute[]) => {
                if (err2) {
                    callback(err2);
                    return;
                }
                cognitoAttributes = cognitoAttributes || [];
                const cognitoAttributesObject = cognitoAttributes.reduce(function (prev, curr) {
                    prev[curr.getName()] = curr.getValue();
                    return prev;
                }, {});
                callback(undefined, cognitoAttributesObject);
            });
        });

    }

    setUserAttribute(name: string, value: string, callback: (err?: Error) => void) {
        this.getCurrentCognitoUser((err, cognitoUser) => {
            if (!cognitoUser) {
                callback(new Error('Cognito User is not found'));
                return;
            }
            const cognitoAttributes: ICognitoUserAttributeData[] = [{ Name: name, Value: value }];
            cognitoUser.updateAttributes(cognitoAttributes, callback);
        });
    }

    addAdditionalSignupData(name: string, value: string) {
        this.signupData.additionalData = this.signupData.additionalData || {};
        this.signupData.additionalData[name] = value;
    }

    private getCurrentCognitoUser(callback: (err1?: Error, cognitoUser?: CognitoUser) => void) {
        const cognitoUser = this.userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
                if (session && session.isValid()) {
                    if (!this.cognitoAwsCredentials || this.cognitoAwsCredentials.needsRefresh()) {
                        this.updateAWSCredentials(session.getIdToken().getJwtToken(), cognitoUser.getUsername(), (err2) => {
                            if (err2) {
                                callback(err2);
                            } else {
                                callback(undefined, cognitoUser);
                            }
                        });
                    } else {
                        callback(undefined, cognitoUser);
                    }
                } else {
                    callback(undefined, undefined);
                }
            });
        } else {
            callback(undefined, undefined);
        }
    }

    getCurrentUser(callback: (err?: Error, user?: User) => void) {
        this.getCurrentCognitoUser((err, cognitoUser) => {
            if (cognitoUser && cognitoUser.getUsername()) {
                const identityId = this.cognitoAwsCredentials ? this.cognitoAwsCredentials.identityId : undefined;
                callback(undefined, new User(true, cognitoUser.getUsername(), identityId));
            } else {
                callback(undefined, User.default);
            }
        });
    }

    private updateAWSCredentials(sessionToken: string, username: string, callback: (err?: Error) => void) {
        const logins = {};
        logins[AuthService.userPoolLoginKey] = sessionToken;
        this.cognitoAwsCredentials = new CognitoIdentityCredentials(
            {
                IdentityPoolId: cognitoConfig.identityPoolId,
                Logins: logins,
                LoginId: username
            },
            {
                region: cognitoConfig.userPool.region
            }
        );
        // call refresh method in order to authenticate user and get new temp credentials
        this.cognitoAwsCredentials.refresh((err: AWSError) => {
            if (err) {
                callback(err);
            } else {
                AWSConfig.credentials = this.cognitoAwsCredentials;
                callback(null);
            }
        });
    }

    setPreviousAppParams(params: any) {
        this.previousAppParams = params;
    }

    handleRedirect() {
        if (this.previousAppParams && this.previousAppParams.from) {
            let params = '';
            if (this.previousAppParams.params) {
                params = decodeURIComponent(this.previousAppParams.params).replace(/from=[^&]+&/g, '');
            }

            window.location.href = `${URLUtil.getBaseUrl()}/${this.previousAppParams.from}#/?from=signin&${params}`;
        } else {
            this.router.navigate(['home']);
        }
    }

    redirectToSignin(params?: any) {
        const queryParamString = URLUtil.toQueryParamString(params).replace(/from=[^&]+&/g, '');
        const encodedParams = encodeURIComponent(queryParamString);
        window.location.href = `${URLUtil.getBaseUrl()}/signin#/?from=upload&params=${encodedParams}`;
    }
}

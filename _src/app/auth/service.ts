import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User, SigninData } from './types';
import { CognitoIdentityCredentials, config as AWSConfig, AWSError } from 'aws-sdk';

import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser,
    CognitoUserSession
} from 'amazon-cognito-identity-js';
import * as Config from './config';

@Injectable()
export class AuthService {

    public static statusCodes = {
        signedIn: 'signedIn',
        signedOut: 'signedOut',
        incompletedSigninData: 'incompletedSigninData',
        newPasswordRequired: 'newPasswordRequired',
        noSuchUser: 'noSuchUser',
        unknownError: 'unknownError'
    };

    private static userPoolLoginKey = `cognito-idp.${Config.cognito.userPool.region}.amazonaws.com/${Config.cognito.userPool.UserPoolId}`;

    private userPool = new CognitoUserPool(Config.cognito.userPool);
    private signinEventSource = new BehaviorSubject<User>(User.default);
    public signinEvent$ = this.signinEventSource.asObservable();
    cognitoAwsCredentials: CognitoIdentityCredentials;
    private signData: SigninData = {};

    authenticate(user: SigninData,
        callback?: (err: Error, statusCode: string) => void) {
        const username = user.username || this.signData.username;
        const password = user.password || this.signData.password;
        if (!username || !password) {
            callback(new Error('AuthenticationDetails are incomplete.'),
                     AuthService.statusCodes.incompletedSigninData);
        } else {
            this.signData.username = username;
            this.signData.password = password;
        }

        const cognitoUser = new CognitoUser({
            Username: username,
            Pool: this.userPool
        });
        const auth = new AuthenticationDetails({ Username: username, Password: password });
        cognitoUser.authenticateUser(auth, {
            onSuccess: (authResult) => {
                this.signData = {};
                this.signinEventSource.next(this.getCurrentUser());
                callback(null, AuthService.statusCodes.signedIn);
            },

            onFailure: function (err) {
                if (err.code === 'UserNotFoundException' || err.code === 'NotAuthorizedException') {
                    callback(err, AuthService.statusCodes.noSuchUser);
                } else {
                    callback(err, AuthService.statusCodes.unknownError);
                }
            },
            newPasswordRequired: function(userAttributes, requiredAttributes) {
                if (!user.newPassword) {
                    const newNoNewPasswordError = new Error('First time logged in but new password is not provided');
                    if (callback) {
                        callback(newNoNewPasswordError, AuthService.statusCodes.newPasswordRequired);
                        return;
                    } else {
                        throw newNoNewPasswordError;
                    }
                }
                delete userAttributes.email_verified;
                cognitoUser.completeNewPasswordChallenge(user.newPassword, userAttributes, this);
            }
        });
    }

    signout() {
        const currentUser = this.userPool.getCurrentUser();
        if (currentUser) {
            this.userPool.getCurrentUser().signOut();
        }
        this.signinEventSource.next(User.default);
    }

    getCurrentUser(): User {
        let user = User.default;
        const cognitoUser = this.userPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
                if (session && session.isValid()) {
                    user = new User(true, cognitoUser.getUsername());
                    if (!this.cognitoAwsCredentials || this.cognitoAwsCredentials.needsRefresh()) {
                        this.updateAWSCredentials(session.getIdToken().getJwtToken(), user.username);
                    }
                }
            });
        }
        return user;
    }

    private updateAWSCredentials(sessionToken: string, username: string) {
        const logins = {};
        logins[AuthService.userPoolLoginKey] = sessionToken;
        this.cognitoAwsCredentials = new CognitoIdentityCredentials(
            {
                IdentityPoolId: Config.cognito.identityPoolId,
                Logins: logins,
                LoginId: username
            },
            {
                region: Config.cognito.userPool.region
            }
        );
        // call refresh method in order to authenticate user and get new temp credentials
        this.cognitoAwsCredentials.refresh((err: AWSError) => {
            if (err) {
                console.error(err);
            }
        });
        AWSConfig.credentials = this.cognitoAwsCredentials;
    }
}

export class User {
  static default = new User(false);
  constructor(public signedIn: boolean, public username?: string) { }
}

export interface SigninData {
  username?: string;
  password?: string;
  newPassword?: string;
}

export interface SigninForm extends SigninData {
  confirmPassword?: string;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  passwordConfirmation: string;
  currentPassword: string;
  newPassword: string;
}

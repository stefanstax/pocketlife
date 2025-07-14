export interface RegistrationState {
  username: string;
  email: string;
  name: string;
  passcode: number | "";
  securityName: string;
  recoveryUrl: string;
  currencies: string[];
}

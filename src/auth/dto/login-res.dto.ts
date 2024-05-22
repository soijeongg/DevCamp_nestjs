export class LoginResDto {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    name: string;
    email: string;
  };
}

export type LoginResDto = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    name: string;
    email: string;
  };
};

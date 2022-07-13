export interface TokenResponse {
  accessToken: string;
  type: string;
  refreshToken: string;
  expiredAt: Date;
}

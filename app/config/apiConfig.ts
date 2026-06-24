const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const ApiConfig = {
  // Auth
  refreshToken:    `${apiURL}/auth/refresh`,
  signup:          `${apiURL}/auth/signup`,
  login:           `${apiURL}/auth/login`,
  logout:          `${apiURL}/auth/logout`,
  userInfo:        `${apiURL}/auth/me`,
  forgotPassword:  `${apiURL}/auth/forgot-password`,
  resetPassword:   `${apiURL}/auth/reset-password`,
  changePassword:  `${apiURL}/auth/change-password`,

  // Could be used further 
  // verifyOTP:       `${apiURL}/auth/verify-otp`,
  // resendOTP:       `${apiURL}/auth/resend-otp`,
  // verifyEmail:     `${apiURL}/auth/verify-email`,
  // resendEmail:     `${apiURL}/auth/resend-email`,
  deleteAccount:   `${apiURL}/auth/delete`,

  // User
  // editUserInfo:    `${apiURL}/user/editprofile`,
  // exportUserData:  `${apiURL}/user/gdpr/export`,
};

export default ApiConfig;

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
  deleteAccount:   `${apiURL}/auth/delete`,

  // User
  userProfileInfo: `${apiURL}/users/me`,
  userProfileAvtar:  `${apiURL}/users/me/avatar`,

  // Subscription
  subsriptionPlans: `${apiURL}/subscriptions/plans`,
  mySubsriptionPlans: `${apiURL}/subscriptions/me`,

};

export default ApiConfig;

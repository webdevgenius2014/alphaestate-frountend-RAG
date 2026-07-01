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
  userProfileAvtar: `${apiURL}/users/me/avatar`,
  userProfile2Fa: `${apiURL}/users/me/2Fa/toggle`,

  // Subscription
  subsriptionPlans: `${apiURL}/subscriptions/plans`,
  mySubsriptionPlans: `${apiURL}/subscriptions/me`,
  checkoutSession: `${apiURL}/subscriptions/checkout-session`,

  // Property Listing
  listingProperties: `${apiURL}/properties`,
  propertyById: `${apiURL}/properties/{id}`,
  similarProperties: `${apiURL}/properties/{id}/similar`,
  // Saver Property
  listingSavedProperties: `${apiURL}/users/me/saved`,
  savedPropertyById: `${apiURL}/properties/{id}/save`,

  // Admin
  // Dashbord 
  admindashboard: `${apiURL}/admin/dashboard`,

  //user-managment
  adminUsers: `${apiURL}/admin/users`,
  adminUsersById: `${apiURL}/admin/users/{id}`, 
  suspendAdminUsers: `${apiURL}/admin/users/{id}/suspend`,  
  deleteAdminUsers: `${apiURL}/admin/users/{id}`, 

  //admin-analytics
  overview: `${apiURL}/admin/analytics/overview`,
  platformGrowth: `${apiURL}/admin/analytics/platform-growth`,
  districtPerformance: `${apiURL}/admin/analytics/district-performance`,  
  subscriptionPerformance: `${apiURL}/admin/analytics/subscription-performance`,
  investmentMovement: `${apiURL}/admin/analytics/investment-movement`,
  appreciationPotential: `${apiURL}/admin/analytics/appreciation-potential`,
  marketIntelligence: `${apiURL}/admin/analytics/market-intelligence`,  
  usage: `${apiURL}/admin/analytics/usage`,

  // admin subscriptions-billing
  dashboardSubscription: `${apiURL}/admin/subscriptions/dashboard`,
  activeSubscription: `${apiURL}/admin/subscriptions/active`,
  billingHistory: `${apiURL}/admin/subscriptions/billing-history`,
  billingHistoryById: `${apiURL}/admin/subscriptions/billing-history/{id}`,
  upcoming: `${apiURL}/admin/subscriptions/upcoming`,
  plans: `${apiURL}/admin/subscriptions/plans`,
  revenueInsights: `${apiURL}/admin/subscriptions/revenue-insights`,
  plansById: `${apiURL}/admin/subscriptions/plans/{id}`,
  upgradeSubscription: `${apiURL}/admin/subscriptions/checkout-session`,

  // admin profile
  adminProfile: `${apiURL}/admin/profile`,
  adminProfileAvtar: `${apiURL}/admin/profile/avatar`,
  adminProfile2Fa: `${apiURL}/admin/profile/2fa/toggle`,
  adminChangePassword: `${apiURL}/admin/profile/change-password`, 
  






  


};

export default ApiConfig;

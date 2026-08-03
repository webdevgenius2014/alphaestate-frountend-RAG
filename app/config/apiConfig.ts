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
  authSessions:    `${apiURL}/auth/sessions`,
  authSessionById: `${apiURL}/auth/sessions/{id}`,
  authSessionBySessionId: `${apiURL}/auth/sessions/{sessionId}`,

  // User
  userProfileInfo: `${apiURL}/users/me`,
  userProfileAvtar: `${apiURL}/users/me/avatar`,
  userProfile2Fa: `${apiURL}/users/me/2Fa/toggle`,

  //dashboard
  verifiedListings:  `${apiURL}/analytics/properties/stats`,
  liveMarket:  `${apiURL}/districts?show_in_dashboard=true`,
  priceTrendChart: `${apiURL}/analytics/market/price-trend`,
  rentalYieldByDistrict:  `${apiURL}/analytics/market/price-trend`,
  districtCap: `${apiURL}/analytics/market/district-comparison`,
  topProperties: `${apiURL}/analytics/market/top-properties`,

  // Subscription
  subsriptionPlans: `${apiURL}/subscriptions/plans`,
  mySubsriptionPlans: `${apiURL}/subscriptions/me`,
  checkoutSession: `${apiURL}/subscriptions/checkout-session`,
  upgradePreview: `${apiURL}/subscriptions/upgrade-preview`,
  upgrade: `${apiURL}/subscriptions/upgrade`,

  // Property Listing
  listingProperties: `${apiURL}/properties`,
  propertyById: `${apiURL}/properties/{id}`,
  similarProperties: `${apiURL}/properties/{id}/similar`,
  // Saver Property
  listingSavedProperties: `${apiURL}/users/me/saved`,
  savedPropertyById: `${apiURL}/properties/{id}/save`,

  //districts
  allDistricts: `${apiURL}/districts`,

  // Notifications
  notifications: `${apiURL}/notifications`,
  notificationsUnreadCount: `${apiURL}/notifications/unread-count`,
  notificationRead: `${apiURL}/notifications/{id}/read`,
  notificationsReadAll: `${apiURL}/notifications/read-all`,
  notificationById: `${apiURL}/notifications/{id}`,

  // Deal Analyzer
  dealAnalyzerAnalyze: `${apiURL}/deal-analyzer/analyze`,
  dealAnalyzerComparables: `${apiURL}/deal-analyzer/comparables`,

  //user analytics page
  userAnalytics: `${apiURL}/analytics/market/overview`,
  priceTrend: `${apiURL}/analytics/market/price-trend`,
  disrtictRoi: `${apiURL}/analytics/market/district-comparison`,
  userInvestmentMovement: `${apiURL}/analytics/market/price-trend`,
  rentalYield: `${apiURL}/analytics/market/district-comparison`,
  capRateMap: `${apiURL}/analytics/market/cap-rate-map`,
  exportReport: `${apiURL}/analytics/export/excel`,
  marketSnapshots: `${apiURL}/analytics/market/snapshots`,

  // Reports
  reportsHistory: `${apiURL}/reports/history`,
  reportsLog: `${apiURL}/reports/log`,
  reportHistoryById: `${apiURL}/reports/history/{id}`,
  reportHistoryShare: `${apiURL}/reports/history/{id}/share`,

  // Admin
  // Dashbord 
  admindashboard: `${apiURL}/admin/dashboard`,

  //user-managment
  adminUsers: `${apiURL}/admin/users`,
  adminUsersById: `${apiURL}/admin/users/{id}`, 
  suspendAdminUsers: `${apiURL}/admin/users/{id}/suspend`,  
  deleteAdminUsers: `${apiURL}/admin/users/{id}`, 
  exportUsers: `${apiURL}/admin/users/export`, 

  //admin-analytics
  overview: `${apiURL}/admin/analytics/overview`,
  platformGrowth: `${apiURL}/admin/analytics/platform-growth`,
  districtPerformance: `${apiURL}/admin/analytics/district-performance`,  
  subscriptionPerformance: `${apiURL}/admin/analytics/subscription-performance`,
  investmentMovement: `${apiURL}/admin/analytics/investment-movement`,
  appreciationPotential: `${apiURL}/admin/analytics/appreciation-potential`,
  marketIntelligence: `${apiURL}/admin/analytics/market-intelligence`,  
  usage: `${apiURL}/admin/analytics/usage`,
  triggerAnalysis: `${apiURL}/admin/analytics/compute`,
  computeAiScore: `${apiURL}/admin/analytics/compute-ai-scores`,

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
  
  // admin property managmant
  adminProperties: `${apiURL}/admin/properties`,
  adminPropertiesStats: `${apiURL}/admin/properties/stats`,
  adminPropertiesById: `${apiURL}/admin/properties/{id}`,
  adminPropertiesStatus: `${apiURL}/admin/properties/{id}/status`,
  adminPropertiesCoverImage: `${apiURL}/admin/properties/{id}/cover-image`,
  adminPropertiesGallery: `${apiURL}/admin/properties/{id}/gallery`,
  adminPropertiesBrochure: `${apiURL}/admin/properties/{id}/brochure`,

  // CSV
  adminGetCSV: `${apiURL}/admin/ingestion/logs`,
  adminGetCSVById: `${apiURL}/admin/ingestion/logs/{id}`,
  adminImportCSV: `${apiURL}/admin/ingestion/upload`,

  // Rental Ingestion
  rentalUploadIndex: `${apiURL}/admin/ingestion/rental/upload-index`,
  rentalUploadBulk: `${apiURL}/admin/ingestion/rental/upload`,
  rentalCoverage: `${apiURL}/admin/ingestion/rental/coverage`,



 // admin platform managment
  adminActivityLogs: `${apiURL}/admin/activity-logs`,
  adminActivityLogsExport: `${apiURL}/admin/activity-logs/export`,
  adminNotification: `${apiURL}/admin/platform/settings/notifications`,
  platformGenralInfo: `${apiURL}/admin/platform/settings/general`,
  platformSecurityInfo: `${apiURL}/admin/platform/settings/security`,

  //user profile notification
  notificationPrefrences: `${apiURL}/users/me/notification-preferences`,



  


};

export default ApiConfig;

import axios from "axios";
import instance, { getCookie } from "./interceptor";
import ApiConfig from "../config/ApiConfig";

class AppService {
  // auth 
  async refreshToken() {
    try {
      return await axios.post(ApiConfig.refreshToken, {}, { withCredentials: true });
    } catch (error: any) {
      return error.response;
    }
  }

  async signUp(payload: any) {
    try {
      return await instance.post(ApiConfig.signup, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async login(payload: any) {
    try {
      return await instance.post(ApiConfig.login, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async logout() {
    try {
      const refreshToken = getCookie("refresh_token");
      return await instance.post(ApiConfig.logout, {}, {
        headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined,
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async getUserInfo() {
    try {
      return await instance.get(ApiConfig.userInfo);
    } catch (error: any) {
      return error.response;
    }
  }

  async forgotPassword(payload: any) {
    try {
      return await instance.post(ApiConfig.forgotPassword, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async resetPassword(payload: any) {
    try {
      return await instance.post(ApiConfig.resetPassword, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async changePassword(payload: any) {
    try {
      return await instance.post(ApiConfig.changePassword, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteAccount() {
    try {
      return await instance.delete(ApiConfig.deleteAccount);
    } catch (error: any) {
      return error.response;
    }
  }

  async getSessions() {
    try {
      return await instance.get(ApiConfig.authSessions);
    } catch (error: any) {
      return error.response;
    }
  }

  async logoutSession(id: string) {
    try {
      const url = ApiConfig.authSessionById.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async logoutSessionBySessionId(sessionId: string) {
    try {
      const url = ApiConfig.authSessionBySessionId.replace("{sessionId}", sessionId);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  // User Profile
  async getUserProfile() {
    try {
      return await instance.get(ApiConfig.userProfileInfo);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateUserProfile(payload: any) {
    try {
      return await instance.patch(ApiConfig.userProfileInfo, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteUserProfile() {
    try {
      return await instance.delete(ApiConfig.userProfileInfo);
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadProfileAvatar(payload: FormData) {
    try {
      return await instance.post(ApiConfig.userProfileAvtar, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async toggleUserProfile2Fa(payload: any) {
    try {
      return await instance.post(ApiConfig.userProfile2Fa, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getNotificationPreferences() {
    try {
      return await instance.get(ApiConfig.notificationPrefrences);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateNotificationPreferences(payload: any) {
    try {
      return await instance.patch(ApiConfig.notificationPrefrences, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  // Subscriptions
  async getSubscriptionPlans() {
    try {
      return await instance.get(ApiConfig.subsriptionPlans);
    } catch (error: any) {
      return error.response;
    }
  }

  async getMySubscription() {
    try {
      return await instance.get(ApiConfig.mySubsriptionPlans);
    } catch (error: any) {
      return error.response;
    }
  }

  async createCheckoutSession(planId: string) {
    try {
      return await instance.post(ApiConfig.checkoutSession, { planId });
    } catch (error: any) {
      return error.response;
    }
  }

  async getUpgradePreview(planId: string) {
    try {
      return await instance.post(ApiConfig.upgradePreview, { planId });
    } catch (error: any) {
      return error.response;
    }
  }

  async upgradeSubscriptionPlan(planId: string) {
    try {
      return await instance.post(ApiConfig.upgrade, { planId });
    } catch (error: any) {
      return error.response;
    }
  }

  // Property Listing
  async getListingProperties(page: number = 1, limit: number = 20, filters?: Record<string, any>) {
    try {
      return await instance.get(ApiConfig.listingProperties, {
        params: { page, limit, ...filters },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async getPropertyById(id: string) {
    try {
      const url = ApiConfig.propertyById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async getSimilarProperties(id: string) {
    try {
      const url = ApiConfig.similarProperties.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

     async liveMarket(page: number = 1, limit: number = 20, filters?: Record<string, any>) {
    try {
      return await instance.get(ApiConfig.listingProperties, {
        params: { page, limit, ...filters },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Districts
  async getAllDistricts() {
    try {
      return await instance.get(ApiConfig.allDistricts);
    } catch (error: any) {
      return error.response;
    }
  }

  // Notifications
  async getNotifications(page: number = 1, limit: number = 20) {
    try {
      return await instance.get(ApiConfig.notifications, { params: { page, limit } });
    } catch (error: any) {
      return error.response;
    }
  }

  async getUnreadNotificationCount() {
    try {
      return await instance.get(ApiConfig.notificationsUnreadCount);
    } catch (error: any) {
      return error.response;
    }
  }

  async markNotificationRead(id: string) {
    try {
      const url = ApiConfig.notificationRead.replace("{id}", id);
      return await instance.patch(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async markAllNotificationsRead() {
    try {
      return await instance.patch(ApiConfig.notificationsReadAll);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteNotification(id: string) {
    try {
      const url = ApiConfig.notificationById.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  // Deal Analyzer
  async analyzeDeal(payload: {
    propertyType: string;
    district: string;
    areaSqm: number;
    askingPriceAed: number;
    saleType: string;
    bedrooms?: string;
    expectedAnnualRentAed?: number;
    saveResult?: boolean;
  }) {
    try {
      return await instance.post(ApiConfig.dealAnalyzerAnalyze, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getDealComparables(filters?: {
    district?: string;
    propertyType?: string;
    saleType?: string;
    bedrooms?: string;
    limit?: number;
  }) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "")
          )
        : {};
      return await instance.get(ApiConfig.dealAnalyzerComparables, { params: cleanFilters });
    } catch (error: any) {
      return error.response;
    }
  }

  async exportDealComparablesCsv(filters?: {
    district?: string;
    propertyType?: string;
    saleType?: string;
    bedrooms?: string;
    limit?: number;
  }) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== "")
          )
        : {};
      return await instance.get(ApiConfig.dealAnalyzerComparablesCsv, {
        params: cleanFilters,
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Dashboard
  async getVerifiedListingsStats() {
    try {
      return await instance.get(ApiConfig.verifiedListings);
    } catch (error: any) {
      return error.response;
    }
  }

  async getLiveMarketOverview() {
    try {
      return await instance.get(ApiConfig.liveMarket);
    } catch (error: any) {
      return error.response;
    }
  }

  async getRentalYieldByDistrictChart(period?: "last_year" | "last_6months" | "last_2_years" | "all_time") {
    try {
      return await instance.get(ApiConfig.rentalYieldByDistrict, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getDistrictCapRateMap(district: string = "all") {
    try {
      return await instance.get(ApiConfig.districtCap, { params: { district } });
    } catch (error: any) {
      return error.response;
    }
  }

  async getTopInvestmentProperties(limit?: number) {
    try {
      return await instance.get(ApiConfig.topProperties, { params: limit ? { limit } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  // User Analytics
  async getUserAnalytics(period?: string, district?: string, propertyType?: string) {
    try {
      const params: Record<string, any> = {};
      if (period) params.period = period;
      if (district) params.district = district;
      if (propertyType) params.propertyType = propertyType;
      return await instance.get(ApiConfig.userAnalytics, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getPriceTrend(period?: "last_year" | "last_6months" | "last_2_years" | "all_time", districts?: string) {
    try {
      const params: Record<string, string> = {};
      if (period) params.period = period;
      if (districts) params.districts = districts;
      return await instance.get(ApiConfig.priceTrend, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getInvestmentMovement(period?: "last_year" | "last_2_years" | "all_time") {
    try {
      return await instance.get(ApiConfig.userInvestmentMovement, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getRentalYieldByDistrict(period?: "last_year" | "last_6months" | "last_2_years" | "all_time") {
    try {
      return await instance.get(ApiConfig.rentalYield, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getCapRateMap(propertyType?: string) {
    try {
      return await instance.get(ApiConfig.capRateMap, { params: propertyType ? { propertyType } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getDistrictRoi(
    district?: "all" | "top3" | string,
    period?: "last_year" | "last_6months" | "last_2_years" | "all_time",
    districtIds?: string[]
  ) {
    try {
      const params: Record<string, any> = {};
      if (districtIds && districtIds.length) {
        params.districtIds = districtIds.slice(0, 5).join(",");
      } else if (district) {
        params.district = district;
      }
      if (period) params.period = period;
      return await instance.get(ApiConfig.disrtictRoi, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async exportAnalyticsReport(payload?: { district?: string; propertyType?: string; saleType?: string; dateFrom?: string; dateTo?: string; limit?: number }) {
    try {
      const body: Record<string, any> = {};
      if (payload?.district) body.district = payload.district;
      if (payload?.propertyType) body.propertyType = payload.propertyType;
      if (payload?.saleType) body.saleType = payload.saleType;
      if (payload?.dateFrom) body.dateFrom = payload.dateFrom;
      if (payload?.dateTo) body.dateTo = payload.dateTo;
      if (payload?.limit) body.limit = payload.limit;

      return await instance.post(ApiConfig.exportReport, body, {
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async getMarketSnapshots(district?: string, period?: "ttm_current" | "ttm_prior" | string) {
    try {
      const params: Record<string, string> = {};
      if (district) params.district = district.toLowerCase();
      if (period) params.period = period;
      return await instance.get(ApiConfig.marketSnapshots, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  // Reports
  async getReportsHistory(page: number = 1, limit: number = 10) {
    try {
      return await instance.get(ApiConfig.reportsHistory, { params: { page, limit } });
    } catch (error: any) {
      return error.response;
    }
  }

  async logReportGeneration(payload: {
    reportType: string;
    reportName: string;
    district?: string;
    timePeriod?: string;
    status: string;
    fileUrl?: string;
  }) {
    try {
      return await instance.post(ApiConfig.reportsLog, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async shareReportHistory(id: string) {
    try {
      const url = ApiConfig.reportHistoryShare.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteReportHistory(id: string) {
    try {
      const url = ApiConfig.reportHistoryById.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  // Saved Property
  async getListingSavedProperties(
  page: number = 1,
  limit: number = 20,
  filters?: {
    district?: string;
    propertyType?: string;
    investmentSignal?: string;
    marketType?: string;
  }
) {
  try {
    const cleanFilters = filters
      ? Object.fromEntries(
          Object.entries(filters).filter(
            ([_, v]) => v !== undefined && v !== null && v !== ""
          )
        )
      : {};

    return await instance.get(ApiConfig.listingSavedProperties, {
      params: { page, limit, ...cleanFilters },
    });
  } catch (error: any) {
    return error.response;
  }
}

  async getSavedPropertyById(id: string) {
    try {
      const url = ApiConfig.savedPropertyById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async saveProperty(id: string) {
    try {
      const url = ApiConfig.savedPropertyById.replace("{id}", id);
      return await instance.post(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async unsaveProperty(id: string) {
    try {
      const url = ApiConfig.savedPropertyById.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async compareSavedProperties(ids: string[]) {
    try {
      return await instance.post(ApiConfig.savedPropertiesCompare, { ids });
    } catch (error: any) {
      return error.response;
    }
  }

  async exportSavedProperties() {
    try {
      return await instance.get(ApiConfig.savedPropertiesExport, {
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin
  async getAdminDashboard(period?: string) {
    try {
      return await instance.get(ApiConfig.admindashboard, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Profile  
  async getAdminProfile() {
    try {
      return await instance.get(ApiConfig.adminProfile);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateAdminProfile(payload: any) {
    try {
      return await instance.patch(ApiConfig.adminProfile, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadAdminProfileAvatar(payload: FormData) {
    try {
      return await instance.post(ApiConfig.adminProfileAvtar, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async toggleAdminProfile2Fa(payload: any) {
    try {
      return await instance.post(ApiConfig.adminProfile2Fa, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async changeAdminPassword(payload: any) {
    try {
      return await instance.post(ApiConfig.adminChangePassword, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminUsers(page: number = 1, limit: number = 10, search?: string, plan?: string, status?: string, period?: string) {
    try {
      const params: Record<string, any> = { page, limit };
      if (search) params.search = search;
      if (plan) params.plan = plan;
      if (status) params.status = status;
      if (period) params.period = period;
      return await instance.get(ApiConfig.adminUsers, { params });
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminUserById(id: string) {
    try {
      const url = ApiConfig.adminUsersById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async suspendAdminUser(id: string) {
    try {
      const url = ApiConfig.suspendAdminUsers.replace("{id}", id);
      return await instance.patch(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteAdminUser(id: string) {
    try {
      const url = ApiConfig.deleteAdminUsers.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async exportAdminUsers(filters?: { search?: string; plan?: string; status?: string; period?: string }) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, v]) => v !== undefined && v !== null && v !== ""
            )
          )
        : {};

      return await instance.get(ApiConfig.exportUsers, {
        params: cleanFilters,
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Properties
  async getAdminProperties(
    page: number = 1,
    limit: number = 20,
    filters?: {
      search?: string;
      district?: string;
      districtId?: string;
      propertyType?: string;
      assetClass?: string;
      layout?: string;
      saleType?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
      minArea?: number;
      maxArea?: number;
      isFeatured?: boolean;
      sortBy?: string;
      sortOrder?: string;
      period?: string;
    }
  ) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, v]) => v !== undefined && v !== null && v !== ""
            )
          )
        : {};

      return await instance.get(ApiConfig.adminProperties, {
        params: { page, limit, ...cleanFilters },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async createAdminProperty(payload: any) {
    try {
      return await instance.post(ApiConfig.adminProperties, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminPropertiesStats() {
    try {
      return await instance.get(ApiConfig.adminPropertiesStats);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminPropertyById(id: string) {
    try {
      const url = ApiConfig.adminPropertiesById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateAdminPropertyById(id: string, payload: any) {
    try {
      const url = ApiConfig.adminPropertiesById.replace("{id}", id);
      return await instance.patch(url, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async deleteAdminPropertyById(id: string) {
    try {
      const url = ApiConfig.adminPropertiesById.replace("{id}", id);
      return await instance.delete(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateAdminPropertyStatus(id: string, payload: any) {
    try {
      const url = ApiConfig.adminPropertiesStatus.replace("{id}", id);
      return await instance.patch(url, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadAdminPropertyCoverImage(id: string, payload: FormData) {
    try {
      const url = ApiConfig.adminPropertiesCoverImage.replace("{id}", id);
      return await instance.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadAdminPropertyGallery(id: string, payload: FormData) {
    try {
      const url = ApiConfig.adminPropertiesGallery.replace("{id}", id);
      return await instance.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadAdminPropertyBrochure(id: string, payload: FormData) {
    try {
      const url = ApiConfig.adminPropertiesBrochure.replace("{id}", id);
      return await instance.post(url, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Platform Settings
  async getPlatformGeneralInfo() {
    try {
      return await instance.get(ApiConfig.platformGenralInfo);
    } catch (error: any) {
      return error.response;
    }
  }

  async updatePlatformGeneralInfo(payload: any) {
    try {
      return await instance.patch(ApiConfig.platformGenralInfo, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getPlatformSecurityInfo() {
    try {
      return await instance.get(ApiConfig.platformSecurityInfo);
    } catch (error: any) {
      return error.response;
    }
  }

  async updatePlatformSecurityInfo(payload: any) {
    try {
      return await instance.patch(ApiConfig.platformSecurityInfo, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminNotificationSettings() {
    try {
      return await instance.get(ApiConfig.adminNotification);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateAdminNotificationSettings(payload: any) {
    try {
      return await instance.patch(ApiConfig.adminNotification, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin CSV Ingestion
  async getAdminCSV(
    page: number = 1,
    limit: number = 20,
    filters?: Record<string, any>
  ) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, v]) => v !== undefined && v !== null && v !== ""
            )
          )
        : {};

      return await instance.get(ApiConfig.adminGetCSV, {
        params: { page, limit, ...cleanFilters },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminCSVById(id: string) {
    try {
      const url = ApiConfig.adminGetCSVById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async importAdminCSV(payload: FormData) {
    try {
      return await instance.post(ApiConfig.adminImportCSV, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Rental Ingestion
  async uploadRentalIndexFile(payload: FormData) {
    try {
      return await instance.post(ApiConfig.rentalUploadIndex, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async uploadRentalFiles(payload: FormData) {
    try {
      return await instance.post(ApiConfig.rentalUploadBulk, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async getRentalCoverage() {
    try {
      return await instance.get(ApiConfig.rentalCoverage);
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Activity Logs
  async getAdminActivityLogs(
    page: number = 1,
    limit: number = 20,
    filters?: {
      period?: string;
      role?: string;
      module?: string;
    }
  ) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, v]) => v !== undefined && v !== null && v !== ""
            )
          )
        : {};

      return await instance.get(ApiConfig.adminActivityLogs, {
        params: { page, limit, ...cleanFilters },
      });
    } catch (error: any) {
      return error.response;
    }
  }

  async exportAdminActivityLogs(filters?: { period?: string; role?: string; module?: string }) {
    try {
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, v]) => v !== undefined && v !== null && v !== ""
            )
          )
        : {};

      return await instance.get(ApiConfig.adminActivityLogsExport, {
        params: cleanFilters,
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Analytics
  async getAnalyticsOverview(period?: string, district?: string, propertyType?: string) {
    try {
      const params: Record<string, any> = {};
      if (period) params.period = period;
      if (district) params.district = district;
      if (propertyType) params.propertyType = propertyType;
      return await instance.get(ApiConfig.overview, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsPlatformGrowth(period?: string) {
    try {
      return await instance.get(ApiConfig.platformGrowth, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsDistrictPerformance(period?: string, district?: string) {
    try {
      const params: Record<string, any> = {};
      if (period) params.period = period;
      if (district && district !== "all") params.district = district;
      return await instance.get(ApiConfig.districtPerformance, { params: Object.keys(params).length ? params : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  async triggerAnalyticsComputation() {
    try {
      return await instance.post(ApiConfig.triggerAnalysis);
    } catch (error: any) {
      return error.response;
    }
  }

   async computeAiScore() {
    try {
      return await instance.post(ApiConfig.computeAiScore);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsSubscriptionPerformance() {
    try {
      return await instance.get(ApiConfig.subscriptionPerformance);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsInvestmentMovement() {
    try {
      return await instance.get(ApiConfig.investmentMovement);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsAppreciationPotential() {
    try {
      return await instance.get(ApiConfig.appreciationPotential);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsMarketIntelligence() {
    try {
      return await instance.get(ApiConfig.marketIntelligence);
    } catch (error: any) {
      return error.response;
    }
  }

  async getAnalyticsUsage(period?: string) {
    try {
      return await instance.get(ApiConfig.usage, { params: period ? { period } : undefined });
    } catch (error: any) {
      return error.response;
    }
  }

  // Admin Subscriptions & Billing
  async getSubscriptionDashboard() {
    try {
      return await instance.get(ApiConfig.dashboardSubscription);
    } catch (error: any) {
      return error.response;
    }
  }

  async getActiveSubscriptions(page: number = 1, limit: number = 10) {
    try {
      return await instance.get(ApiConfig.activeSubscription, { params: { page, limit } });
    } catch (error: any) {
      return error.response;
    }
  }

  async getBillingHistory(period?: string, page: number = 1, limit: number = 10) {
    try {
      const params: Record<string, any> = { page, limit };
      if (period) params.period = period;
      return await instance.get(ApiConfig.billingHistory, { params });
    } catch (error: any) {
      return error.response;
    }
  }

  async getUpcomingRenewals(limit: number = 100) {
    try {
      return await instance.get(ApiConfig.upcoming, { params: { limit } });
    } catch (error: any) {
      return error.response;
    }
  }

  async getAdminSubscriptionPlans() {
    try {
      return await instance.get(ApiConfig.plans);
    } catch (error: any) {
      return error.response;
    }
  }

  async getSubscriptionPlanById(id: string) {
    try {
      const url = ApiConfig.plansById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async updateSubscriptionPlanById(id: string, payload: any) {
    try {
      const url = ApiConfig.plansById.replace("{id}", id);
      return await instance.patch(url, payload);
    } catch (error: any) {
      return error.response;
    }
  }

  async getRevenueInsights() {
    try {
      return await instance.get(ApiConfig.revenueInsights);
    } catch (error: any) {
      return error.response;
    }
  }

  async getBillingHistoryById(id: string) {
    try {
      const url = ApiConfig.billingHistoryById.replace("{id}", id);
      return await instance.get(url);
    } catch (error: any) {
      return error.response;
    }
  }

  async exportBillingReport() {
    try {
      return await instance.get(ApiConfig.exportBillingReport, {
        responseType: "blob",
      });
    } catch (error: any) {
      return error.response;
    }
  }

}

const appService = new AppService();
export default appService;

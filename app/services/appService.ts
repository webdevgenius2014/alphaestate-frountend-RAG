import axios from "axios";
import instance from "./interceptor";
import ApiConfig from "../config/apiConfig";

class AppService {

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
      return await instance.post(ApiConfig.logout);
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
    // Strip out undefined/empty values so they don't pollute the query string
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

}

const appService = new AppService();
export default appService;

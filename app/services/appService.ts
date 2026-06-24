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
}

const appService = new AppService();
export default appService;

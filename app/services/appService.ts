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
  

  // Could be used further 

  // async verifyTwoFactorOTP(payload: { tempToken: string; otp: string; fcmToken?: string | null }) {
  //   try {
  //     return await instance.post(ApiConfig.verifyOTP, payload);
  //   } catch (error: any) {
  //     return error.response;
  //   }
  // }

  // async resendTwoFactorOTP(tempToken: string) {
  //   try {
  //     return await instance.post(ApiConfig.resendOTP, { tempToken });
  //   } catch (error: any) {
  //     return error.response;
  //   }
  // }

  // async resendEmail(email: string) {
  //   try {
  //     return await instance.post(ApiConfig.resendEmail, { email });
  //   } catch (error: any) {
  //     return error.response;
  //   }
  // }

  // async editUserInfo(payload: any) {
  //   try {
  //     return await instance.put(ApiConfig.editUserInfo, payload);
  //   } catch (error: any) {
  //     return error.response;
  //   }
  // }

  // async exportUserData() {
  //   try {
  //     return await instance.get(ApiConfig.exportUserData);
  //   } catch (error: any) {
  //     return error.response;
  //   }
  // }

  async deleteAccount() {
    try {
      return await instance.delete(ApiConfig.deleteAccount);
    } catch (error: any) {
      return error.response;
    }
  }
}

const appService = new AppService();
export default appService;

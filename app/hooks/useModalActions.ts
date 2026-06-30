"use client";

import { useState } from "react";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";

function clearAuthCookies() {
  document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax";
}

// ── Logout ────────────────────────────────────────────────────────────────

export function useLogoutAction() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await appService.logout();
    } finally {
      clearAuthCookies();
      window.location.href = "/login";
    }
  };

  return { handleLogout, loading };
}


// ── Delete Account ────────────────────────────────────────────────────────

export function useDeleteAccountAction() {
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      const res = await appService.deleteAccount();
      if (res?.status === 200 || res?.status === 204) {
        clearAuthCookies();
        window.location.href = "/login";
      } else {
        toast.error(res?.data?.message || "Failed to delete account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteAccount, loading };
}

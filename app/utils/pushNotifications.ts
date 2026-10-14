"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported, type Messaging } from "firebase/messaging";
import appService from "@/app/services/appService";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

const FCM_TOKEN_STORAGE_KEY = "fcm_token";

function getStoredToken() {
  try {
    return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  } catch {
  }
}

function isConfigured() {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.messagingSenderId && firebaseConfig.appId && VAPID_KEY);
}

function warn(reason: string, err?: unknown) {
  console.warn(`[push] Device not registered: ${reason}`, err ?? "");
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    warn("browser has no Notification/serviceWorker support (needs HTTPS or localhost)");
    return null;
  }
  if (!isConfigured()) { warn("NEXT_PUBLIC_FIREBASE_* / VAPID env vars are missing"); return null; }
  if (!(await isSupported())) { warn("Firebase Messaging is not supported in this browser"); return null; }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getMessaging(app);
}

function registerServiceWorker() {
  const params = new URLSearchParams(firebaseConfig);
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${params.toString()}`);
}


export async function registerPushDevice({ prompt = false, force = false } = {}): Promise<boolean> {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return false;

    if (Notification.permission === "default" && prompt) {
      await Notification.requestPermission();
    }
    if (Notification.permission !== "granted") { warn(`notification permission is "${Notification.permission}"`); return false; }

    const fcmToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await registerServiceWorker(),
    });
    if (!fcmToken) { warn("Firebase returned no token"); return false; }

    if (!force && getStoredToken() === fcmToken) return true;

    const res = await appService.registerDevice({ fcmToken, platform: "web" });
    if (res?.status === 200 || res?.status === 201) {
      setStoredToken(fcmToken);
      return true;
    }
    warn(`POST /users/me/devices failed (status ${res?.status})`, res?.data);
    return false;
  } catch (err) {
    warn("Firebase getToken / service worker registration threw", err);
    return false;
  }
}

export async function unregisterPushDevice(): Promise<void> {
  const fcmToken = getStoredToken();
  if (!fcmToken) return;
  try {
    await appService.unregisterDevice(fcmToken);
  } finally {
    setStoredToken(null);
  }
}

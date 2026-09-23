"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

/**
 * 疑似ログイン状態。
 *
 * 実際の認証は行わない（開発方針 §0）。ブラウザの localStorage だけで
 * ログイン/未ログインを切り替え、ヘッダー表示やページ到達可否のデモに使う。
 *
 * localStorage は React の外側にある状態なので useSyncExternalStore で購読する
 * （SSR では常に未ログインを返し、ハイドレーション後に実際の値へ同期する）。
 */
export type DemoUser = {
  name: string;
  kana: string;
  email: string;
  tel: string;
  memberNo: string;
};

export const DEMO_USER: DemoUser = {
  name: "西脇 太郎",
  kana: "ニシワキ タロウ",
  email: "taro.nishiwaki@example.jp",
  tel: "090-1234-5678",
  memberNo: "U-004721",
};

const STORAGE_KEY = "nishiwaki-demo-auth";
const AUTH_EVENT = "nishiwaki-auth-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function getSnapshot(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function notifyChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

type AuthContextValue = {
  isLoggedIn: boolean;
  user: DemoUser | null;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function login() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // 保存できなくてもこのタブ内では通知だけ行う
    }
    notifyChange();
  }

  function logout() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // no-op
    }
    notifyChange();
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user: isLoggedIn ? DEMO_USER : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

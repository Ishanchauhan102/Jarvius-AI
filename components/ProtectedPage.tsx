"use client";

import { useEffect, useState } from "react";

type ProtectedPageProps = {
  children: React.ReactNode;
};

export default function ProtectedPage({
  children,
}: ProtectedPageProps) {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    checkLogin();
  }, []);

  async function checkLogin() {
    try {
      const response = await fetch("/api/me");

      if (!response.ok) {
        window.location.href = "/login";
        return;
      }

      const data = await response.json();

      if (!data.loggedIn) {
        window.location.href = "/login";
        return;
      }

      setCheckingAuth(false);
    } catch (error) {
      console.error("Login check failed:", error);
      window.location.href = "/login";
    }
  }

  if (checkingAuth) {
    return <p>Checking authentication...</p>;
  }

  return <>{children}</>;
}
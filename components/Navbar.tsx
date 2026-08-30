"use client";

import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch("/api/me");

        if (response.ok) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Login check failed:", error);
        setLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }

    checkLogin();
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="logo">
        🤖 Jarvius AI
      </div>

      <ul className="nav-links">
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/features">Features</a>
        </li>

        <li>
          <a href="/download">Download</a>
        </li>

        <li>
          <a href="/help">Help</a>
        </li>

        <li>
          <a href="/contact">Contact</a>
        </li>

        {!loading && (
          <li>
            {loggedIn ? (
              <button onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <a href="/login">
                Login
              </a>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
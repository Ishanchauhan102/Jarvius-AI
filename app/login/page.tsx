"use client";

import { useState } from "react";

export default function LoginPage() {
  // Login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // UI
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState("");

  // LOGIN
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Something went wrong");
    }
  }

  // REGISTER
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        // Clear registration fields
        setName("");
        setRegisterEmail("");
        setRegisterPassword("");

        // Switch back to Login
        setIsRegistering(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setMessage("Something went wrong");
    }
  }

  // REGISTER PAGE
  if (isRegistering) {
    return (
      <main>
        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />

          <br />
          <br />

          <input
            type="email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
            placeholder="Email"
            required
          />

          <br />
          <br />

          <input
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="Password"
            required
          />

          <br />
          <br />

          <button type="submit">
            Register
          </button>
        </form>

        <p>{message}</p>

        <p>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(false);
              setMessage("");
            }}
          >
            Login
          </button>
        </p>
      </main>
    );
  }

  // LOGIN PAGE
  return (
    <main>
      <h1>Jarvius AI Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        <br />
        <br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <p>{message}</p>

      <p>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => {
            setIsRegistering(true);
            setMessage("");
          }}
        >
          Register
        </button>
      </p>
    </main>
  );
}
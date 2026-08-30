"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    alert("Thank you! Your message has been submitted.");

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <main className="full-page">
      <h1>Contact Jarvius AI</h1>

      <p>
        Have a question or need assistance? Send us a message.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Message</label>
          <br />
          <textarea
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
          />
        </div>

        <br />

        <button type="submit">
          Send Message
        </button>
      </form>

      <br />

      <a href="/">
        <button type="button">
          Back to Home
        </button>
      </a>
    </main>
  );
}

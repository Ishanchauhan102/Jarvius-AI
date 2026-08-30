"use client";

import { useEffect ,useState} from "react";
import ProtectedPage from "../../components/ProtectedPage";
import "./dashboard.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};
type AIMode = "general" | "coding" | "study" | "writing" | "research";
type ChatHistory = {
  id: string;
  title: string;
  mode: string;
  createdAt: string;
  updatedAt: string;
};

const quickPrompts = [
  {
    icon: "💻",
    title: "Help me code",
    prompt: "Help me write and debug some code.",
  },
  {
    icon: "🧠",
    title: "Explain a concept",
    prompt: "Explain a difficult programming concept in simple terms.",
  },
  {
    icon: "📝",
    title: "Write something",
    prompt: "Help me write a professional piece of content.",
  },
  {
    icon: "📚",
    title: "Study with me",
    prompt: "Help me create a study plan for today.",
  },
];
const aiModes = [
  {
    id: "general" as AIMode,
    icon: "🧠",
    name: "General",
    description: "Everyday AI assistant",
  },
  {
    id: "coding" as AIMode,
    icon: "💻",
    name: "Coding",
    description: "Code, debugging & DSA",
  },
  {
    id: "study" as AIMode,
    icon: "📚",
    name: "Study",
    description: "Learn & understand concepts",
  },
  {
    id: "writing" as AIMode,
    icon: "✍️",
    name: "Writing",
    description: "Write & improve content",
  },
  {
    id: "research" as AIMode,
    icon: "🔬",
    name: "Research",
    description: "Analyze & research topics",
  },
];

export default function DashboardPage() {
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("general");
  const [chatId, setChatId] =
  useState<string | null>(null);
  
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
const [loadingHistory, setLoadingHistory] = useState(false);

useEffect(() => {
  loadChatHistory();
}, []);






  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm Jarvius. I'm ready to help you. What would you like to work on today?",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
  loadChatHistory();
}, []);

async function loadChatHistory() {
  try {
    setLoadingHistory(true);

    const response = await fetch("/api/chats");

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (data.success) {
      setChatHistory(data.chats);
    }
  } catch (error) {
    console.error(
      "Failed to load chat history:",
      error
    );
  } finally {
    setLoadingHistory(false);
  }
}

async function openChat(id: string) {
  try {
    setLoading(true);

    const response = await fetch(
      `/api/chats/${id}`
    );

    const data = await response.json();

    if (!data.success) {
      console.error(data.message);
      return;
    }

    setChatId(data.chat.id);
    setMessages(data.chat.messages);
    setSidebarOpen(false);
  } catch (error) {
    console.error(
      "Failed to open chat:",
      error
    );
  } finally {
    setLoading(false);
  }
}

  async function sendMessage(customMessage?: string) {
    const userMessage = (customMessage ?? message).trim();

    if (!userMessage || loading) return;

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

       body: JSON.stringify({
        message: userMessage,
       chatId,
        mode,
       }),
      });

      const data = await response.json();

      if (data.success) {
  if (data.chatId) {
    setChatId(data.chatId);
  }

  setMessages((previous) => [
    ...previous,
    {
      role: "assistant",
      content: data.reply,
    },
  ]);
} else {
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "Unable to connect to Jarvius.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
  setChatId(null);

  setMessages([
    {
      role: "assistant",
      content:
        "Hello! I'm Jarvius. I'm ready to help you. What would you like to work on today?",
    },
  ]);
}

  function handleNewChat() {
    clearChat();
    setSidebarOpen(false);
  }

  return (
    <ProtectedPage>
      <main className="dashboard">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}
        >
          <div className="sidebar-logo">
            <div className="logo-orb">✦</div>
            <span>Jarvius</span>
            <span className="logo-badge">AI</span>
          </div>

          <button
            className="new-chat-btn"
            onClick={handleNewChat}
          >
            <span>＋</span>
            New Chat
          </button>

          <div className="sidebar-label">
            WORKSPACE
          </div>

          <nav className="sidebar-nav">
            <a className="active" href="/dashboard">
              <span>⌂</span>
              Dashboard
            </a>

            <a href="/features">
              <span>✦</span>
              Features
            </a>

            <a href="/download">
              <span>↓</span>
              Download
            </a>

            <a href="/help">
              <span>?</span>
              Help Center
            </a>

            <a href="/contact">
              <span>✉</span>
              Contact
            </a>
          </nav>

          <div className="sidebar-label">
  RECENT
</div>

<div className="recent-chats">
  {loadingHistory ? (
    <div className="recent-loading">
      Loading chats...
    </div>
  ) : chatHistory.length === 0 ? (
    <div className="recent-empty">
      No conversations yet
    </div>
  ) : (
    chatHistory.map((chat) => (
      <button
        key={chat.id}
        className="recent-chat"
        onClick={() => openChat(chat.id)}
      >
        <div className="recent-icon">💬</div>

        <div>
          <strong>{chat.title}</strong>

          <span>
            {new Date(chat.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </button>
    ))
  )}
</div>

          <div className="sidebar-bottom">
            <div className="sidebar-ai-status">
              <div className="status-avatar">
                ✦
              </div>

              <div>
                <strong>Jarvius AI</strong>

                <span>
                  <i></i>
                  Online
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <section className="dashboard-content">
          {/* TOPBAR */}
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="mobile-menu"
                onClick={() => setSidebarOpen(true)}
              >
                ☰
              </button>

              <div>
                <div className="breadcrumb">
                  Workspace / <span>Dashboard</span>
                </div>

                <h1>AI Workspace</h1>
              </div>
            </div>

            <div className="topbar-right">
              <div className="online-status">
                <span></span>
                Jarvius Online
              </div>

              <div className="profile-avatar">
                I
              </div>
            </div>
          </header>

          {/* WELCOME */}
          <section className="welcome-card">
            <div className="welcome-content">
              <div className="welcome-label">
                <span></span>
                YOUR PERSONAL AI ASSISTANT
              </div>

              <h2>
                Think smarter.
                <br />
                <span>Build faster.</span>
              </h2>

              <p>
                Jarvius is ready to help you code, learn,
                write, analyze and solve problems.
              </p>

              <div className="welcome-tags">
                <span>⚡ Fast</span>
                <span>🧠 Intelligent</span>
                <span>🔒 Private</span>
              </div>
            </div>

            <div className="robot-container">
              <div className="robot-ring ring-one"></div>
              <div className="robot-ring ring-two"></div>

              <div className="robot-core">
                ✦
              </div>

              <div className="floating-dot dot-one"></div>
              <div className="floating-dot dot-two"></div>
              <div className="floating-dot dot-three"></div>
            </div>
          </section>





<div className="mode-selector">
  <button
    className={mode === "general" ? "mode-active" : ""}
    onClick={() => setMode("general")}
  >
    💬 General
  </button>

  <button
    className={mode === "coding" ? "mode-active" : ""}
    onClick={() => setMode("coding")}
  >
    💻 Coding
  </button>

  <button
    className={mode === "study" ? "mode-active" : ""}
    onClick={() => setMode("study")}
  >
    📚 Study
  </button>

  <button
    className={mode === "writing" ? "mode-active" : ""}
    onClick={() => setMode("writing")}
  >
    📝 Writing
  </button>

  <button
    className={mode === "research" ? "mode-active" : ""}
    onClick={() => setMode("research")}
  >
    🔎 Research
  </button>

  <button
    className={mode === "math" ? "mode-active" : ""}
    onClick={() => setMode("math")}
  >
    🧮 Math
  </button>
</div>






          {/* CHAT */}
          <section className="chat-card">
            <div className="chat-header">
              <div className="chat-title">
                <div className="chat-avatar">
                  ✦
                </div>

                <div>
                  <h3>Jarvius</h3>

                  <span>
                    AI Assistant · Ready to help
                  </span>
                </div>
              </div>
                <div className="mode-selector">
  {aiModes.map((aiMode) => (
    <button
      key={aiMode.id}
      className={`mode-btn ${
        mode === aiMode.id ? "active" : ""
      }`}
      onClick={() => setMode(aiMode.id)}
      disabled={loading}
      title={aiMode.description}
    >
      <span>{aiMode.icon}</span>
      {aiMode.name}
    </button>
  ))}
</div>

              <button
                className="clear-btn"
                onClick={clearChat}
                title="Clear conversation"
              >
                🗑 Clear
              </button>
            </div>

            {/* MESSAGES */}
            <div className="chat-body">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <div className="message-avatar">
                    {msg.role === "user" ? "I" : "✦"}
                  </div>

                  <div className="message-content">
                    <strong>
                      {msg.role === "user"
                        ? "You"
                        : "Jarvius"}
                    </strong>

                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message assistant-message">
                  <div className="message-avatar">
                    ✦
                  </div>

                  <div className="message-content">
                    <strong>Jarvius</strong>

                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INPUT */}
            <div className="chat-input-container">
              <button className="attach-btn">
                ＋
              </button>

              <input
                type="text"
                placeholder="Ask Jarvius anything..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button
                className="voice-btn"
                title="Voice input"
              >
                🎙
              </button>

              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !message.trim()}
              >
                ➤
              </button>
            </div>

            <div className="chat-disclaimer">
              Jarvius can make mistakes. Check important
              information.
            </div>
          </section>

          {/* QUICK ACTIONS */}
          <section className="quick-section">
            <div className="section-title">
              <div>
                <h2>What can I help with?</h2>
                <span>Start with a quick action</span>
              </div>
            </div>

            <div className="action-grid">
              {quickPrompts.map((action) => (
                <button
                  key={action.title}
                  className="action-card"
                  onClick={() =>
                    sendMessage(action.prompt)
                  }
                  disabled={loading}
                >
                  <div className="action-icon">
                    {action.icon}
                  </div>

                  <div className="action-text">
                    <strong>{action.title}</strong>

                    <p>{action.prompt}</p>
                  </div>

                  <span className="action-arrow">
                    →
                  </span>
                </button>
              ))}
            </div>
          </section>

          <footer className="dashboard-footer">
            <span>Jarvius AI</span>
            <span>•</span>
            <span>Personal AI Assistant</span>
          </footer>
        </section>
      </main>
    </ProtectedPage>
  );
}
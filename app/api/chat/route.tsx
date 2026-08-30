import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

type JWTPayload = {
  userId: string;
  email: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    // =========================
    // 1. CHECK AUTHENTICATION
    // =========================

    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const cookies = cookieHeader.split(";");

    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (!authCookie) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const token = authCookie
      .trim()
      .substring("auth_token=".length);

    // =========================
    // 2. VERIFY JWT
    // =========================

    let decoded: JWTPayload;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session",
        },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // =========================
    // 3. READ REQUEST
    // =========================

    const body = await request.json();

    const {
      message,
      chatId,
      mode = "general",
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required",
        },
        { status: 400 }
      );
    }

    // =========================
    // 4. CONNECT MONGODB
    // =========================

    const client = await clientPromise;

    const db = client.db("jarviusAI");

    const chats = db.collection("chats");

    // =========================
    // 5. AI MODES
    // =========================

    const systemPrompts: Record<string, string> = {
      general:
        "You are Jarvius AI, a helpful, intelligent and friendly personal AI assistant. Give clear, useful and accurate answers.",

      coding:
        "You are Jarvius AI Coding Assistant. Help users write, debug and understand code. Explain errors clearly, provide clean solutions, and mention time and space complexity when relevant.",

      study:
        "You are Jarvius AI Study Assistant. Explain concepts simply and step by step. Use examples and analogies when useful. Help the student understand instead of simply memorizing.",

      writing:
        "You are Jarvius AI Writing Assistant. Help users create professional, clear and well-structured content. Improve grammar, clarity and organization while preserving the user's intended meaning.",

      research:
        "You are Jarvius AI Research Assistant. Give structured, analytical and balanced answers. Break complex topics into sections, compare alternatives when useful, distinguish facts from assumptions, and mention uncertainty when appropriate.",

      math:
        "You are Jarvius AI Math Assistant. Solve mathematical problems step by step and explain the reasoning clearly.",
    };

    const systemPrompt =
      systemPrompts[mode] ||
      systemPrompts.general;

    // =========================
    // 6. FIND EXISTING CHAT
    // =========================

    let chat: {
      _id: ObjectId;
      userId: string;
      title: string;
      messages: ChatMessage[];
      mode: string;
      createdAt: Date;
      updatedAt: Date;
    } | null = null;

    if (chatId && ObjectId.isValid(chatId)) {
      chat = await chats.findOne({
        _id: new ObjectId(chatId),
        userId,
      }) as typeof chat;
    }

    // =========================
    // 7. CREATE NEW CHAT
    // =========================

    if (!chat) {
      const newChat = {
        userId,
        title:
          message.length > 50
            ? message.substring(0, 50) + "..."
            : message,
        messages: [] as ChatMessage[],
        mode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await chats.insertOne(newChat);

      chat = {
        ...newChat,
        _id: result.insertedId,
      };
    }

    // =========================
    // 8. ADD USER MESSAGE
    // =========================

    chat.messages.push({
      role: "user",
      content: message,
    });

    // =========================
    // 9. SEND HISTORY TO OLLAMA
    // =========================

    const ollamaMessages = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...chat.messages,
    ];

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3.2",
          messages: ollamaMessages,
          stream: false,
        }),
      }
    );

    if (!ollamaResponse.ok) {
      const errorText =
        await ollamaResponse.text();

      console.error(
        "Ollama error:",
        errorText
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to connect to Ollama",
        },
        { status: 500 }
      );
    }

    const data = await ollamaResponse.json();

    const reply =
      data.message?.content?.trim() ||
      "No response from Ollama.";

    // =========================
    // 10. ADD AI RESPONSE
    // =========================

    chat.messages.push({
      role: "assistant",
      content: reply,
    });

    // =========================
    // 11. SAVE CHAT
    // =========================

    await chats.updateOne(
      {
        _id: chat._id,
        userId,
      },
      {
        $set: {
          messages: chat.messages,
          mode,
          updatedAt: new Date(),
        },
      }
    );

    // =========================
    // 12. RETURN RESPONSE
    // =========================

    return NextResponse.json({
      success: true,
      reply,
      chatId: chat._id.toString(),
    });
  } catch (error) {
    console.error(
      "Chat API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to get AI response",
      },
      { status: 500 }
    );
  }
}
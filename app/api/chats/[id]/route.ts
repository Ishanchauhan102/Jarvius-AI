import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

type JWTPayload = {
  userId: string;
  email: string;
};

export async function GET(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    // =========================
    // 1. CHECK AUTH COOKIE
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
    // 3. GET CHAT ID
    // =========================

    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid chat ID",
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
    // 5. FIND CHAT
    // =========================

    const chat = await chats.findOne({
      _id: new ObjectId(id),
      userId,
    });

    if (!chat) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat not found",
        },
        { status: 404 }
      );
    }

    // =========================
    // 6. RETURN CHAT
    // =========================

    return NextResponse.json({
      success: true,
      chat: {
        id: chat._id.toString(),
        title: chat.title,
        mode: chat.mode || "general",
        messages: chat.messages || [],
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
    });
  } catch (error) {
    console.error(
      "Get chat error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load chat",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

type JWTPayload = {
  userId: string;
  email: string;
};

export async function GET(request: Request) {
  try {
    // =========================
    // 1. GET AUTH COOKIE
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
    // 3. CONNECT MONGODB
    // =========================

    const client = await clientPromise;

    const db = client.db("jarviusAI");

    const chats = db.collection("chats");

    // =========================
    // 4. GET USER'S CHATS
    // =========================

    const userChats = await chats
      .find(
        { userId },
        {
          projection: {
            title: 1,
            mode: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        }
      )
      .sort({ updatedAt: -1 })
      .limit(20)
      .toArray();

    // =========================
    // 5. RETURN CHATS
    // =========================

    return NextResponse.json({
      success: true,
      chats: userChats.map((chat) => ({
        id: chat._id.toString(),
        title: chat.title,
        mode: chat.mode,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      })),
    });
  } catch (error) {
    console.error(
      "Get chats error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load chats",
      },
      { status: 500 }
    );
  }
}
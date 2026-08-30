import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Get cookies sent by the browser
    const cookieHeader = request.headers.get("cookie");

    if (!cookieHeader) {
      return Response.json(
        {
          loggedIn: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    // Find auth_token
    const cookies = cookieHeader.split(";");

    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("auth_token=")
    );

    if (!authCookie) {
      return Response.json(
        {
          loggedIn: false,
          message: "Not logged in",
        },
        { status: 401 }
      );
    }

    const token = authCookie.split("=")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: string;
      email: string;
    };

    // Find user in MongoDB
    const client = await clientPromise;

    const db = client.db("jarviusAI");

    const user = await db.collection("users").findOne({
      email: decoded.email,
    });

    if (!user) {
      return Response.json(
        {
          loggedIn: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }

    return Response.json({
      loggedIn: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);

    return Response.json(
      {
        loggedIn: false,
        message: "Invalid or expired login",
      },
      { status: 401 }
    );
  }
}
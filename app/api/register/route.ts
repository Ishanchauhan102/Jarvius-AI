import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Check required fields
    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const db = client.db("jarviusAI");

    const users = db.collection("users");

    // Check whether email already exists
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "Email already registered",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      message: "Registration successful",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return Response.json(
      {
        success: false,
        message: "Registration failed",
      },
      { status: 500 }
    );
  }
}
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;

    const db = client.db("jarviusAI");

    const result = await db.collection("test").insertOne({
      message: "Hello MongoDB!",
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      message: "Data inserted successfully!",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("MongoDB insert error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to insert data",
      },
      { status: 500 }
    );
  }
}
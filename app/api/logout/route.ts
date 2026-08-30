export async function POST() {
  const response = Response.json({
    success: true,
    message: "Logout successful",
  });

  response.headers.append(
    "Set-Cookie",
    "auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );

  return response;
}
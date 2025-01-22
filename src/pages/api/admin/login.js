import { createClient } from "@sanity/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  // Add your authorized admin emails
  const authorizedEmails = [
    "admin@vega.earth", // Replace with your admin email
  ];

  // Very basic authentication - you should implement more secure methods
  if (
    !authorizedEmails.includes(email) ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  try {
    const client = createClient({
      projectId: "yqk7lu4g",
      dataset: "production",
      apiVersion: "2023-03-11",
      token: process.env.SANITY_TOKEN,
      useCdn: false,
    });

    // Verify connection to Sanity
    await client.fetch('*[_type == "system"][0]');

    // Set session cookie or token here
    // This is a basic example - implement proper session management
    res.setHeader("Set-Cookie", `adminSession=true; Path=/; HttpOnly`);

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

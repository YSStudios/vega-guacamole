import { DataCache } from "../../../utils/cache";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Only allow cache clearing in development or with admin auth
  const isAdmin = req.headers.authorization === `Bearer ${process.env.ADMIN_TOKEN}` || 
                 req.cookies?.isAdmin === "true";

  if (process.env.NODE_ENV === 'production' && !isAdmin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const { key } = req.body;
    
    if (key) {
      DataCache.clear(key);
      return res.status(200).json({ 
        message: `Cache cleared for key: ${key}`,
        success: true 
      });
    } else {
      DataCache.clear();
      return res.status(200).json({ 
        message: "All cache cleared",
        success: true 
      });
    }
  } catch (error) {
    console.error("Cache clear error:", error);
    return res.status(500).json({
      message: "Failed to clear cache",
      success: false,
      error: error.message
    });
  }
}
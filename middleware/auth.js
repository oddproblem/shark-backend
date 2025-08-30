import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    // 🔍 Debug logs
    console.log("🔍 Cookies received:", req.cookies);
    console.log("🔍 Auth Header:", req.headers['authorization']);

    // 1️⃣ Extract token: cookie first, then Authorization header
    const token =
      req.cookies?.token ||
      (req.headers['authorization']?.startsWith("Bearer ")
        ? req.headers['authorization'].split(" ")[1]
        : null);

    if (!token) {
      console.warn("⚠️ No token found in cookies or headers");
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 2️⃣ Verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // 3️⃣ Fetch user from DB
    const user = await User.findById(payload.id).select("name role"); // select only needed fields
    if (!user) {
      console.warn("⚠️ No user found for ID:", payload.id);
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ Attach user info to request
    req.user = {
      id: user._id.toString(),
      role: user.role?.toLowerCase().trim(),
      name: user.name,
    };

    console.log("✅ Authenticated user:", req.user);

    // 5️⃣ Proceed to next middleware/route
    next();
  } catch (err) {
    console.error("❌ Auth middleware error:", err);
    return res.status(500).json({ message: "Server error in authentication" });
  }
};

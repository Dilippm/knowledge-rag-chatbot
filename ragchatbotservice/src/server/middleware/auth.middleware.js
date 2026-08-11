import jwt from "jsonwebtoken";
const socketAuthMiddleware = (socket, next) => {
  try {
    let token = socket.handshake.auth?.token;

    // Fallback for Postman
    if (!token) {
      const authHeader = socket.handshake.headers.authorization;

      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next(new Error("Authentication token is missing."));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    socket.data.userId = payload.sub;
    socket.data.sessionId = payload.sessionId;
    socket.data.role = payload.role;
    

    next();
  } catch (error) {
 
    next(new Error("Unauthorized"));
  }
};

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new Error("Authentication Failed"));
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    return next();
  } catch {
    return next(new Error("Invalid or expired token"));
  }
};
export default {
    socketAuthMiddleware,
    authMiddleware,
};

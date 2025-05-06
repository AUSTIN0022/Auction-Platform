import jwt from 'jsonwebtoken';
import { User } from '../model/DBModel.js';

export const authorizeRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ success: false, message: "Authentication required" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  };
};

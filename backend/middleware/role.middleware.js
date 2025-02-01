// middleware/role.middleware.js

export const customerRoute = (req, res, next) => {
    if (req.user && req.user.role === "customer") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied - Customer only" });
    }
  };
  
  export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied - Admin only" });
    }
  };
  
  export const sellerRoute = (req, res, next) => {
    if (req.user && req.user.role === "seller") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied - Seller only" });
    }
  };
  
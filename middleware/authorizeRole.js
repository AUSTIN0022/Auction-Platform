


export const authorizeRole = (requiredRoles) => {
  // Convert single role to array for consistent handling
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  
  return (req, res, next) => {
    // Since isLoggedIn middleware should run first, we already have req.user
    if (!req.user) {
      return res.status(500).json({ 
        success: false, 
        message: "Server error: User not authenticated" 
      });
    }
    
    // Check if user has one of the required roles
    if (!roles.includes(req.user.role)) {
      // For API requests
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(403).json({ 
          success: false, 
          message: "Access denied" 
        });
      }
      // For browser requests
      return res.redirect('/error?type=forbidden&message=You do not have permission to access this page');
    }
    
    next();
  };
};
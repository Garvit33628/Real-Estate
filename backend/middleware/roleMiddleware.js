
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in first.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.`,
      });
    }

    next();
  };
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin permissions required.',
    });
  }
  next();
};

export const isOwner = (req, res, next) => {
  return isAdmin(req, res, next);
};

export const isAdminOrOwner = (req, res, next) => {
  return isAdmin(req, res, next);
};

export const isEmployee = (req, res, next) => {
  // Optional future role:
  // if (!req.user || !['admin', 'agent'].includes(req.user.role)) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin credentials required.',
    });
  }
  next();
};
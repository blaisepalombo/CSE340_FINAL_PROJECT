export function checkLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect("/login");
    }

    if (!allowedRoles.includes(req.session.user.role_name)) {
      return res.status(403).send("You do not have permission to access this page.");
    }

    next();
  };
}

export function setNavLocals(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.user);
  res.locals.user = req.session.user || null;
  next();
}

export const RoleGuard = (roles) => (req, res, next) => {
    if (roles.includes(req.session.user.role)) {
        next();
    } else {
        res.redirect('/index.html');
    }
};
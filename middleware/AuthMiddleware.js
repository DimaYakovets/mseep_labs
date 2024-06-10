
import path from 'path';

const sendFile = (name) => (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', `${name}.html`));
};

export const AuthMiddleware = () => (req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);

    if(req.path.endsWith(".css")) {
        return next();
    }

    if (!req.session.authenticated && !req.path.includes('/login')) {
        res.status(401);
        return sendFile('login')(req, res);
    } else if (req.session.authenticated && req.path === '/login') {
        return res.redirect(`/`);
    }

    next();
};

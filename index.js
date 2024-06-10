import express from 'express';
import bodyparser from 'body-parser'
import session from 'express-session';
import sfs from 'session-file-store';
import { initDb } from './dao/dbcontext.js'

import { userService } from './services/userService.js';

import { modelController } from './controllers/modelController.js';
import { AuthMiddleware } from './middleware/AuthMiddleware.js';
import { RoleGuard } from './middleware/RoleGuard.js';
import { handler } from './handler.js';

const API_FILTERS = {
    admin: {
        '/users': ['GET', 'POST', 'PUT', 'DELETE'],
        '/recipes': ['GET', 'POST', 'PUT', 'DELETE'],
        '/resources': ['GET', 'POST', 'PUT', 'DELETE'],
    },
    manager: {
        '/recipes': ['GET', 'POST', 'PUT', 'DELETE'],
        '/resources': ['GET', 'POST', 'PUT', 'DELETE'],
    },
    storekeeper: {
        '/resources': ['GET', 'POST', 'PUT', 'DELETE'],
    }
}

const ROLE_LINKS = {
    admin: [
        { href: "/index.html", label: "Головна" },
        { href: "/production.html", label: "Виробництво" },
        { href: "/create_resource.html", label: "Створити ресурс" },
        { href: "/create_product.html", label: "Створити продукт" },
        { href: "/balance.html", label: "Запас товарів" },
        { href: "/users.html", label: "Користувачі" }
    ],
    manager: [
        { href: "/index.html", label: "Головна" },
        { href: "/production.html", label: "Виробництво" },
        { href: "/create_resource.html", label: "Створити ресурс" },
        { href: "/create_product.html", label: "Створити продукт" },
        { href: "/balance.html", label: "Запас товарів" }
    ],
    storekeeper: [
        { href: "/index.html", label: "Головна" },
        { href: "/create_resource.html", label: "Створити ресурс" },
        { href: "/balance.html", label: "Запас товарів" }
    ],
};

const checkPermissions = (permissions) => {
    return (req, res, next) => {
        const userRole = req.session.user.role; // Assuming you have user role attached to req.user
        const method = req.method;


        console.log(req.path);

        // Find a route in permissions that includes the requested path
        const route = Object.keys(permissions[userRole] || {}).find(route => req.path.includes(route));

        if (route && permissions[userRole][route].includes(method)) {
            next(); // User has permission, proceed to the next middleware or route handler
        } else {
            res.status(403).json({ message: 'Forbidden' }); // User does not have permission
        }
    };
};

const sendFile = (name) => (req, res) => {
    res.sendFile(`${__dirname}/public/${name}.html`);
};

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({
    secret: '230v-k94tu7098w45ybmq-0v3wutvy9eb8',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new (sfs(session))()
}));
app.use(AuthMiddleware());

app.get('/login', sendFile('login'));
app.post('/login', handler(async (req, res) => {
    const { username, password } = req.body;

    const user = await userService.login(username, password);

    if (user) {
        req.session.save(() => {
            req.session.authenticated = true;
            req.session.user = user;

            res.redirect('/index.html');
        });

    } else {
        res.redirect('/login');
    }
}));
app.get('/logout', (req, res) => {
    req.session.save(() => {
        req.session.authenticated = false;
        req.session.user = null;

        res.redirect('/login');
    });
});

app.get('/userinfo', (req, res) => {
    res.json({
        user: req?.session?.user?.username ?? null,
        routes: ROLE_LINKS[req?.session?.user?.role ?? 0] ?? []
    });
});

app.use('/api/model', checkPermissions(API_FILTERS), modelController);

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.endsWith('.css') || req.path.endsWith('.js')) {
        return next();
    }

    const role = req.session.user.role;
    const routes = ROLE_LINKS[role] ?? []

    const allowed = routes.find(r => r.href === req.path);

    if (!allowed) {
        res.status(403);
        return sendFile('forbidden')(req, res);
    }

    next();
});

app.use(express.static('public'));
app.use((error, req, res, next) => {
    console.error(error)

    res.status(500).send('Unhandled error')
});

initDb().then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
        console.log("Listening port 3000");
    });
});

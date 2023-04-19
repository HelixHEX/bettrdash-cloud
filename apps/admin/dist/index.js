import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import { Database, Resource } from "@adminjs/prisma";
import { prisma } from "db";
import session from "express-session";
import connectRedis from "connect-redis";
import redis from "redis";
import bcrypt from "bcrypt";
const RedisStore = connectRedis(session);
const redisClient = redis.createClient(process.env.REDIS_URL);
const PORT = process.env.PORT || 5090;
AdminJS.registerAdapter({
    Resource: Resource,
    Database: Database,
});
const authenticate = async (email, password) => {
    const admin = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
            if (admin.role === "admin") {
                return admin;
            }
        }
    }
    return null;
};
const start = async () => {
    const app = express();
    const dmmf = prisma._baseDmmf;
    const adminOptions = {
        resources: [
            {
                resource: { model: dmmf.modelMap.User, client: prisma },
                options: {},
            },
            {
                resource: { model: dmmf.modelMap.Project, client: prisma },
                options: {},
            },
            {
                resource: { model: dmmf.modelMap.Apikey, client: prisma },
                options: {},
            },
        ],
    };
    const admin = new AdminJS(adminOptions);
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: "somepassword",
    }, null, {
        store: new RedisStore({ client: redisClient }),
        secret: "somepassword",
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production",
        },
        name: "adminjs",
    });
    app.use(admin.options.rootPath, adminRouter);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
};
start();

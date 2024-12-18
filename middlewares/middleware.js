const jwt = require("jsonwebtoken");
const db = require("../models");
const models = db;
const Sequelize = require("sequelize");
const blackList = new Set();

async function authentication(req, res, next) {
    try {
        let bearerToken = req.headers?.authorization;
        if (!bearerToken) {
            return res.status(401).json(
                {
                    "status": 401,
                    "data": null,
                    "message": "Unauthorized Access",
                    "error": null
                   }
            )
        }
        bearerToken = bearerToken.split("Bearer ")?.[1];
        if (blackList.has(bearerToken)) {
            return res.status(401).json(
                {
                    "status": 401,
                    "data": null,
                    "message": "Unauthorized Access",
                    "error": null
                   }
            )
        }
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json(
                    {
                        "status": 401,
                        "data": null,
                        "message": "Unauthorized Access",
                        "error": null
                       }
                )
            }
            req.user = decoded;
            if (req.route.path == "/logout") {
                blackList.add(bearerToken);
                setTimeout(() => {
                    blackList.delete(bearerToken);
                }, 15 * 60 * 1000);
            }
            next();
        });
    } catch (e) {
        next(e);
    }
}
const roleBasedAccessControl = (accessRoles) => {
    return async (req, res, next) => {
        try {
            let userRole = req.user?.role;
            if(accessRoles[userRole]!==1 ) {
               return res.status(403).json(
                {
                    "status": 403,
                    "data": null,
                    "message": "Forbidden Access/Operation not allowed.",
                    "error": null
                   }
               )
            }
            next()
        } catch (e) {
            next(e);
        }
    };
};
module.exports = { authentication, roleBasedAccessControl };

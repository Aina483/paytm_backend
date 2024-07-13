const { JWT_TOKEN } = require("./config");
const jwt = require("jsonwebtoken");

//authorization midleware, to only let authenticated user to access specific routes
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    // Bearer Token- this is the format of the authorizaton header
    //to generate  the token from the header we use the split function
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_TOKEN);

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
};

module.exports = {
    authMiddleware
}
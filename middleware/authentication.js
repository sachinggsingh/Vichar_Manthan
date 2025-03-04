const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenName = req.cookies[cookieName];
        if (!tokenName) {
            // return res.redirect('/user/signin');
            return next();
        }
        try {
            const userPayload = validateToken(tokenName);
            req.user = userPayload;
            return next();
        }
        catch (error) { }
        return next();
    }
}

module.exports = checkForAuthenticationCookie;
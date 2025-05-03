const jwt = require("jsonwebtoken");

function authManager() {
    verify = function (req, res, next) {
        const token = req.cookies.token;
        try{
            const verified = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = verified.userId;
            next();
        }
        catch(e){
            return res.status(401).send({error: "Invalid token."});
        }
    }
}

const auth = authManager();
module.exports = auth;
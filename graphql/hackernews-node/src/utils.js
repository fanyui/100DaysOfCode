const jwt = require('jsonwebtoken');
const APP_SECRET = 'Graphsql';
function getTokenPayload(token){
    return jwt.verify(token, APP_SECRET)
}
function getUserId(req, authtoken ){
    if(req){
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = authHeader.replace('Bearer ', '')
            if(!token){
                throw new Error('No token found')
            }
            const {userId} = getTokenPayload(token)
            return userId
            }
    }
    else if(authtoken){
        const {userId} = getTokenPayload(authtoken)
        return userId
    }
    throw new Error('Not authenticated.')
}

module.exports = {
    APP_SECRET,
    getUserId
};
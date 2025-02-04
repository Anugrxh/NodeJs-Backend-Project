const expressJwt = require('express-jwt');
require('dotenv').config();

// function authJwt() {
//     const secret = process.env.secret;
//     const api = process.env.API_URL;

//     return expressJwt({
//         secret: secret,
//         algorithms: ['HS256'],
//         isRevoked : isRevoked
//     }).unless({
//         path: [
//             { url: new RegExp(`${api}/products(.*)`), methods: ['GET', 'OPTIONS'] },
//             { url: new RegExp(`${api}/categories(.*)`), methods: ['GET', 'OPTIONS'] },
//             {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
//             `${api}/users/login`,
//             `${api}/users/register`,
//             `${api}/users`
//         ]
//     });
// }
function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressJwt({
        secret: secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            { url: new RegExp(`${api}/products(.*)`), methods: ['GET', 'OPTIONS'] },
            { url: new RegExp(`${api}/categories(.*)`), methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            `${api}/users/login`,
            `${api}/users/register`,
            `${api}/users`, // Allow unauthenticated access to the user list
        ]
    });
}



async function isRevoked(req,payload,done) {

    if (!payload.isAdmin){
        done(null,true)
    }
    done();
}


module.exports = authJwt;

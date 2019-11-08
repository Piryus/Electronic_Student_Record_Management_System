const keys = require('./config/keys');
const User = require('./models/User');

module.exports = {
    cookie: {
        name: 'auth',
        password: keys.authCookiePassword,
        isSecure: false
    },
    redirectTo: '/login',
    validateFunc: async (request, session) => {
        const user = await User.findOne({ _id: session.id });
        if(user === null)
            return { valid: false };
        else
            return { valid: true, credentials: user };
    }
};
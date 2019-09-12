const { loginCheck } = require("../controller/user");

const handleUser = (req, res) => {
    const method = req.method;

    //删除博客
    if (method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body;
        const result = loginCheck(username, password)

    }
}
module.exports = handleUser;
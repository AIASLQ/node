const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel")
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
}

const handleUser = (req, res) => {
    const method = req.method;
    //删除博客
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body;
        const username = req.query.username || "";
        const password = req.query.password || "";
        const result = login(username, password);
        return result.then(data => {
            if (data.username && data.realname) {
                // 设置 session 
                req.session.username = data.username;
                req.session.realname = data.realname;
                console.log(req.session);
                // 操作cookie 
                // res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
                return new SuccessModel(data);
            } else {
                return new ErrorModel('登陆失败');
            }
        })
    }
    // 登陆验证的测试
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }));
        }
        return Promise.resolve(new ErrorModel('尚未登陆'));
    }
}

module.exports = handleUser;
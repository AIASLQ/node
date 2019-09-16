const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');
const getCookieExpires = () => {
    const d = new Date();
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
    return d.toGMTString();
};
// session 数据
const SESSION_DATA = {};
// 处理post请求
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return
        }
        let postData = ""; //post请求返回数据
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData) {
                resolve({});
                return
            }
            resolve(JSON.parse(postData));
            return
        })
    })
    return promise;
}
const serverHandle = (req, res) => {
    // 设置返回数据格式 JSON
    res.setHeader('Content-type', 'application/json');
    // 处理path
    const url = req.url;
    req.path = url.split('?')[0];
    // 解析参数
    req.query = querystring.parse(url.split('?')[1]);
    // 解析cookie
    req.cookie = {};
    const cookieStr = req.headers.cookie || '';
    if (cookieStr) {
        cookieStr.split(';').forEach(item => {
            //不存在cookie 
            if (!item) {
                return false;
            }
            // 存在cookie
            const arr = item.split('=');
            const key = arr[0].trim();
            const val = arr[1].trim();
            req.cookie[key] = val;
        })
    }
    // 解析session
    let userId = req.cookie.userid;
    let needSetCookie = false;
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {};
        }
    } else {
        needSetCookie = true;
        userId = `${Date.now()}_${Math.random()}`;
        SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];
    console.log(req.session);
    // 获取post数据
    getPostData(req).then(postData => {
        req.body = postData;
        // 处理blog 路由  blogResult是一个promise
        const blogResult = handleBlogRouter(req, res);
        if (blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        // 处理 user 路由
        const userData = handleUserRouter(req, res);
        if (userData) {
            userData.then(data => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`);
                }
                res.end(
                    JSON.stringify(data)
                )
            })
            return
        }
        // 未匹配路由
        res.writeHead(404, { "Content-type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
    })
}
module.exports = serverHandle;
const querystring = require('querystring');
const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

// 处理post请求
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            return resolve({});
        }
        if (req.headers['content-type'] !== 'application/json') {
            return resolve({});
        }
        let postData = "";
        req.on('data', chunk => {
            postData += chunk.toString();
        })
        req.on('end', () => {
            if (!postData) {
                return resolve({});
            }
            return resolve(JSON.parse(postData));
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

    // 获取post数据
    getPostData(req).then(postData => {
        req.body = postData;

        // 处理blog 路由
        const blogData = handleBlogRouter(req, res);
        if (blogData) {
            return res.end(
                JSON.stringify(blogData)
            )
        }

        // 处理 user 路由
        const userData = handleUserRouter(req, res);
        if (userData) {
            return res.end(
                JSON.stringify(userData)
            )
        }

        // 未匹配路由
        res.writeHead(404, { "Content-type": "text/plain" });
        res.write("404 Not Found\n");
        res.end();
    })


}

module.exports = serverHandle;
const env = process.env.NODE_ENV; //环境变量

let MYSQL_CONF;
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        port: '3306',
        database: 'myblogs'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'rootroot',
        port: '3306',
        database: 'myblogs'
    }
}

module.exports = {
    MYSQL_CONF
}
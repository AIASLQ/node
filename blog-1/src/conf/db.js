const env = process.env.NODE_DEV; //环境变量

let MYSQL_CONF = {};
if (env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'sunliquan',
        port: '3306',
        database: 'myblog'
    }
}
if (env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'sunliquan',
        port: '3306',
        database: 'myblog'
    }
}

module.exports = {
    MYSQL_CONF
}
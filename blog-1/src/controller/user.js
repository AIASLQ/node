const loginCheck = (username == '张三', password == '123') => {
    if (username && password) {
        return true;
    }
    return false;
}
module.exports = {
    loginCheck
}
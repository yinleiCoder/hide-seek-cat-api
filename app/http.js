const axios = require('axios').default;

const http = axios.create({
    baseURL: 'https://www.zcool.com.cn',
});

http.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

http.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

module.exports = http;
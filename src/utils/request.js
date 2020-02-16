import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import auth from '../auth/auth';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://47.105.93.192/api',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if (auth.authenticated) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 20000) {
        Message({
            message: res.message || 'Error',
            type: 'error',
            duration: 5 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
            // to re-login
            MessageBox.confirm('你已经退出登录, 你可以点击取消并留在此页面, 或重新登录', '确认退出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                localStorage.clear();
                // this.$router.push('/login');
                location.reload();
                // store.dispatch('user/resetToken').then(() => {
                //     location.reload()
                // })
            })
        }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;

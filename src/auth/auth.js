import request from '../utils/request';
import {getUserInfo} from '../api/user';
export default{
    data:{
        authenticated:false
    },
    login(context, info) {
        request({
            url: '/admins/login',
            method: 'post',
            info,
            headers:{
                'Content-Type':'application/json;'
            },
            transformRequest: [function() {
                return JSON.stringify(info)
            }]
        }).then(res => {
            console.log(res);
            localStorage.setItem('token', res.data[0]);
            this.authenticated = true;
            context.$message.success('登录成功');
            getUserInfo().then(res => {
                localStorage.setItem('id', res.data[0].id);
                localStorage.setItem('ms_username', res.data[0].name);
                context.$router.push('/');
            }).catch((error) => {
                context.$message.success(error);
            });
        }).catch(error => {
            context.$message.error('登录失败，检查用户名和密码是否正确');
        });
    },
    getAuthHeader(){
        return {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    },
    getToken(){
        return 'Bearer ' + localStorage.getItem('token');
    },
    checkAuth(){
        var token = localStorage.getItem('token')
        if(token){
            this.authenticated = true
        }else{
            this.authenticated = false
        }
    }
}
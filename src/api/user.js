import request from '../utils/request';

export const getUserInfo = () => {
    return request({
        url: '/admins/info',
        method: 'get'
    });
};

export const getUserPic = idCardNumberInfo => {
    return request({
        url: '/students/pic',
        method: 'post',
        idCardNumberInfo,
        headers:{
            'Content-Type':'application/json;'
        },
        transformRequest: [function() {
            return JSON.stringify(idCardNumberInfo)
        }]
    });
};
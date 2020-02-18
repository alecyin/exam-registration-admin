import request from '../utils/request';

export const resetPass = row => {
    return request({
        url: '/admins/reset-pass',
        method: 'put',
        headers:{
            'Content-Type':'application/json;'
        },
        row,
        transformRequest: [function() {
            return JSON.stringify(row)
        }]
    });
};
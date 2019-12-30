import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/examinee-notes',
        method: 'get'
    });
};

export const editData = content => {
    return request({
        url: '/examinee-notes',
        method: 'put',
        headers:{
            'Content-Type':'application/json;'
        },
        content,
        transformRequest: [function() {
            return JSON.stringify(content)
        }]
    });
};
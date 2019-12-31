import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/examinee-notes',
        method: 'get'
    });
};

export const editData = form => {
    return request({
        url: '/examinee-notes',
        method: 'put',
        headers:{
            'Content-Type':'application/json;'
        },
        form,
        transformRequest: [function() {
            return JSON.stringify(form)
        }]
    });
};
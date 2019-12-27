import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: 'students',
        method: 'get',
        params: query
    });
};

export const editStudent = form => {
    return request({
        url: 'students/' + form.id,
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

export const delStudent = id => {
    return request({
        url: 'students/' + id,
        method: 'delete'
    });
};

export const delAllStudent = str => {
    return request({
        url: 'students',
        method: 'delete',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded;'
        },
        params: {
            'ids': str
        }
    });
};


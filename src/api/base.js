import request from '../utils/request';

export const fetchData = ({ mode, query }) => {
    return request({
        url: mode,
        method: 'get',
        params: query
    });
};

export const editData = ({ mode, form }) => {
    return request({
        url: mode + '/' + form.id,
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

export const addData = ({ mode, form }) => {
    return request({
        url: mode,
        method: 'post',
        headers:{
            'Content-Type':'application/json;'
        },
        form,
        transformRequest: [function() {
            return JSON.stringify(form)
        }]
    });
};

export const delData = ({ mode, id }) => {
    return request({
        url: mode + '/' + id,
        method: 'delete'
    });
};

export const delAllData = ({ mode, str }) => {
    return request({
        url: mode,
        method: 'delete',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded;'
        },
        params: {
            'ids': str
        }
    });
};

export const fetchAllEnabledData = mode => {
    return request({
        url: mode + '/enabled',
        method: 'get'
    });
};

export const fetchEnabledDataByCondition = ({qMode, condition}) => {
    return request({
        url: qMode + '/enabled-condition',
        method: 'get',
        params: condition
    });
};

export const getCascader = qMode => {
    return request({
        url: qMode + '/cascader',
        method: 'get'
    });
};

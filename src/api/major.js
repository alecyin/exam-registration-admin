import request from '../utils/request';

export const fetchEnabledData = query => {
    return request({
        url: '/majors/enabled',
        method: 'get',
        params: query
    });
};
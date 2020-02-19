import request from '../utils/request';

export const getCount = () => {
    return request({
        url: '/index/count',
        method: 'get'
    });
};

export const getSite = () => {
    return request({
        url: '/index/site',
        method: 'get'
    });
};

export const getPercent = () => {
    return request({
        url: '/index/percent',
        method: 'get'
    });
};





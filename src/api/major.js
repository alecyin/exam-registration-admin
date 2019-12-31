import request from '../utils/request';

export const fetchEnabledDataByMajorId = majorId => {
    return request({
        url: '/majors/enabled',
        method: 'get',
        params: majorId
    });
};
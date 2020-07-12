import request from './request'

export function saveImages(data) {
    return request({
        url: '/supermarket/good-images/save',
        method: 'put',
        data
    })
}
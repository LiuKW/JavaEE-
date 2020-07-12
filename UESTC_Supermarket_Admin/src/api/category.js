import request from './request'

export function fetchList(params) {
    return request({
        url: '/supermarket/category/list',
        method: 'get',
        // params,
    })
}

export function add(data) {
    return request({
        url: '/supermarket/category/save',
        method: 'put',
        data,
    })
}

export function del(data) {
    return request({
        url: '/supermarket/category/delete',
        method: 'delete',
        data,
    })
}

export function edit(data) {
    return request({
        url: '/supermarket/category/update',
        method: 'post',
        data,
    })
}
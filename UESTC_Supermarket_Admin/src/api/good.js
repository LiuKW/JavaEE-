import request from './request'

export function search(catId, other) {
    return request({
        url: '/supermarket/good/search',
        method: 'get',
        params: {
            catId,
            other,
        }
    })
}

export function pageList(currentPage, pageSize) {
    return request({
        url: '/supermarket/good/pages',
        method: 'get',
        params: {
            page: currentPage,
            size: pageSize
        }
    })
}

// 不用了，改分页了
export function fetchList(params) {
    return request({
        // url: '/supermarket/user-address/20'
        url: '/supermarket/good/list',
        method: 'get',
        // params,
    })
}

export function infoGood(id) {
    return request({
        url: `/supermarket/good/${id}`,
        method: 'get',
    })
}

export function update(data) {
    return request({
        url: '/supermarket/good/admin/good',
        method: 'put',
        data
    })
}

export function del(delIds) {
    return request({
        url: '/supermarket/good/admin/good/deletes',
        method: 'delete',
        data: delIds
    })
}

export function save(data) {
    return request({
        url: '/supermarket/good/admin/good',
        method: 'post',
        data
    })
}

export function fetchCategory(params) {
    return request({
        // url: '/supermarket/user-address/20'
        url: '/supermarket/category/list',
        method: 'get',
        // params,
    })
}
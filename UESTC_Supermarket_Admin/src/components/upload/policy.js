// import http from '@/utils/httpRequest.js'
import request from '@/api/request'

export function policy() {
    return new Promise((resolve, reject) => {
        request({
            url: "/oss/policy",
            method: "get",
        }).then(({
            data
        }) => {
            resolve(data);
        })
    });
}
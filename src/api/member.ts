import request from "@/utils/request";

export function memberLogin(data) {
    return request({
        method: 'POST',
        url: '/sso/login',
        header: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        params: data,
    });
}

export function memberInfo(){
    return request({
        method:'GET',
        url:'/sso/info',
    });
}
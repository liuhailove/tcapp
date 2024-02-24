import request from "@/utils/request";

export function fetchRecommendProductList(params) {
    return request({
        method: 'GET',
        url: '/home/recommendProductList',
        params: params,
    });
}
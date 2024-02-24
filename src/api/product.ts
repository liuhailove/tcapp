import request from "@/utils/request";

export function searchProductList(params) {
    return request({
        method: 'GET',
        url: '/product/search',
        params: params,
    });
}

export function fetchCategoryTreeList() {
    return request({
        method: 'GET',
        url: '/product/categoryTreeList',
    });
}

export function fetchProductDetail(id) {
    return request({
        method: 'GET',
        url: '/product/detail/' + id,
    });
}
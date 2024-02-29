import request from "@/utils/request";

/**
 * 创建浏览历史
 * @param data 修改数据
 */
export function createReadHistory(data) {
    return request({
        method: 'POST',
        url: '/member/readHistory/create',
        data: data,
    });
}

/**
 * 读历史浏览
 * @param params 查询参数
 */
export function fetchReadHistoryList(params) {
    return request({
        method: 'GET',
        url: '/member/readHistory/list',
        params: params
    });
}

/**
 * 清空浏览历史
 */
export function clearReadHistory() {
    return request({
        method: 'POST',
        url: '/member/readHistory/clear',
    });
}
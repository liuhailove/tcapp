import axios from 'axios'
import {showFailToast, Toast} from 'vant'
import {API_BASE_URL} from "@/utils/appConfig";
import {getLocalStore} from "@/utils/global";

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 50000
});

/** 请求拦截器 */
service.interceptors.request.use(
    config => {
        const token = getLocalStore('token');
        if (token) {
            config.headers = {
                'Authorization': token,
                ...config.headers
            };
        } else {
            config.headers = {
                ...config.headers
            };
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

/** 响应拦截器 */
service.interceptors.response.use(
    response => {
        if (response.data.code !== undefined) {
            if (response.data.code !== 200) {
                showFailToast('请求失败');
                return Promise.reject(response.data.msg || 'error')
            } else {
                return response.data
            }
        } else {
            return response.data
        }
    }
)
export default service;
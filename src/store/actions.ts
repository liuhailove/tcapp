import {LOGIN_TOKEN, USER_INFO} from "@/store/mutation-type";
import {getLocalStore} from "@/utils/global";

export default {
    // 同步用户信息
    syncUserInfo: function ({commit}, userInfo) {
        commit(USER_INFO, {userInfo});
    },
    // 本地存在token 自动登录
    autoLogin: function ({commit}) {
        let userInfo = getLocalStore(`userInfo`);
        if (!userInfo) {
            return;
        }
        commit(USER_INFO, userInfo);
    },
    // 存储登入Token
    syncToken: function ({commit}, token) {
        console.info("syncToken func")
        commit(LOGIN_TOKEN, token);
    },
}
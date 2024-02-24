import Vuex from 'vuex'
import state from "@/store/state";
import mutations from "@/store/mutations";
import actions from "@/store/actions";
import getters from "@/utils/getters";

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
});
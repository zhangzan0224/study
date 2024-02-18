import { getBannerList } from "@/api/banner";
export default {
  namespaced: true,
  state: {
    loading: false,
    data: [],
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setData(state, payload) {
      state.data = payload;
    },
  },
  actions: {
    async fetchBanner({ commit, state }) {
      if (state.data && state.data.length > 0) return;
      commit("setLoading", true);
      const resp = await getBannerList();
      commit("setData", resp);
      commit("setLoading", false);
    },
  },
};

import ApiService from "@/common/api.service";
import i18n from "@/common/plugins/vue-i18n.js";
const state = {
  StockDatatable: {
    search: "",
    headers: [
      { align: "center", text: i18n.t('ItemCode'), value: "ItemCode" },
      { align: "center", text: i18n.t('ItemName'), value: "ItemName" },
      { align: "center", text: i18n.t('Raseed'), value: "Raseed" },
    ],
    data: [],
  },
  items: [],
  itemsLoading: false,
  isLoading: false,
};

const getters = {
  StockDatatable(state) {
    return state.StockDatatable;
  },
  items(state) {
    return state.items;
  },
  itemsLoading(state) {
    return state.itemsLoading;
  },

  isLoading(state) {
    return state.isLoading;
  }
};

const actions = {
  getStockDatatable(ctx, payload) {
    ctx.commit("setLoading", true);
    // commit(mutations.setLoading, true);
    if (payload.GroupCode == null) payload.GroupCode = 0
    if (payload.ItemSerial == null) payload.ItemSerial = 0
    return new Promise((resolve, reject) => {
      ApiService.query("stock", payload)
        .then((res) => {
          console.log(res.data);
          ctx.commit("setStockDatatable", res.data);
          resolve(res.data)
          ctx.commit("setLoading", false);
        })
        .catch((res) => {
          ctx.commit("setLoading", false);
          reject(res);
        });
    });
  },
  getItems(ctx, { item, store }) {
    let payload = {
      StoreCode: store,
      BCode: "",
      Name: item
    }
    if (!isNaN(item)) {
      payload.BCode = item
      payload.Name = ""
    }
    ctx.commit("itemsLoading", true);
    return new Promise((resolve, reject) => {
      ApiService.post("get-item", payload)
        .then((res) => {
          ctx.commit("items", res.data);
          resolve(res.data)
          ctx.commit("itemsLoading", false);
        })
        .catch((res) => {
          ctx.commit("itemsLoading", false);
          reject(res);
        });
    })
  }
};

const mutations = {
  setStockDatatable(state, payload) {
    payload = payload != null ? payload : []
    state.StockDatatable.data = payload
  },
  itemsLoading(state, payload) {
    state.itemsLoading = payload;
  },

  items(state, payload) {
    state.items = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

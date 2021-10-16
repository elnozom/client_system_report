// import axios from "axios";
import ApiService from "@/common/api.service";
// action types
export const GET_CASHTRAY = "getCashTray";
// mutation types
// import { i18n } from '@/common/plugins/vue-i18n.js'
// import { i18n } from './i18n.js'
import i18n from "@/common/plugins/vue-i18n.js";
// const numberWithCommas = (x) => {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// };
const state = {
  errors: null,
  AcccountsDatatable: {
    search: "",
    headers: [
      { align: "center", text: i18n.t('DocDate'), value: "DocDate" },
      { align: "center", text: i18n.t('DocNo'), value: "DocNo" },
      { align: "center", text: i18n.t('Dbt'), value: "Dbt" },
      { align: "center", text: i18n.t('Crdt'), value: "Crdt" },
      { align: "center", text: i18n.t('RaseedDbt'), value: "RaseedDbt" },
      { align: "center", text: i18n.t('RaseedCrdt'), value: "RaseedCrdt" },
    ],
    total: {},
    data: [],
  },
  TransCycleDataTable: {
    search: "",
    headers: [
      { align: "center", text: i18n.t('ItemCode'), value: "ItemCode" },
      { align: "center", text: i18n.t('ItemName'), value: "ItemName" },
      { align: "center", text: i18n.t('RaseedbeforePart'), value: "RaseedbeforePart" },
      { align: "center", text: i18n.t('RaseedbeforeWhole'), value: "RaseedbeforeWhole" },
      { align: "center", text: i18n.t('BuyPart'), value: "BuyPart" },
      { align: "center", text: i18n.t('BuyWhole'), value: "BuyWhole" },
      { align: "center", text: i18n.t('IndusInPart'), value: "IndusInPart" },
      { align: "center", text: i18n.t('IndusInWhole'), value: "IndusInWhole" },
      { align: "center", text: i18n.t('TransInPart'), value: "TransInPart" },
      { align: "center", text: i18n.t('TransInWhole'), value: "TransInWhole" },
      { align: "center", text: i18n.t('SalePart'), value: "SalePart" },
      { align: "center", text: i18n.t('SaleWhole'), value: "SaleWhole" },
      { align: "center", text: i18n.t('TransOutPart'), value: "TransOutPart" },
      { align: "center", text: i18n.t('TransOutWhole'), value: "TransOutWhole" },
      { align: "center", text: i18n.t('IndusOutPart'), value: "IndusOutPart" },
      { align: "center", text: i18n.t('IndusOutWhole'), value: "IndusOutWhole" },
      { align: "center", text: i18n.t('RaseedPart'), value: "RaseedPart" },
      { align: "center", text: i18n.t('RaseedWhole'), value: "RaseedWhole" },
      { align: "center", text: i18n.t('CycleRate'), value: "CycleRate" },
      { align: "center", text: i18n.t('LastBuyDate'), value: "LastBuyDate" },
      { align: "center", text: i18n.t('LastSellDate'), value: "LastSellDate" },
    ],
    data: [],
  },
  BalanceOfTradeDataTable: {
    search: "",
    headers: [
      { align: "center", text: i18n.t('AccountCode'), value: "AccountCode" },
      { align: "center", text: i18n.t('AccountName'), value: "AccountName" },
      { align: "center", text: i18n.t('AccNo'), value: "AccNo" },
      { align: "center", text: i18n.t('BBC'), value: "BBC" },
      { align: "center", text: i18n.t('BBD'), value: "BBD" },
      { align: "center", text: i18n.t('BAC'), value: "BAC" },
      { align: "center", text: i18n.t('BAD'), value: "BAD" },
    ],
    data: [],
  },
  isLoading: false,
};

const getters = {
  AcccountsDatatable(state) {
    return state.AcccountsDatatable;
  },
  BalanceOfTradeDataTable(state) {
    return state.BalanceOfTradeDataTable;
  },
  TransCycleDataTable(state) {
    return state.TransCycleDataTable;
  },
  isLoading(state) {
    return state.isLoading;
  },

};

const actions = {

  getAccountBalance(ctx, payload) {
    ctx.commit("setLoading", true);
    // commit(mutations.setLoading, true);
    return new Promise((resolve, reject) => {
      ApiService.query("get-account-balance", payload)
        .then((res) => {
          const d = res.data.Data == null ? [] : res.data.Data
          ctx.commit("setDatatable", d);
          ctx.commit("setDatatableTotal", res.data.Raseed);
          resolve(res.data)
          ctx.commit("setLoading", false);

        })
        .catch((res) => {
          ctx.commit("setLoading", false);
          reject(res);
        });
    });
  },
  getBalanceOfTrade(ctx, payload) {
    ctx.commit("setLoading", true);
    // commit(mutations.setLoading, true);
    return new Promise((resolve, reject) => {
      ApiService.query("balance-of-trade", payload)
        .then((res) => {
          ctx.commit("setBalanceOfTrade", res.data);
          resolve(res.data)
          ctx.commit("setLoading", false);
        })
        .catch((res) => {
          ctx.commit("setLoading", false);
          reject(res);
        });
    });
  },
  getTransCycleAcc(ctx, payload) {
    ctx.commit("setLoading", true);
    // commit(mutations.setLoading, true);
    if(payload.GroupCode == null) payload.GroupCode = 0
    if(payload.StoreCode == null) payload.StoreCode = 0
    return new Promise((resolve, reject) => {
      ApiService.query("trans-cycle-acc", payload)
        .then((res) => {
          ctx.commit("setTransCycleDatatable", res.data);
          resolve(res.data)
          ctx.commit("setLoading", false);
        })
        .catch((res) => {
          ctx.commit("setLoading", false);
          reject(res);
        });
    });
  },
};

const mutations = {
  setErr(state, error) {
    state.errors = error;
  },
  setDatatable(state, payload) {
    payload = payload == null  ? [] : payload
    state.AcccountsDatatable.data = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  },
  setDatatableTotal(state, payload) {
    state.AcccountsDatatable.total = payload;
  },
  setBalanceOfTrade(state, payload) {
    payload = payload == null  ? [] : payload
    state.BalanceOfTradeDataTable.data = payload;
  },
  setTransCycleDatatable(state, payload) {
    payload = payload == null  ? [] : payload
    state.TransCycleDataTable.data = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

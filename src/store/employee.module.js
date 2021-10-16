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
  drivers: [],
  driverLoading:false,
  DriverTotalsDatatable: {
    search: "",
    headers: [
      { align: "center", text: i18n.t('Orders'), value: "Orders" },
      { align: "center", text: i18n.t('DateTo'), value: "DateTo" },
      { align: "center", text: i18n.t('ROrders'), value: "ROrders" },
      { align: "center", text: i18n.t('RAmount'), value: "RAmount" },
      { align: "center", text: i18n.t('EmpCode'), value: "EmpCode" },
      { align: "center", text: i18n.t('EmpName'), value: "EmpName" },
    ],
    total: {},
    data: [],
  },
  isLoading: false,
};

const getters = {
  DriverTotalsDatatable(state) {
    return state.DriverTotalsDatatable;
  },
  drivers(state) {
    return state.drivers;
  },
  driverLoading(state) {
    return state.driverLoading;
  },
  
  isLoading(state) {
    return state.isLoading;
  },

};

const actions = {

  getDriverTotals(ctx, payload) {
    ctx.commit("setLoading", true);
    // commit(mutations.setLoading, true);
    payload.EmpCode == null  ? delete payload['EmpCode']  :""
    return new Promise((resolve, reject) => {
      ApiService.query("get-emp-totals", payload)
        .then((res) => {
          ctx.commit("setLoading", false);
          const d = res.data == null ? [] : res.data
          ctx.commit("DriverTotalsDatatable", d);
          // ctx.commit("setDatatableTotal", res.data.Raseed);
          resolve(res.data)
          ctx.commit("setLoading", false);

        })
        .catch((res) => {
          ctx.commit("setLoading", false);
          reject(res);
        });
    });
  },
  getDrivers(ctx) {
    ctx.commit("driverLoading", true);
    // commit(mutations.setLoading, true);
    return new Promise((resolve, reject) => {
      ApiService.list("get-drivers")
        .then((res) => {
            ctx.commit("driverLoading", false);
       
            // const d = res.data == null ? [] : res.data 
            ctx.commit("drivers", res.data);
            // ctx.commit("setDatatableTotal", res.data.Raseed);
            resolve(res.data)
            ctx.commit("driverLoading", false);
            
        })
        .catch((res) => {
          ctx.commit("driverLoading", false);
          reject(res);
        });
  });
},
};

const mutations = {
  setErr(state, error) {
    state.errors = error;
  },
  drivers(state, payload) {
    state.drivers = payload;
  },
  driverLoading(state, payload) {
    state.driverLoading = payload;
  },
  DriverTotalsDatatable(state, payload) {
    state.DriverTotalsDatatable.data = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  },
  setDatatableTotal(state, payload) {
    state.DriverTotalsDatatable.total = payload;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};

import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import cashtray from "./cashtray.module";
import reports from "./reports.module";
import suppliers from "./suppliers.module";
import accounts from "./accounts.module";
import employee from "./employee.module";
import items from "./items.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    items,
    htmlClass,
    cashtray,
    reports,
    suppliers,
    accounts,
    employee,
    config,
    breadcrumbs,
  },
});

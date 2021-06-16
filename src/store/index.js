import Vue from "vue";
import Vuex from "vuex";

import auth from "./auth.module";
import htmlClass from "./htmlclass.module";
import config from "./config.module";
import breadcrumbs from "./breadcrumbs.module";
import cashtray from "./cashtray.module";
import reports from "./reports.module";
import suppliers from "./suppliers.module";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    htmlClass,
    cashtray,
    reports,
    suppliers,
    config,
    breadcrumbs,
  },
});

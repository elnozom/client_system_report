<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <h1>{{ $t("driver_totals_report") }}</h1>
          <p class="desc">{{ $t("driver_totals_desc") }}</p>
        </div>
        <v-card>
          <v-card-title>
            <v-container fluid>

              <v-row>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-combobox
                    v-model="empCode"
                    clearable
                    @click:clear="form.EmpCode = null"
                    item-text="EmpName"
                    :return-object="true"
                    :items="drivers"
                    @change="chooseAcc"
                    :loading="driverLoading"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_account')"
                    single-line
                  ></v-combobox>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-menu
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :label="$t('from_date')"
                        readonly
                        :value="form.DateFrom"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      locale="en-in"
                      :max="maxDate"
                      v-model="form.DateFrom"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                >
                  <v-menu
                    v-model="toDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        :label="$t('to_date')"
                        readonly
                        :value="form.DateTo"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      locale="en-in"
                      :min="form.DateFrom"
                      :max="maxDate"
                      v-model="form.DateTo"
                      no-title
                    ></v-date-picker>
                  </v-menu>
                </v-col>

              </v-row>
            </v-container>
          </v-card-title>
          <v-data-table
            :headers="DriverTotalsDatatable.headers"
            :items="DriverTotalsDatatable.data"
            :search="DriverTotalsDatatable.search"
            :loading="isLoading"
            fixed-header
            height="600px"
          >
            <template v-slot:[`item.Amount`]="{ item }">
              {{numberWithCommas(item.Amount)}}EGP
            </template>
            <template v-slot:[`item.RAmount`]="{ item }">
              {{numberWithCommas(item.RAmount)}}EGP
            </template>
          </v-data-table>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// import { GET_CASHTRAY } from "@/store/cashtray.module";
export default {
  data() {
    var maxDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDay()}`;
    return {
      fromDateMenu: false,
      toDateMenu: false,
      empCode:null,
      maxDate,

      form: {
        DateFrom: null,
        DateTo: null,
        EmpCode: null,
      },
    };
  },
  computed: {
    ...mapGetters("employee", [
      "isLoading",
      "driverLoading",
      "drivers",
      "DriverTotalsDatatable",
    ]),
    ...mapGetters("reports", ["accounts", "accountsLoading"]),
  },
  methods: {
    getDriverTotals() {
      this.$store.dispatch("employee/getDriverTotals", this.form);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    chooseAcc(){
      console.log('asd')
      this.form.EmpCode = this.empCode.EmpCode
    },
    addParamsToLocation(params) {
        history.pushState(
            {},
            null,
            this.$route.path +
            '?' +
            Object.keys(params)
                .map(key => {
                return (
                    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                )
                })
                .join('&')
        )
        window.scrollTo({ top:0, behavior: 'smooth'});
        },

  },

  watch: {
    form: {
      handler(val) {
        this.fromDateMenu = false
        this.toDateMenu = false
        this.addParamsToLocation(val)
        if (
          val.DateFrom != null &&
          val.DateTo != null 
        ) {
          
          this.getDriverTotals();
        }
      },
      deep: true,
    },
  },

  created() {
    this.$store.dispatch("employee/getDrivers");
    this.form = this.$route.query;
    if(!isNaN(parseInt(this.$route.query.EmpCode))) this.form.EmpCode = parseInt(this.$route.query.EmpCode)
  },
};
</script>

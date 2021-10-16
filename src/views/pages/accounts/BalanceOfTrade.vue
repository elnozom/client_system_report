<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <h1>{{ $t("balance_of_Trade_report") }}</h1>
          <p class="desc">{{ $t("balance_of_Trade_desc") }}</p>
        </div>
        <v-card>
          <v-card-title>
            <v-container fluid>

              <v-row>
                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="AccType"
                    :cache-items="true"
                    @input="changeType()"
                    clearable
                    item-text="type"
                    :return-object="true"
                    :items="AccTypes"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_account_type')"
                    single-line
                  ></v-combobox>
                </v-col>
                <v-col cols="6">
                  <v-switch v-model="form.PayCheq" :label="$t('pay_cheq')">

                  </v-switch>
                </v-col>
                
                <v-col cols="12" md="6">
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
                        prepend-icon="event"
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
                <v-col cols="12" md="6"> 
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
                        prepend-icon="event"
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
            :headers="BalanceOfTradeDataTable.headers"
            :items="BalanceOfTradeDataTable.data"
            :search="BalanceOfTradeDataTable.search"
            :loading="isLoading"
            fixed-header
            height="600px"
          >
            <template v-slot:[`item.BBC`]="{ item }">
              {{numberWithCommas(item.BBC)}}EGP
            </template>
            <template v-slot:[`item.BBD`]="{ item }">
              {{numberWithCommas(item.BBD)}}EGP
            </template>

            <template v-slot:[`item.BAC`]="{ item }">
              {{numberWithCommas(item.BAC)}}EGP
            </template>
            <template v-slot:[`item.BAD`]="{ item }">
              {{numberWithCommas(item.BAD)}}EGP
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
      AccTypes: [
        {
          type: this.$t("customer"),
          value: 1,
        },
        {
          type: this.$t("supplier"),
          value: 2,
        },
        {
          type: this.$t("expenses"),
          value: 3,
        },
        {
          type: this.$t("bank"),
          value: 4,
        },
        {
          type: this.$t("safe"),
          value: 5,
        },
        {
          type: this.$t("other"),
          value: 6,
        },
      ],
      fromDateMenu: false,
      toDateMenu: false,
      maxDate,
      AccType:null,

      form: {
        AccType: 1,
        DateFrom: null,
        DateTo: null,
        PayCheq: false,
      },
    };
  },
  computed: {
    ...mapGetters("accounts", ["isLoading", "BalanceOfTradeDataTable"])
  },
  methods: {
    getBalance() {
      this.$store.dispatch("accounts/getBalanceOfTrade", this.form);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    changeType(){
      this.form.AccType = this.AccType.value
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
        this.addParamsToLocation(val);
        this.fromDateMenu = false
        this.toDateMenu = false
       if(val.DateFrom != null && val.DateTo != null & val.AccType != null){
         this.getBalance()
       }
      },
      deep: true,
    },
  },

  created() {
    if(this.$route.query.AccType != null){
      this.form.AccType = parseInt(this.$route.query.AccType)
    }
     if(this.$route.query.DateFrom != 'undefined'){
      this.form.DateFrom =this.$route.query.DateFrom
     }
     if(this.$route.query.DateTo != 'undefined'){
       this.form.DateTo =this.$route.query.DateTo
     }
    // console.log(this.$route.query)
  },
  
};
</script>

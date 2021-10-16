<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <h1>{{ $t("acccount_balance_report") }}</h1>
          <p class="desc">{{ $t("account_balance_desc") }}</p>
        </div>
        <v-card>
          <v-card-title>
            <v-container fluid>

              <v-row>
                <v-col cols="6">
                  <v-combobox
                    v-model="accountType"
                    :cache-items="true"
                    @change="changeType()"
                    clearable
                    item-text="type"
                    :return-object="true"
                    :items="accountTypes"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_account_type')"
                    single-line
                  ></v-combobox>
                </v-col>
                <v-col cols="6">
                  <v-combobox
                    v-model="AccontSerial"
                    :return-object="true"
                    @change="changeAccount()"
                   clearable
                    item-text="AccountName"
                    :items="accounts"
                    :loading="accountsLoading"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_account')"
                    single-line
                  ></v-combobox>
                </v-col>
                <v-col cols="6">
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
                <v-col cols="6">
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
            :headers="AcccountsDatatable.headers"
            :items="AcccountsDatatable.data"
            :search="AcccountsDatatable.search"
            :loading="isLoading"
            fixed-header
            height="600px"
          >
            <template
              slot="body.prepend"
              v-if="AcccountsDatatable.data.length > 0"
            >
              <tr class="text-center sm-hidden black--text">
                <th class="text-center">{{ $t("before_date") }}</th>
                <th class="text-center"></th>
                <th class="text-center"></th>
                <th class="text-center"></th>
                <th
                  class="text-center"
                  v-if="AcccountsDatatable.total < 0"
                >{{numberWithCommas(parseFloat(Math.abs(AcccountsDatatable.total)).toFixed(2))}} EGP</th>
                <th
                  class="text-center"
                  v-else
                >0EGP</th>
                <th
                  class="text-center"
                  v-if="AcccountsDatatable.total >= 0"
                >{{numberWithCommas(parseFloat(Math.abs(AcccountsDatatable.total)).toFixed(2))}} EGP</th>
                <th
                  class="text-center"
                  v-else
                >0EGP</th>
              </tr>
            </template>
            <template v-slot:[`item.Dbt`]="{ item }">
              {{numberWithCommas(item.Dbt)}}EGP
            </template>
            <template v-slot:[`item.Crdt`]="{ item }">
              {{numberWithCommas(item.Crdt)}}EGP
            </template>

            <template v-slot:[`item.RaseedDbt`]="{ item }">
              {{numberWithCommas(item.RaseedDbt)}}EGP
            </template>
            <template v-slot:[`item.RaseedCrdt`]="{ item }">
              {{numberWithCommas(item.RaseedCrdt)}}EGP
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
      accountTypes: [
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
      accountType:null ,
      AccontSerial:null ,
      fromDateMenu: false,
      toDateMenu: false,
      maxDate,

      form: {
        accountType: 1,
        DateFrom: null,
        DateTo: null,
        AccontSerial: null,
      },
    };
  },
  computed: {
    ...mapGetters("accounts", ["isLoading", "AcccountsDatatable"]),
    ...mapGetters("reports", ["accounts", "accountsLoading"]),
  },
  methods: {
    getAccountBalance() {
      this.$store.dispatch("accounts/getAccountBalance", this.form);
    },
    getAccounts() {
      const payload = {
        Code: 0,
        Name: " ",
        Type: this.form.accountType,
      };
      this.$store.dispatch("reports/getAccounts", payload);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    changeType(){
      this.form.AccontSerial = null
      this.form.accountType = this.accountType.value
      this.getAccounts()
    },
    changeAccount(){
      this.form.AccontSerial = this.AccontSerial.Serial
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
        // this.$router.push({name : this.$route.name , query : this.form})
      //   this.$router.replace({query: {city: “Paris”}});
       if(val.DateFrom != null && val.DateTo != null && val.AccontSerial != null){
         this.getAccountBalance()
       }
      },
      deep: true,
    },
  },

  created() {
    if(this.$route.query.accountType != null){
      this.form.accountType = parseInt(this.$route.query.accountType)
      this.getAccounts(); 
    }
    if(this.$route.query.AccontSerial != null){
      this.form.AccontSerial = parseInt(this.$route.query.AccontSerial)
    }
    this.form.DateFrom =this.$route.query.DateFrom
    this.form.DateTo =this.$route.query.DateTo
    // console.log(this.$route.query)
  },
  
};
</script>

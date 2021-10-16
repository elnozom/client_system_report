<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <h1>{{ $t("trans_cycle_acc_report") }}</h1>
          <p class="desc">{{ $t("trans_cycle_acc_desc") }}</p>
        </div>
        <v-card>
          <v-card-title>
            <v-container fluid>

              <v-row>

                <v-col cols="12" md="6">
                  <v-combobox
                    v-model="AccontSerial"
                    :return-object="true"
                    @change="form.AccountSerial = AccontSerial.Serial"
                    @click:clear="form.AccountSerial = null"
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
                
                <v-col cols="12" md="6">
                  
                  <v-select
                    v-model="form.StoreCode"
                    :cache-items="true"
                    item-text="store_name"
                    item-value="store_code"
                    :items="stores"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_store')"
                    single-line
                  ></v-select>
                
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
                <v-col cols="12"  md="6">
                  <v-menu
                    v-model="toDateMenu"
                    :close-on-click="false"
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
                 <v-col cols="12" md="6">
                  <v-combobox
                    v-model="GroupCode"
                    :return-object="true"
                     @change="form.GroupCode = GroupCode.GroupCode"
                    @click:clear="form.GroupCode = null"
                    clearable
                    item-text="GroupName"

                    :items="groups"
                    :loading="accountsLoading"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_group')"
                    single-line
                  ></v-combobox>
                </v-col>

              </v-row>
            </v-container>
          </v-card-title>
          <v-data-table
            :headers="TransCycleDataTable.headers"
            :items="TransCycleDataTable.data"
            :search="TransCycleDataTable.search"
            :loading="isLoading"
            fixed-header
            height="600px"
          >
            <template v-slot:[`item.ItemName`]="{ item }" class="min-w-200">
              <div class="min-w-200">{{item.ItemName}}</div>
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
      maxDate,
      AccontSerial:null,
      GroupCode:null,

      form: {
        DateFrom: null,
        DateTo: null,
        StoreCode: null,
        AccontSerial: null,
        GroupCode:null,
      },
    };
  },
  computed: {
    ...mapGetters("accounts", ["isLoading", "TransCycleDataTable"]),
    ...mapGetters("reports", ["accounts", "accountsLoading" , 'groups']),
    ...mapGetters("cashtray", ["stores"]),
  },
  methods: {
    getTransCycleAcc() {
      this.$store.dispatch("accounts/getTransCycleAcc", this.form);
    },
    getAccounts() {
      const payload = {
        Code: 0,
        Name: "",
        Type: 2,
      };
      this.$store.dispatch("reports/getAccounts", payload);
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    changeType(){
      this.form.AccontSerial = null
    
      this.getAccounts()
    },
    getStores() {
      this.$store.dispatch("cashtray/getCashTrayStores")
    },
    getGroups() {
      this.$store.dispatch("reports/getGroups")
    },
     addParamsToLocation(params) {
        history.pushState(
            {},
            null,
            this.$route.path +
            '?' +
            Object.keys(params)
                .map(key => {
                 return params[key] !=null && typeof params[key] != undefined ?
                 (
                    encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
                ):''
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
       if(val.DateFrom != null && val.DateTo != null && val.StoreCode != null){
         this.getTransCycleAcc()
       }
      },
      deep: true,
    },
  },

  created() {
    this.getAccounts(); 
    this.getStores();
    this.getGroups();
    
    if(this.$route.query.AccontSerial != null) this.form.AccontSerial = parseInt(this.$route.query.AccontSerial)
    if(this.$route.query.DateFrom != null) this.form.DateFrom = this.$route.query.DateFrom
    if(this.$route.query.DateTo != null) this.form.DateTo = this.$route.query.DateTo
    if(this.$route.query.StoreCode != null) this.form.StoreCode = this.$route.query.StoreCode
    if(this.$route.query.GroupCode != null) this.form.GroupCode = this.$route.query.GroupCode
    
  },
  
};
</script>


<style>
.min-w-200{
  min-width: 200px;
}
</style>
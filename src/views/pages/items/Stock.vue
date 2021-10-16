<template>
  <div>
    <div class="row">
      <div class="col-md-12">
        <div class="data-table-header">
          <h1>{{ $t("stock_report") }}</h1>
          <p class="desc">{{ $t("stock_desc") }}</p>
        </div>
        <v-card>
          <v-card-title>
            <v-container fluid>

              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
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
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-combobox
                    v-model="GroupCode"
                    :return-object="true"
                    clearable
                    @change="changeGroup"
                    @click:clear="this.form.GroupCode = 0"
                    item-text="GroupName"
                    :items="groups"
                    :loading="groupsLoading"
                    append-outer-icon="apache-kafka"
                    menu-props="auto"
                    hide-details
                    :label="$t('select_group')"
                    single-line
                  ></v-combobox>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-combobox
                    v-model="itemSearch"
                    :return-object="true"
                    clearable
                    @change="itemSelected"
                    item-text="ItemName"
                    item-value="ItemSerial"
                    @keyup.enter="getItems"
                    :items="items"
                    :loading="itemsLoading"
                    menu-props="auto"
                    @click:append-outer="getItems"
                    append-outer-icon="mdi-magnify"
                    hide-details
                    :label="$t('select_product')"
                    single-line
                  >
                  </v-combobox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>
          <v-data-table
            :headers="StockDatatable.headers"
            :items="StockDatatable.data"
            :search="StockDatatable.search"
            :loading="isLoading"
            fixed-header
            height="600px"
          >
            <template
              v-slot:[`item.ItemName`]="{ item }"
              class="min-w-200"
            >
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
      itemSearch:"",
      maxDate,
      GroupCode:null,
      form: {
        StoreCode: null,
        GroupCode: 0,
        ItemSerial: null,
      },
    };
  },
  computed: {
    ...mapGetters("items", [
      "isLoading",
      "StockDatatable",
      "itemsLoading",
      "items",
    ]),
    ...mapGetters("reports", ["groups", "groupsLoading"]),
    ...mapGetters("cashtray", ["stores"]),
  },
  methods: {
    getData() {
      this.$store.dispatch("items/getStockDatatable", this.form);
    },
    changeGroup(){
      this.form.GroupCode = this.GroupCode.GroupCode
    },
    getItems() {
      if (this.form.StoreCode != null) {
        this.$store.dispatch("items/getItems", {
          item: this.itemSearch,
          store: this.form.StoreCode,
        });
      } else {
        console.log("please select store");
      }
    },
    getStores() {
      this.$store.dispatch("cashtray/getCashTrayStores");
    },
    getGroups() {
      this.$store.dispatch("reports/getGroups");
    },
    itemSelected(){
      console.log('selected')
      console.log(this.itemSearch)
      this.form.ItemSerial = this.itemSearch.Serial
    },
    addParamsToLocation(params) {
      history.pushState(
        {},
        null,
        this.$route.path +
          "?" +
          Object.keys(params)
            .map((key) => {
              return params[key] != null
                ? encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(params[key])
                : "";
            })
            .join("&")
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },

  watch: {
    form: {
      handler(val) {
        this.addParamsToLocation(val);
        if (val.StoreCode != null) {
          this.getData();
        }
      },
      deep: true,
    },
  },

  created() {
    this.getStores();
    this.getGroups();
    if (
      this.$route.query.ItemSerial != null && !isNaN(parseInt(this.$route.query.ItemSerial))
    )
      this.form.ItemSerial = parseInt(this.$route.query.ItemSerial);
    if (
      this.$route.query.StoreCode != null && !isNaN(parseInt(this.$route.query.StoreCode))
    )
      this.form.StoreCode = parseInt(this.$route.query.StoreCode);
    if (
      this.$route.query.GroupCode != null && !isNaN(parseInt(this.$route.query.GroupCode))
    )
      this.form.GroupCode = parseInt(this.$route.query.GroupCode);
  },
};
</script>


<style>
.min-w-200 {
  min-width: 200px;
}
</style>
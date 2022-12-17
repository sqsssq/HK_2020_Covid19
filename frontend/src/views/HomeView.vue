<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-09-17 23:36:36
 * @LastEditTime: 2022-12-16 10:06:36
-->
<template>
  <div class="common-layout" style="width: 100%; height: 100vh;" v-loading="!initSign"
    :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
    <Main v-if="initSign" :allData="allData" :migrationData="migrationData" />
  </div>
</template>

<script>
import Main from '../components/Main.vue';
// import { csv } from 'd3'
import { json } from 'd3-fetch';
import { useDataStore } from "../stores/counter";
import allData from '../assets/allcovidData.json';
import migrationData from '../assets/migration.json';

export default {
  name: "home_view",
  data() {
    return {
      msgH: null,
      allData: undefined,
      migrationData: undefined
    };
  },
  computed: {
    initSign() {
      // const dataStore = useDataStore();
      // this.allData = dataStore.allData;
      this.allData = allData;
      // this.migrationData = dataStore.migrationData;
      this.migrationData = migrationData;
      return this.allData && this.migrationData;
    },
    loadingText() {
      return "Loading"
      // return "Loading:    " + 'Route: \n' +
      //     !!this.route + '   Station: \n'+ !!this.station + '   Alldata: \n'+ !!this.alldata
    }
  },
  mounted() {

    // const dataStore = useDataStore();
    // dataStore.fetchAllData();
    // console.log(adata);
    // json('../assets/covidData1.json', c1 => {
    //   console.log(c1);
    // })
    // dataStore.fetchMigration();
    // this.msgH = dataStore.msg;
    // console.log(dataStore.allData);
    // csv('')
  },
  methods: {
    fetchData() {
    }
  },
  components: { Main }
};
</script>
<style scoped>
.boundary {
  /*border-style: dashed;*/
  border-style: solid;
  border-color: #d3dce6;
  border-width: 0.5px;
  border-radius: 3px;
}
</style>

<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-09-17 23:36:36
 * @LastEditTime: 2022-11-26 04:07:18
-->
<template>
  <div class="common-layout" style="width: 100%; height: 100vh;" v-loading="!initSign"
    :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 0.8)">
    <Main v-if="initSign" :allData="allData" />
  </div>
</template>

<script>
import Main from '../components/Main.vue';
// import { csv } from 'd3'
import { useDataStore } from "../stores/counter";

export default {
  name: "home_view",
  data() {
    return {
      msgH: null,
      allData: undefined
    };
  },
  computed: {
    initSign() {
      const dataStore = useDataStore();
      // console.log(dataStore.allData)
      // if (!dataStore.allData) {
        this.allData = dataStore.allData;
      // }
      // console.log(this.allData[1]);
      // for (let i in this.allData) {
      //   console.log(i);
      //   console.log(typeof this.allData)
      //   console.log(JSON.parse(this.allData))
      //   break;
      // }
      return this.allData;
    },
    loadingText() {
      return "Loading"
      // return "Loading:    " + 'Route: \n' +
      //     !!this.route + '   Station: \n'+ !!this.station + '   Alldata: \n'+ !!this.alldata
    }
  },
  mounted() {

    const dataStore = useDataStore();
    dataStore.fetchAllData();
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

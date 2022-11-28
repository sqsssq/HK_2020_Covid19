/*
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-09-17 23:36:36
 * @LastEditTime: 2022-11-22 20:29:12
 */
import { fetchAllData, fetchHello } from "../service/module/dataService";
import { ref, computed } from "vue";
import { defineStore } from "pinia";

// export const useCounterStore = defineStore("counter", {
//   const count = ref(0);
//   const doubleCount = computed(() => count.value * 2);
//   function increment() {
//     count.value++;
//   }

//   return { count, doubleCount, increment };
// });

export const useDataStore = defineStore("dataStore", {
  state: () => {
    return {
      msg: 'Hello, Vue SQ',
      allData: null
    }
  },
  actions: {
    fetchHello () {
      const st = new Date();
      fetchHello({}, resp => {
        this.msg = resp;
        console.log("Fetch Hello Time: ", st - new Date());
      })
    },
    fetchAllData () {
      const st = new Date();
      fetchAllData({}, resp => {
        this.allData = resp;
        console.log("Fetch All Data Time: ", new Date() - st);
        
      })
    }
  }
})
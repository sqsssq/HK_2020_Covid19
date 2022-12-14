/*
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-09-17 23:36:36
 * @LastEditTime: 2022-12-14 18:19:15
 */
import { fetchAllData, fetchHello, fetchMigration } from "../service/module/dataService";
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
      allData: null,
      migrationData: null
    }
  },
  actions: {
    fetchHello() {
      const st = new Date();
      fetchHello({}, resp => {
        this.msg = resp;
        console.log("Fetch Hello Time: ", st - new Date());
      })
    },
    fetchAllData() {
      const st = new Date();
      fetchAllData({}, resp => {
        this.allData = resp;
        console.log("Fetch All Data Time: ", new Date() - st);

      })
    },
    fetchMigration() {
      const st = new Date();
      fetchMigration({}, resp => {
        this.migrationData = resp;
        console.log("Fetch Migration Data Time: ", new Date() - st);
      })
    }
  }
})
<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-20 23:25:35
 * @LastEditTime: 2022-11-29 15:03:34
-->
<template>
    <!-- <div id="navBar"></div> -->
    <div style="height: calc(100vh - 0px); width: calc(100% - 0px);">
        <div class="framework" style="position: absolute; left: 5px; top: 10px; height: calc(25% - 15px); width: 75%;">
            
                <Calendar :allData="allData"/>
        </div>
        <div class="framework"
            style="position: absolute; left: calc(5px); top: calc(25% + 10px); height: calc((75% - 30px) / 2); width: calc(25% - 10px);">
            <div class="frameworkTitle">
                <div class="title">Map View</div>
            </div>
            <div class="frameworkBody">
                <Map :allData="allData"/>
            </div>
        </div>

        <div class="framework"
            style="position: absolute; left: calc(5px); top: calc(25% + 25px + (75% - 30px) / 2); height: calc((75% - 30px) / 2); width: calc(25% - 10px);">
            <div class="frameworkTitle">
                <div class="title">Stream View</div>
            </div>
            <div class="frameworkBody"></div>
        </div>
        <div class="framework"
            style="position: absolute; left: calc(25% + 15px); top: calc(25% + 10px); height: calc(75% - 15px); width: calc(50% - 10px);">
            
                <Network :allData="allData"/>
            
        </div>
        <div>

        </div>
        <div>

        </div>
    </div>
</template>
<script>

// import { useDataStore } from "../stores/counter";
import Calendar from "./calendar.vue";
import Map from "./map.vue"
import Network from "./network.vue";
export default {
    name: "APP",
    props: ["allData"],
    data() {
        return {
            msg1: "Hello, main!"
        };
    },
    methods: {},
    created() {
    },
    mounted() {
        // console.log(this.allData);
    },
    components: { Calendar, Map, Network }
}
</script>
<style>
.framework {
    /* margin: 5px; */
    border: 1px solid black;

    border-color: rgb(237, 237, 238);
    -webkit-box-shadow: 0px 3px 3px 2px #bdbaba;
    -moz-box-shadow: 0px 3px 3px 2px #bdbaba;
    box-shadow: 0px 3px 3px 2px #bdbaba;
    /* height: calc(50% - 30px);
    width: calc(50% - 40px); */
    /* margin-top: 10px; */
    /* margin-left: 30px; */
}

.framework .frameworkTitle {
    /* background-color: #000; */
    height: 50px;
    width: 100%;
}

.framework .frameworkBody {
    /* background-color: #000; */
    height: calc(100% - 60px);
    /* width: 100%; */
    /* background-color: #4C87EC; */
    padding: 0px 10px 10px 10px;
}

.framework .frameworkTitle .title {
    position: absolute;
    border-radius: 5px;
    background-color: #4C87EC;
    margin-top: 7px;
    margin-left: 10px;
    height: 35px;

    font-weight: bold;
    font-size: 20px;
    color: white;
    padding-left: 10px;
    padding-right: 10px;
    font-family: STHeiti;
    line-height: 35px;
}

#navBar {
    background-color: rgba(55, 59, 64, 1);
    /* background-color: rgba(0, 0, 0, 0.8); */
    /* padding-left: 36%; */
    /* text-algin: center; */
    text-align: center;
    font-weight: bold;
    color: white;
    font-size: 30px;
    height: calc(6%);
    padding-top: 1%;
    /* font-family: STHeiti; */
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
</style>

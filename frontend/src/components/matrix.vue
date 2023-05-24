<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-14 16:37:02
 * @LastEditTime: 2022-12-16 17:32:14
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Statistic View</div>
        <!-- <div style="float: right; margin-top: 7px; margin-right: 10px; font-size: 18px;">
            <svg height="30px" width="400px">
                <rect v-for="(t, i) in legendRect" :key="'lr' + i" :x="200 + i * (150 / legendRect.length)" y="10" height="20" :width="(150 / legendRect.length)" :fill="t" :stroke="t"></rect>
                <text y="25" x="180">0</text>
                <text y="25" x="355">{{ maxVM }}</text>
                <text y="25" x="70">{{ 'Visting Case:' }}</text>
            </svg>
        </div> -->
    </div>
    <div class="frameworkBody">
        <div ref="matrix" style="height: 100%; width: 100%;">
            <svg height="100%" width="100%">
                <g transform="translate(0, 55)">
                    <text v-for="(t, i) in legendText" :key="'lgt' + i" :x="0"
                        :transform="translate(i * (elWidth - 145) / 18 + 20, -2, -20)" :y="0">{{ t }}</text>
                    <g>
                        <rect v-for="(t, i) in metrixData" :key="'mr' + i" :x="t.x" :y="t.y" :width="t.w" :height="t.h"
                            :fill="t.color" :stroke="'white'"></rect>
                        <rect v-for="(t, i) in crossRect" :key="'mr' + i" :x="t.x" :y="t.y" :width="t.w" :height="t.h"
                            :fill="'none'" :stroke="'black'" stroke-dasharray="5,5"></rect>
                    </g>
                    <text v-for="(t, i) in legendText" :key="'lgt' + i" :x="elWidth - 145 + 5"
                        :y="20 + i * (elHeight - 55) / (18)">{{ t }}</text>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { useDataStore } from "../stores/counter";
import { scaleLinear } from 'd3-scale';
export default {
    name: 'APP',
    props: ['allData', 'migrationData'],
    data() {
        return {
            elHeight: 0,
            elWidth: 0,
            metrixData: [],
            crossRect: [],
            timeGap: [],
            legendRect: [],
            maxVM: 0,
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            legendText: ['Sha Tin', 'Yau Tsim Mong', 'Central and Western', 'Kowloon City', 'Kwai Tsing', 'Kwun Tong', 'Wan Chai', 'Southern', 'Eastern', 'Sai Kung', 'Sham Shui Po', 'Wong Tai Sin', 'Tuen Mun', 'Yuen Long', 'Tai Po', 'Islands', 'Tsuen Wan', 'North']
        }
    },
    methods: {
        translate(x, y, r) {
            return `translate(${x}, ${y}) rotate(${r})`
        },
        parseDateToDay(time) {
            let month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let sumMonth = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
            let monthName = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            let t = time.split('/');
            let m = parseInt(t[1]);
            let d = parseInt(t[0]);
            return sumMonth[m - 1] + d;
        },
        calcMatrix(allData, migrationData, timeGap) {
            let dicData = {};
            let distinctType = new Set();

            for (const d in allData) {
                let type_tag = '';
                if (allData[d]['Dcca_type'][0] == 'H') {
                    type_tag = 'high';
                } else if (allData[d]['Dcca_type'] == 'M') {
                    type_tag = 'mid';
                } else {
                    type_tag = 'low'
                }
                dicData[allData[d]['caseno']] = type_tag;
            }
            for (const i in migrationData) {
                migrationData[i]['type'] = dicData[migrationData[i]['caseno']];
                distinctType.add(migrationData[i]['Original_district']);
                distinctType.add(migrationData[i]['Target_district']);
            }
            let matrix = {};
            for (let i of distinctType) {
                matrix[i] = {};
                for (let j of distinctType) {
                    matrix[i][j] = {
                        cnt: 0,
                        low: 0,
                        mid: 0,
                        high: 0
                    };
                }
            }
            let max_migration = 0;
            for (const d of migrationData) {
                let dd = this.parseDateToDay(d['onsetdate']);
                if (dd < timeGap[0] || dd > timeGap[1])
                    continue;
                matrix[d['Original_district']][d['Target_district']].cnt++;
                max_migration = Math.max(max_migration, matrix[d['Original_district']][d['Target_district']].cnt);
                matrix[d['Original_district']][d['Target_district']][d['type']]++;
            }
            // console.log(max_migration);
            let setValue = new Array();
            for (let i in matrix) {
                for (let j in matrix[i]) {
                    setValue.push(matrix[i][j].cnt);
                }
            }
            setValue.sort((a, b) => {
                return a - b;
            })

            // let quantile = d3.scaleQuantile()
            //     .domain(setValue) // pass the whole dataset to a scaleQuantile’s domain
            //     .range(["white", "pink", "red"])

            let scaleSet = [];
            for (let i = 0; i < 4; ++i) {
                scaleSet.push({
                    scale: scaleLinear([setValue[parseInt(i * (setValue.length - 1) / 4)], setValue[parseInt((i + 1) * (setValue.length - 1) / 4)]], [this.color_map[i], this.color_map[i + 1]]),
                    domain: [setValue[parseInt(i * (setValue.length - 1) / 4)], setValue[parseInt((i + 1) * (setValue.length - 1) / 4)]]
                });
            }
            this.maxVM = setValue[setValue.length - 1];
            let stepL = setValue[setValue.length - 1] / 100;
            let legL = [];
            let cnt = 0;
            for (let i = 0; i < 101; ++i) {
                if (i * stepL <= scaleSet[cnt].domain[1])
                {
                    legL.push(scaleSet[cnt].scale(i * stepL));
                }
                else {
                    cnt++;
                    if (cnt == 5) break;
                }
            }
            // console.log(legL);
            this.legendRect = legL;
            let metrixData = [];
            let wcnt = 0;
            let hcnt = 0;
            let w = (this.elWidth - 145) / 18;
            let h = (this.elHeight - 55) / 18;
            let crossRect = [];
            for (let i in matrix) {
                hcnt = 0;
                for (let j in matrix[i]) {
                    let tmp = matrix[i][j];
                    let col = '';
                    for (const sca of scaleSet) {
                        if (tmp.cnt >= sca.domain[0] && tmp.cnt <= sca.domain[1]) {
                            col = sca.scale(tmp.cnt);
                        }
                    }
                    if (tmp.cnt == 0)
                        col = this.color_map[0];
                    metrixData.push({
                        nx: wcnt,
                        ny: hcnt,
                        w: w,
                        h: h,
                        x: wcnt * w,
                        y: hcnt * h,
                        d: matrix[i][j],
                        color: col,
                        tag: i == j
                    });
                    if (i == j) {
                        crossRect.push({
                            nx: wcnt,
                            ny: hcnt,
                            w: w,
                            h: h,
                            x: wcnt * w,
                            y: hcnt * h,
                            d: matrix[i][j],
                            color: col,
                            tag: i == j
                        });
                    }
                    hcnt++;
                }
                wcnt++;
            }
            this.crossRect = crossRect;
            return metrixData;
        }
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.matrix.offsetHeight;
        this.elWidth = this.$refs.matrix.offsetWidth;
        const dataStore = useDataStore();
        this.timeGap = dataStore.timeGap;
        this.metrixData = this.calcMatrix(this.allData, this.migrationData, dataStore.timeGap);
        let vm = this;
        dataStore.$subscribe((mutation, state) => {

            if (dataStore.timeGap != vm.timeGap) {
                vm.timeGap = dataStore.timeGap;
                this.metrixData = this.calcMatrix(this.allData, this.migrationData, dataStore.timeGap);
            }
        })
    },
}
</script>
<style scoped>

</style>

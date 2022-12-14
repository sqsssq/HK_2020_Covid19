<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-14 16:37:02
 * @LastEditTime: 2022-12-14 21:20:15
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Case Flow</div>
    </div>
    <div class="frameworkBody">
        <div ref="matrix" style="height: 100%; width: 100%;">
            <svg height="100%" width="100%">
                <g>
                    <rect v-for="(t, i) in metrixData" :key="'mr' + i" :x="t.x" :y="t.y" :width="t.w" :height="t.h"
                        :fill="t.color" :stroke="'white'"></rect>
                    <rect v-for="(t, i) in crossRect" :key="'mr' + i" :x="t.x" :y="t.y" :width="t.w" :height="t.h"
                        :fill="'none'" :stroke="'black'" stroke-dasharray="5,5"></rect>
                </g>
                <text v-for="(t, i) in legendText" :key="'lgt' + i" :x="elWidth - 145" :y="20 + i * elHeight / (18)">{{
                        t
                }}</text>
            </svg>
        </div>
    </div>
</template>
<script>
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
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            legendText: ['Sha Tin', 'Yau Tsim Mong', 'Central and Western', 'Kowloon City', 'Kwai Tsing', 'Kwun Tong', 'Wan Chai', 'Southern', 'Eastern', 'Sai Kung', 'Sham Shui Po', 'Wong Tai Sin', 'Tuen Mun', 'Yuen Long', 'Tai Po', 'Islands', 'Tsuen Wan', 'North']
        }
    },
    methods: {
        calcMatrix(allData, migrationData) {
            let dicData = {};
            let distinctType = new Set();

            for (const d in allData) {
                let type_tag = '';
                if (allData[d]['Dcca_type'] == 'High SES Group') {
                    type_tag = 'high';
                } else if (allData[d]['Dcca_type'] == 'Middle SES Group') {
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
            let metrixData = [];
            let wcnt = 0;
            let hcnt = 0;
            let w = (this.elWidth - 145) / 18;
            let h = (this.elHeight) / 18;
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
        this.metrixData = this.calcMatrix(this.allData, this.migrationData);
    },
}
</script>
<style scoped>

</style>

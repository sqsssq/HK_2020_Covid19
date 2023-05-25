<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-14 16:37:02
 * @LastEditTime: 2023-05-25 13:06:42
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Statistics View</div>
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
        <div ref="matrix" style="height: 100%; width: 100%; text-align: left; font-size: 18px; margin-left: 10px;">
            <!-- <div>
                <div>SELECT TIME PERIOD</div>
                <div style="margin-top: 10px;">
                    {{ timeGap1 + '-' + timeGap2 }}
                </div>
            </div> -->
            <svg height="100%" width="100%">
                <!-- <g transform="translate(0, 55)">
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
                </g> -->
                <g v-for="(t, i) in caseSet" :key="'alp' + i" :transform="translate(30, 0, 0)">
                    <path :d="t.d"  :stroke="selectionNode[t.id] == 2 ? 'orange' :'steelblue'" fill="none" :stroke-width="selectionNode[t.id] == 2 ? 2 : 0.5" :opacity="selectionNode[t.id] == 2 ? 1 : selectionNode[t.id] == 1 ? 0.8 : 0"></path>
                </g>
                <g v-for="(t, i) in axis" :key="'a' + i" :transform="translate(30 + i * (elWidth - 90) / 3, 0, 0)">
                    <path :d="'M 0 55 L 0 ' + (elHeight - 10)" stroke="black" fill="none" stroke-width="1"></path>
                    <text :x="'0'" :y="'0'" :transform="translate(0, 35, 0)" :text-anchor="'middle'">{{ t }}</text>
                    <g v-for="(d, j) in tag[i]" :key="'t' + j">
                        <circle cx="0"
                            :cy="55 + (i != 1 && i != 2 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))"
                            r="3" fill="black"></circle>
                        <text x="10"
                            :y="55 + (i != 1 && i != 2 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))"
                            dy="0.3em">{{ d }}</text>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { line } from "d3";
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
            timeGap1: '2020/01/01',
            timeGap2: '2020/12/31',
            legendRect: [],
            maxVM: 0,
            selectionNode: [],
            axis: ['Gender', 'Age', 'Related Case', 'NDI'],
            tag: [['F', 'M'], ['100', '75', '50', '25', '0'], ['36', '24', '12', '0'], ['High', 'Mid', 'Low']],
            caseSet: [],
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            legendText: ['Sha Tin', 'Yau Tsim Mong', 'Central and Western', 'Kowloon City', 'Kwai Tsing', 'Kwun Tong', 'Wan Chai', 'Southern', 'Eastern', 'Sai Kung', 'Sham Shui Po', 'Wong Tai Sin', 'Tuen Mun', 'Yuen Long', 'Tai Po', 'Islands', 'Tsuen Wan', 'North']
        }
    },
    methods: {
        translate(x, y, r) {
            return `translate(${x}, ${y}) rotate(${r})`
        },

        calcLink(data, time_tag, timeGap) {
            const scaleAge = scaleLinear([0, 100], [(this.elHeight - 10), 55]);
            const scaleRelate = scaleLinear([0, 36], [(this.elHeight - 10), 55]);
            const scaleGender = {
                'F': 55 +(this.elHeight - 10 - 55) / 3,
                'M': 55 +(this.elHeight - 10 - 55) / 3 * 2
            };
            const scaleType = {
                'H': 55 +(this.elHeight - 10 - 55) / 4,
                'M': 55 +(this.elHeight - 10 - 55) / 4 * 2,
                'L': 55 +(this.elHeight - 10 - 55) / 4 * 3,
            }
            const lenGenerate = line().x(d => d.x).y(d => d.y);
            let caseSet = new Array();
            for (let i in data) {
                if (time_tag == 1) {
                    if (data[i]['report_trans_date'] < timeGap[0] || data[i]['report_trans_date'] > timeGap[1]) {
                        continue;
                    }

                    let d = data[i];
                    let relate = (d['relatedcasesno'].split(','));
                    let t_relate = [];
                    for (let t of relate) {
                        if (parseInt(t) == parseInt(d['caseno']) || parseInt(t) == 0 || parseInt(t) == 8848)
                            continue;

                        if (time_tag == 1) {
                            // console.log('c' + t.toString())
                            if (data['c' + (parseInt(t)).toString()]['report_trans_date'] < timeGap[0] || data['c' + (parseInt(t)).toString()]['report_trans_date'] > timeGap[1]) {
                                continue;
                            }
                        }
                        t_relate.push(parseInt(t));
                    }
                    let aStep = (this.elWidth - 90) / 3;
                    let singleCase = [
                        {
                            x: aStep * 0,
                            y: scaleGender[data[i]['gender']]
                        }, {
                            x: aStep * 1,
                            y: scaleAge(data[i]['age'])
                        }, {
                            x: aStep * 2,
                            y: scaleRelate(t_relate.length)
                        }, 
                        // {
                        //     x: aStep * 3,
                        //     y: scaleType[data[i]['Dcca_type'][0]]
                        // }, 
                        {
                            x: aStep * 3,
                            y: scaleType[data[i]['Deprivation_type'][0]]
                        }];
                    caseSet.push({d: lenGenerate(singleCase), id: parseInt(data[i]['caseno'])});
                }
            }
            return caseSet;
        },
        // 第n天的日期
        parseDayToDate(day) {
            let month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let sumMonth = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366];
            let monthName = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            let y = '2020';
            let m = '';
            let d = '';
            for (let i = 0; i < 12; ++i) {
                if (day >= sumMonth[i] && day <= sumMonth[i + 1]) {
                    m = monthName[i];
                    d = (day - sumMonth[i]);
                }
            }
            return y + '/' + m + '/' + d.toString();
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

        this.caseSet = this.calcLink(this.allData, 1, this.timeGap);
        for (let i in this.caseSet) {
            this.selectionNode[this.caseSet[i].id] = 1;
        }
        // console.log(this.selectionNode);
        // this.metrixData = this.calcMatrix(this.allData, this.migrationData, dataStore.timeGap);
        let vm = this;
        dataStore.$subscribe((mutation, state) => {

            if (dataStore.timeGap != vm.timeGap) {
                vm.timeGap = dataStore.timeGap;
                console.log(vm.timeGap);
                vm.timeGap1 = vm.parseDayToDate(vm.timeGap[0]);
                vm.timeGap2 = vm.parseDayToDate(vm.timeGap[1]);

                vm.caseSet = vm.calcLink(vm.allData, 1, vm.timeGap);
                // this.metrixData = this.calcMatrix(this.allData, this.migrationData, dataStore.timeGap);
            }else{
                
                vm.selectionNode = dataStore.selectionNode;
                console.log(vm.selectionNode);
            }
        
            })
    },
}
</script>
<style scoped>

</style>

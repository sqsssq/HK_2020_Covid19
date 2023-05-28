<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-13 02:18:26
 * @LastEditTime: 2023-05-26 10:49:12
-->
<template>
    <!-- <div> -->
    <div class="frameworkTitle">
        <div class="title">Temporal View</div>
        <div style="font-size: 18px;padding-top: 10px; float: right; padding-right: 15px;">
            Selected Time: {{ timeGap1 }} - {{ timeGap2 }}
        </div>
    </div>
    <div class="frameworkBody">
        <div ref="stream" style="width: 100%; height: 100%">
            <svg id="stream" height="100%" width="100%">
                <g :transform="translate(0, -15)">
                    <!-- <path v-for="(t, i) in allPath.streamPath" :key="'stream' + i" :d="t.d" :fill="t.color"
                        stroke="rgb(99, 99, 99)" stroke-width="1">
                    </path> -->

                    <g id="ax" transform="translate(40, 15)" style="font-size: 18px;">

                    </g>
                    <g id="ay" transform="translate(0, 15)" style="font-size: 18px;">

</g>
                    <rect v-for="(t, i) in allPath.rectPath" :key="'rect' + i" :x="t.x" :y="t.y" :height="t.h"
                        :width="t.w" :fill="t.color"></rect>
                <g id="brush_g"></g>
                </g>
                <!-- <path :d="'M 40 0 L ' + elWidth + ' 0'" fill="none" stroke="black"
                    :transform="translate(0, 0.95 * elHeight - 14)"></path> -->

                <!-- <g :transform="translate(0, (elWidth - 40) / 53)" v-for="(t, i) in monthTag" :key="'mts' + i">
                    <text :x="t.px" dx="-7" :y="elHeight * 0.75 + 22" font-size="18" color="black">{{ t.st }}</text>
                    <path :d="'M 0 0 L 0 7'" :transform="translate(t.px, elHeight * 0.75 - 1)" fill="none"
                        stroke="black"></path>
                </g> -->
            </svg>
        </div>
    </div>

    <!-- </div> -->
</template>
<script>
import { useDataStore } from "../stores/counter";
import * as d3 from 'd3';
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            sumMonth: [31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366],
            dayData: [],
            weekData: [],
            elHeight: 0,
            elWidth: 0,
            colorMap: { 'low': 'rgb(83, 167, 145)', 'mid': 'rgb(244, 189, 80)', 'high': 'rgba(217,83,79,1)' },
            monthTag: [],
            allPath: {
                streamPath: [],
                rectPath: []
            },
            timeline: [],
            timeGap1: '2020/1/1',
            timeGap2: '2020/12/31',
            classTag: 0
            // streamPath: null,
            // rectPath: 
        }
    },
    methods: {
        setupBrush() {
            let vm = this;

            let height = this.elHeight;
            let width = this.elWidth;
            function brushed({ selection }) {
                let scale = d3.scaleLinear([40, width - 10], [1, 366]);
                vm.timeGap1 = vm.parseDayToDate(parseInt(scale(selection[0])));
                vm.timeGap2 = vm.parseDayToDate(parseInt(scale(selection[1])))

            }
            function brushended({ selection }) {

                const dataStore = useDataStore();

                let scale = d3.scaleLinear([40, width - 10], [1, 366]);
                dataStore.timeGap = [parseInt(scale(selection[0])), parseInt(scale(selection[1]))];
            }
            // height - 30, 10
            const brush = d3.brushX()
                .extent([[40, 0], [width - 15, 0.95 * this.elHeight]])
                .on("brush", brushed)
                .on("end", brushended);
            d3.select('#brush_g').call(brush)
                .call(brush.move, [40, width - 15]);
        },
        // 日期是一年的哪一天
        parseDateToDay(time) {
            let month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let sumMonth = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
            let monthName = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

            let t = time.split('/');
            let m = parseInt(t[1]);
            let d = parseInt(t[2]);
            return sumMonth[m - 1] + d;
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
                    d = day - sumMonth[i];
                }
            }
            return y + '/' + m + '/' + d.toString();
        },
        translate(x, y) {
            return `translate(${x}, ${y})`;
        },

        calcStream(data, dptype) {
            let dayData = []
            this.weekData.push({
                cnt: 0,
                high: 0,
                mid: 0,
                low: 0
            });
            for (let i = 0; i < 4; ++i) {
                dayData.push({
                    x: 0,
                    v: 0,
                    cnt: parseInt(i),
                    high: 0,
                    mid: 0,
                    low: 0
                });
                // this.weekData[0]++;
            }
            for (let i = 0; i < 362; ++i) {
                dayData.push({
                    x: parseInt(i / 7) + 1,
                    cnt: parseInt(i),
                    high: 0,
                    mid: 0,
                    low: 0,
                    v: 0
                });
                if (parseInt(i / 7) + 1 >= this.weekData.length) {
                    this.weekData.push({
                        cnt: parseInt(i / 7) + 1,
                        high: 0,
                        mid: 0,
                        low: 0
                    });
                }
                // this.weekData[parseInt(i / 7) + 1]++;
            }
            // console.log(this.dayData);
            let sumMonth = this.sumMonth;
            // for (let i = 1; i < sumMonth.length; ++i) {
            //     sumMonth[i] += sumMonth[i - 1];
            // }
            let allOnsetdate = [];

            for (const d in data) {
                // if (this.allData[d]['onsetdate'] != 'Asymptomatic' && this.allData[d]['onsetdate'] != 'Mid-March')
                allOnsetdate.push({
                    date: data[d]['reportdate'],
                    dcca_type: data[d]['Deprivation_type'],
                    depre_type: data[d]['Deprivation_type']
                });
            }
            let maxCase = 0;
            // console.log('type', dptype)
            for (const da of allOnsetdate) {
                let d = da.date;
                let d_type = da.depre_type;
                if (dptype != 1)
                    d_type = da.depre_type;
                let date = (d.split('/'));
                let day = parseInt(date[2]);
                let month = parseInt(date[1]);
                let dIndex = (day - 1);
                if (month >= 2)
                    dIndex += sumMonth[month - 2];
                // console.log(d, dIndex);
                if (!isNaN(dIndex)) {
                    let type_tag = "";
                    if (dptype != 1) {
                        if (d_type[0] == 'H') {
                            type_tag = 'high';
                        } else if (d_type[0] == 'M') {
                            type_tag = 'mid';
                        } else {
                            type_tag = 'low';
                        }

                    } else {
                        if (d_type[0] == 'H') {
                            type_tag = 'high';
                        } else if (d_type[0] == 'M') {
                            type_tag = 'mid';
                        } else {
                            type_tag = 'low';
                        }
                    }
                    // console.log(dIndex);
                    dayData[dIndex][type_tag]++;
                    dayData[dIndex].v++;
                    this.weekData[dayData[dIndex].x][type_tag]++;
                    maxCase = Math.max(dayData[dIndex].v, maxCase);
                }
            }
            return dayData;
            // console.log(this.dayData, this.weekData);
        },
        drawStream(data) {
            const stack = d3.stack()
                .keys(["low", "mid", "high"])
                .order(d3.stackOrderReverse)
                // .offset(d3.stackOffsetSilhouette)
                .offset(d3.stackOffsetDiverging);
            // console.log(data)
            let series = stack(data);
            let min_y = 9999999, max_y = -999999;
            let max_v = d3.max(data, d => d.v);
            let min_v = d3.min(data, d => d.v);
            for (let i in series) {
                for (let j in series[i]) {
                    // console.log(series[i][j])
                    if (typeof series[i][j] == 'string')
                        break;
                    min_y = Math.min(min_y, series[i][j][0])
                    min_y = Math.min(min_y, series[i][j][1])
                    max_y = Math.max(max_y, series[i][j][0])
                    max_y = Math.max(max_y, series[i][j][1])
                }
            }
            // console.log(min_y, max_y);
            const yScale = d3.scaleLinear([min_y, max_y], [0.95 * this.elHeight - 10, 0]);
            const xScale = d3.scaleLinear([0, 366], [40, this.elWidth - 15]);
            const rScale = d3.scaleLinear([min_v, max_v], [0, 0.95 * this.elHeight - 15]);
            const rrScale = d3.scaleLinear([min_v, max_v], [0.95 * this.elHeight - 15, 0]);
            // console.log(yScale(0));
            const xDScale = d3.scaleLinear([0, 365], [40, this.elWidth - 30]);

            // let sumMonth = 0;
            for (let i = 0; i < 12; ++i) {
                let st = '';
                if (i + 1 < 10)
                    st = '0' + (i + 1).toString();
                else
                    st = (i + 1).toString();
                let pxd = 0;
                if (i > 0)
                    pxd = this.sumMonth[i - 1];
                this.monthTag.push({
                    px: xDScale(pxd),
                    st: st
                });
                // sumMonth += this.month[i];
                // console.log(sumMonth);
            }

            let tScale = d3.scaleUtc([new Date('2020/01/01'), new Date('2020/12/31')], [40, this.elWidth - 10]);
            let timeXAxis = (g, x, height) => g
                .attr("transform", `translate(0,${height - 0})`)
                .call(d3.axisBottom(x).ticks(7).tickSizeOuter(0))
            d3.select('#ay').attr('id', 'timeAxis_g').call(timeXAxis, tScale, 0.95 * this.elHeight)

            let axisL = d3.axisLeft().scale(rrScale).ticks(4);
            d3.select('#ax').call(axisL)

            const area = d3.area()
                .x((d) => xScale(d[0]))
                .y0((d) => yScale(d[1]))
                .y1((d) => yScale(d[2]));
            // console.log(series);
            let streamPath = new Array();
            let rectPath = new Array();
            for (let i = 0; i < data.length; ++i) {
                let namespace = ["low", "mid", "high"];
                let poscnt = 0.95 * this.elHeight;
                for (const j of namespace) {
                    // if (j == "high") {
                    let h = rScale(data[i][j]);
                    rectPath.push({
                        x: xScale(i),
                        y: poscnt - h,
                        h: h,
                        color: this.colorMap[j],
                        w: this.elWidth / (series[0].length)
                    });
                    poscnt -= h;
                // }
                }
            }
            for (let i in series) {
                // console.log(series[i]['key']);
                let sd = []
                for (let j in series[i]) {
                    if (typeof series[i][j] == 'string')
                        break;
                    let d = [parseInt(j), series[i][j][0], series[i][j][1]];
                    // console.log(xScale())
                    // console.log(d, area(d));
                    // series[i][j].push(area(d));
                    // // console.log(series[i][j][1], typeof series[i][j])
                    sd.push(d);
                }
                // console.log(area(sd));
                // console.log(this.colorMap[series[i]['key']], series[i]['key'])
                streamPath.push({
                    type: series[i]['key'],
                    color: this.colorMap[series[i]['key']],
                    d: area(sd)
                });
            }
            return {
                streamPath: streamPath,
                rectPath: rectPath
            };
        }
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.stream.offsetHeight;
        this.elWidth = this.$refs.stream.offsetWidth;
        this.dayData = this.calcStream(this.allData, this.classTag);
        this.allPath = this.drawStream(this.dayData);
        this.streamPath = this.allPath.streamPath;
        const dataStore = useDataStore();
        const vm = this;
        this.setupBrush();
        dataStore.$subscribe(() => {
            if (dataStore.classTag != vm.classTag) {
                vm.classTag = dataStore.classTag;
                vm.dayData = vm.calcStream(vm.allData, vm.classTag);
                vm.allPath = vm.drawStream(vm.dayData);
                vm.streamPath = vm.allPath.streamPath;
            }
        })

        // console.log(this.streamPath);
        // console.log(this.month);
        // console.log(this.parseDateToDay("2020/1/1"));
        // console.log(this.parseDateToDay("2020/3/2"));
        // console.log(this.parseDayToDate(32));
        // console.log(this.parseDayToDate(366));

    },
}
</script>
<style scoped>

</style>

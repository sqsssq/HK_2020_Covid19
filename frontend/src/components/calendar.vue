<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-23 02:14:57
 * @LastEditTime: 2022-12-16 21:02:18
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Case Calendar</div>
        <div style="float: right; margin-top: 7px; margin-right: 10px; font-size: 18px;">
            <svg height="30px" width="700px">
                <rect v-for="(t, i) in color_map" :key="'lr' + i" :x="530 + i * (25)" y="10" :height="20" :width="(20)" :fill="t" rx="3" stroke="rgb(224, 226, 229)" stroke-width="1"></rect>
                <text y="25" x="490">Low</text>
                <text y="25" x="655">High</text>
                <text y="25" x="390">Daily Case:</text>
                <text y="25" x="490">Low</text>
                <text y="25" x="655">High</text>
                <text y="25" x="10">Selected Time: {{ timeGap1 }} - {{ timeGap2 }}</text>
                
            </svg>
        </div>
        <!-- <div style="float: right; margin-top: 15px; margin-right: 1\0px; font-size: 18px;">
            Select Wave: {{ timeGap1 }} - {{ timeGap2 }}
        </div> -->
    </div>
    <div class="frameworkBody">
        <div ref="calendar" style="height: 100%; width: 100%;">
            <svg height="100%" width="100%">
                <g>
                    <rect v-for="(item, index) in dayData" :key="index" :x="item.x * ((elWidth - 40) / 53) + 40"
                        :y="item.y * (0.75 * elHeight) / 7" rx="3" :width="rect_width - 3" :height="rect_width - 3"
                        stroke="rgb(224, 226, 229)" stroke-width="1" :fill="item.col" @click="selectDay(index)"></rect>
                    <text x="0" :y="(0.75 * elHeight) / 7" dy="18" font-size="18">Mon</text>
                    <text x="0" :y="3 * (0.75 * elHeight) / 7" dy="18" font-size="18">Wed</text>
                    <text x="0" :y="5 * (0.75 * elHeight) / 7" dy="18" font-size="18">Fri</text>

                </g>

                <g :transform="translate(0, 0.75 * elHeight)" id="brush_g" ref="brush_g">
                    <rect v-for="(t) in (timeline)" :key="'tr' + t" :x="40 + t * ((elWidth - 40) / 53)" :y="5"
                        :height="(elWidth - 40) / 53" :width="(elWidth - 40) / 53" fill="rgb(243, 243, 243)"
                        stroke="white">
                    </rect>
                </g>
                <g :transform="translate(0, (elWidth - 40) / 53)">
                    <text v-for="(t, i) in monthTag" :key="'mt' + i" font-size="18" :x="t.px" dx="-7"
                        :y="elHeight * 0.75 + 22" color="black">{{ t.st }}</text>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { scaleLinear } from 'd3-scale';
import { area, curveLinear } from 'd3-shape';
import { line, max, select, brushX } from 'd3';

import { useDataStore } from "../stores/counter";
export default {
    name: 'calendar',
    props: ['allData'],
    data() {
        return {
            dayData: [],
            weekData: [],
            pathData: null,
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            elWidth: 0,
            elHeight: 0,
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            rect_width: 0,
            timeline: [],
            monthTag: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            timeGap1: '',
            timeGap2: ''
        }
    },
    methods: {
        selectDay(day) {

            const dataStore = useDataStore();

            let scale = scaleLinear([40, this.elWidth], [1, 366]);
            dataStore.timeGap = [parseInt(scale(parseInt(day))), parseInt(scale(parseInt(day)))];
        },
        setupBrush() {
            let vm = this;
            function brushed({ selection }) {
                let scale = scaleLinear([40, vm.elWidth], [1, 366]);
                vm.timeGap1 = vm.parseDayToDate(parseInt(scale(selection[0])));
                vm.timeGap2 = vm.parseDayToDate(parseInt(scale(selection[1])))

            }
            function brushended({ selection }) {

                const dataStore = useDataStore();

                let scale = scaleLinear([40, vm.elWidth], [1, 366]);
                dataStore.timeGap = [parseInt(scale(selection[0])), parseInt(scale(selection[1]))];
            }
            const brush = brushX()
                .extent([[40, 5], [this.elWidth, (this.elWidth) / 53 + 5]])
                .on("brush", brushed)
                .on("end", brushended);
            select('#brush_g').call(brush)
                .call(brush.move, [40, this.elWidth]);
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
            if (d < 10)
                d = '0' + d.toString();
            return y + '/' + m + '/' + d;
        },
        translate(x, y) {
            return `translate(${x}, ${y})`;
        },
        calcTime() {
            this.weekData.push(0);
            for (let i = 0; i < 4; ++i) {
                this.dayData.push({
                    x: 0,
                    y: 3 + i,
                    v: 0,
                    col: null
                });
                this.weekData[0]++;
            }
            for (let i = 0; i < 362; ++i) {
                this.dayData.push({
                    x: parseInt(i / 7) + 1,
                    y: i % 7,
                    v: 0,
                    col: null
                });
                if (parseInt(i / 7) + 1 >= this.weekData.length) {
                    this.weekData.push(0);
                }
                // this.weekData[parseInt(i / 7) + 1]++;
            }
            // console.log(this.dayData);
            let sumMonth = this.month;
            for (let i = 1; i < sumMonth.length; ++i) {
                sumMonth[i] += sumMonth[i - 1];
            }
            let allOnsetdate = [];

            for (const d in this.allData) {
                // if (this.allData[d]['onsetdate'] != 'Asymptomatic' && this.allData[d]['onsetdate'] != 'Mid-March')
                allOnsetdate.push(this.allData[d]['reportdate']);
            }
            let maxCase = 0;
            for (const d of allOnsetdate) {
                let date = (d.split('/'));
                let day = parseInt(date[2]);
                let month = parseInt(date[1]);
                let dIndex = (day - 1);
                if (month >= 2)
                    dIndex += sumMonth[month - 2];
                // console.log(d, dIndex);
                if (!isNaN(dIndex)) {
                    this.dayData[dIndex].v++;
                    this.weekData[this.dayData[dIndex].x]++;
                    maxCase = Math.max(this.dayData[dIndex].v, maxCase);
                }
            }
            // let colorScale = scaleLinear([0, maxCase], this.color_map);
            // console.log(maxCase)
            for (let i in this.dayData) {
                // console.log(this.dayData[i]['v']);
                if (this.dayData[i].v == 0)
                    this.dayData[i]['col'] = this.color_map[0];
                if (this.dayData[i].v > 0 && this.dayData[i].v <= maxCase / 4)
                    this.dayData[i]['col'] = this.color_map[1];
                if (this.dayData[i].v > maxCase / 4 && this.dayData[i].v <= maxCase * 2 / 4)
                    this.dayData[i]['col'] = this.color_map[2];
                if (this.dayData[i].v > maxCase * 2 / 4 && this.dayData[i].v <= maxCase * 3 / 4)
                    this.dayData[i]['col'] = this.color_map[3];
                if (this.dayData[i].v > maxCase * 3 / 4 && this.dayData[i].v <= maxCase)
                    this.dayData[i]['col'] = this.color_map[4];
                // console.log(this.dayData[i].v, this.dayData[i]['col'])
            }

            let xScale = scaleLinear([0, this.weekData.length - 1], [40, (52 * (this.elWidth - 40) / 53) + 15 + 40]);
            let yScale = scaleLinear([0, max(this.weekData)], [this.elHeight - 140, 0]);
            const xDScale = scaleLinear([0, 365], [40, this.elWidth]);

            // let sumMonth = 0;
            for (let i = 0; i < 12; ++i) {
                let st = '';
                if (i + 1 < 10)
                    st = '0' + (i + 1).toString();
                else
                    st = (i + 1).toString();
                let pxd = 0;
                if (i > 0)
                    pxd = this.month[i - 1];
                this.monthTag.push({
                    px: xDScale(pxd),
                    st: st
                });
                // sumMonth += this.month[i];
                // console.log(sumMonth);
            }
            let areaGenerate = area()
                // .defined(0)
                .curve(curveLinear)
                .x((d, i) => {
                    d;
                    return xScale(i);
                })
                .y0(yScale(0))
                .y1(d => yScale(d));
            // console.log(this.weekData)
            this.pathData = areaGenerate(this.weekData);
            // console.log(this.pathData)
        },
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.calendar.offsetHeight;
        this.elWidth = this.$refs.calendar.offsetWidth;
        this.rect_width = (0.75 * this.elHeight) / 7 > (this.elWidth - 40) / 53 ? (this.elWidth - 40) / 53 : (0.75 * this.elHeight) / 7;

        for (let i = 0; i < 53; ++i) this.timeline.push(i);
        // console.log(this.rect_width);
        // console.log(this.allData)
        this.calcTime();
        this.setupBrush();
    },
}
</script>
<style scoped>

</style>

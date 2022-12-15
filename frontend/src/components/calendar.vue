<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-23 02:14:57
 * @LastEditTime: 2022-12-15 14:49:47
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Calendar View</div>
    </div>
    <div class="frameworkBody">
        <div ref="calendar" style="height: 100%; width: 100%;">
            <svg height="100%" width="100%">
                <g>
                    <rect v-for="(item, index) in dayData" :key="index" :x="item.x * ((elWidth - 40) / 53) + 40"
                        :y="item.y * 30" rx="3" :width="25" :height="25" stroke="rgb(224, 226, 229)" stroke-width="1"
                        :fill="item.col"></rect>
                    <text x="0" y="32" font-size="18">Mon</text>
                    <text x="0" y="75" font-size="18">Wed</text>
                    <text x="0" y="115" font-size="18">Fri</text>

                </g>
                <g transform="translate(0, 140)" id="brush_g" ref="brush_g">
                    <!-- <defs>
                        <path id="weekCase" :d="pathData" stroke="none"></path>
                        <linearGradient id="myGradient" gradientTransform="rotate(90)">
                            <stop offset="20%" stop-color="rgb(221, 115, 109)" />
                            <stop offset="90%" stop-color="rgb(234, 193, 166)" />
                        </linearGradient>
                    </defs>
                    <use x="0" y="0" href="#weekCase" fill="url('#myGradient')" /> -->
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { scaleLinear } from 'd3-scale';
import { area, curveLinear } from 'd3-shape';
import { line, max, select, brushX } from 'd3';
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
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)']
        }
    },
    methods: {
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
        setupBrush() {
            function brushed() { }
            function brushended() { }
            const brush = brushX()
                .extent([[40, 0], [52 * (this.elWidth - 40) / 53 + 40 + 15, this.elHeight - 140]])
                .on("brush", brushed)
                .on("end", brushended);
            select('#brush_g').call(brush)
            // .call(brush.move, [30, 70]);
        }
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.calendar.offsetHeight;
        this.elWidth = this.$refs.calendar.offsetWidth;
        // console.log(this.allData)
        this.calcTime();
        this.setupBrush();
    },
}
</script>
<style scoped>

</style>

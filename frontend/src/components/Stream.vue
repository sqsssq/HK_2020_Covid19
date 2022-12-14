<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-13 02:18:26
 * @LastEditTime: 2022-12-14 16:25:06
-->
<template>
    <!-- <div> -->
    <div class="frameworkTitle">
        <div class="title">Stream View</div>
    </div>
    <div class="frameworkBody">
        <div ref="stream" style="width: 100%; height: 100%">
            <svg id="stream" height="100%" width="100%">
                <g>
                    <!-- <path v-for="(t, i) in allPath.streamPath" :key="'stream' + i" :d="t.d" :fill="t.color"
                        stroke="rgb(99, 99, 99)" stroke-width="1">
                    </path> -->
                    <rect v-for="(t, i) in allPath.rectPath" :key="'rect' + i" :x="t.x" :y="t.y" :height="t.h" :width="t.w" :fill="t.color"></rect>
                </g>
            </svg>
        </div>
    </div>

    <!-- </div> -->
</template>
<script>
import * as d3 from 'd3';
import { max } from 'd3';
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            dayData: [],
            weekData: [],
            elHeight: 0,
            elWidth: 0,
            colorMap: { 'low': '#96ceb4', 'mid': '#ffeead', 'high': 'rgba(217,83,79,1)' },
            allPath: {
                streamPath: [],
                rectPath: []
            },
            // streamPath: null,
            // rectPath: 
        }
    },
    methods: {
        calcStream(data) {
            this.weekData.push({
                cnt: 0,
                high: 0,
                mid: 0,
                low: 0
            });
            for (let i = 0; i < 4; ++i) {
                this.dayData.push({
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
                this.dayData.push({
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
            let sumMonth = this.month;
            for (let i = 1; i < sumMonth.length; ++i) {
                sumMonth[i] += sumMonth[i - 1];
            }
            let allOnsetdate = [];

            for (const d in data) {
                // if (this.allData[d]['onsetdate'] != 'Asymptomatic' && this.allData[d]['onsetdate'] != 'Mid-March')
                allOnsetdate.push({
                    date: data[d]['reportdate'],
                    dcca_type: data[d]['Dcca_type']
                });
            }
            let maxCase = 0;
            for (const da of allOnsetdate) {
                let d = da.date;
                let d_type = da.dcca_type;
                let date = (d.split('/'));
                let day = parseInt(date[2]);
                let month = parseInt(date[1]);
                let dIndex = (day - 1);
                if (month >= 2)
                    dIndex += sumMonth[month - 2];
                // console.log(d, dIndex);
                if (!isNaN(dIndex)) {
                    let type_tag = "";
                    if (d_type == 'High SES Group') {
                        type_tag = 'high';
                    } else if (d_type == 'Middle SES Group') {
                        type_tag = 'mid';
                    } else {
                        type_tag = 'low';
                    }
                    this.dayData[dIndex][type_tag]++;
                    this.dayData[dIndex].v++;
                    this.weekData[this.dayData[dIndex].x][type_tag]++;
                    maxCase = Math.max(this.dayData[dIndex].v, maxCase);
                }
            }
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
            const yScale = d3.scaleLinear([min_y, max_y], [0.9 * this.elHeight, 0]);
            const xScale = d3.scaleLinear([0, series[0].length - 1], [0, this.elWidth]);
            const rScale = d3.scaleLinear([min_v, max_v], [0, 0.9 * this.elHeight]);
            // console.log(yScale(0));
            const area = d3.area()
                .x((d) => xScale(d[0]))
                .y0((d) => yScale(d[1]))
                .y1((d) => yScale(d[2]));
            // console.log(series);
            let streamPath = new Array();
            let rectPath = new Array();
            for (let i = 0; i < data.length; ++i) {
                let namespace = ["low", "mid", "high"];
                let poscnt = 0.9 * this.elHeight;
                for (const j of namespace) {
                    let h = rScale(data[i][j]);
                    rectPath.push({
                        x: xScale(i),
                        y: poscnt - h,
                        h: h,
                        color: this.colorMap[j],
                        w: this.elWidth / (series[0].length)
                    });
                    poscnt -= h;
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
        this.calcStream(this.allData);
        this.allPath = this.drawStream(this.dayData);
        this.streamPath = this.allPath.streamPath
        // console.log(this.streamPath);
    },
}
</script>
<style scoped>

</style>

<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-23 02:14:57
 * @LastEditTime: 2022-11-26 05:13:42
-->
<template>
    <div ref="calendar" style="height: 100%; width: 100%;">
        <svg height="100%" width="100%">
            <g>
                <rect v-for="(item, index) in dayData" :key="index" :x="item.x * ((elWidth - 40) / 53) + 40"
                    :y="item.y * 20" rx="3" :width="15" :height="15" stroke="rgb(224, 226, 229)" stroke-width="1"
                    :fill="item.col"></rect>
                <text x="0" y="32" font-size="18">Mon</text>
                <text x="0" y="75" font-size="18">Wed</text>
                <text x="0" y="115" font-size="18">Fri</text>
            </g>
        </svg>
    </div>
</template>
<script>
import { parse } from '@babel/parser';
import { scaleLinear } from 'd3-scale'

export default {
    name: 'calendar',
    props: ['allData'],
    data() {
        return {
            dayData: [],
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            elWidth: 0,
            elHeight: 0,
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)']
        }
    },
    methods: {
        calcTime() {
            for (let i = 0; i < 4; ++i) {
                this.dayData.push({
                    x: 0,
                    y: 3 + i,
                    v: 0,
                    col: null
                });
            }
            for (let i = 0; i < 362; ++i) {
                this.dayData.push({
                    x: parseInt(i / 7) + 1,
                    y: i % 7,
                    v: 0,
                    col: null
                });
            }
            // console.log(this.dayData);
            let sumMonth = this.month;
            for (let i = 1; i < sumMonth.length; ++i) {
                sumMonth[i] += sumMonth[i - 1];
            }
            let allOnsetdate = [];

            for (const d in this.allData) {
                // if (this.allData[d]['onsetdate'] != 'Asymptomatic' && this.allData[d]['onsetdate'] != 'Mid-March')
                allOnsetdate.push(this.allData[d]['onsetdate']);
            }
            let maxCase = 0;
            for (const d of allOnsetdate) {
                let date = (d.split('/'));
                let day = parseInt(date[0]);
                let month = parseInt(date[1]);
                let dIndex = (day - 1);
                if (month >= 2)
                    dIndex += sumMonth[month - 2];
                // console.log(d, dIndex, !isNaN(dIndex));
                if (!isNaN(dIndex)) {
                    this.dayData[dIndex].v++;
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
        }
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.calendar.offsetHeight;
        this.elWidth = this.$refs.calendar.offsetWidth;
        // console.log(this.allData)
        this.calcTime();
    },
}
</script>
<style scoped>

</style>

<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-14 16:37:02
 * @LastEditTime: 2022-12-15 18:19:40
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Case Information</div>
    </div>
    <div class="frameworkBody">
        <div ref="info" style="height: 100%; width: 100%;">
            <svg height="100%" width="100%">
                <g v-for="(t, i) in axis" :key="'a' + i" :transform="translate(30 + i * (elWidth - 80) / 4, 0, 0)">
                    <path :d="'M 0 55 L 0 ' + (elHeight - 10)" stroke="black" fill="none" stroke-width="1"></path>
                    <text :x="'0'" :y="'0'" :transform="translate(0, 35, 0)" :text-anchor="'middle'">{{ t }}</text>
                    <g v-for="(d, j) in tag[i]" :key="'t' + j">
                        <circle cx="0" :cy="55 + (i != 1 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))" r="3" fill="black"></circle>
                        <text x="10" :y="55 + (i != 1 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))" dy="0.3em">{{ d }}</text>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import { scaleLinear } from 'd3-scale';
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            elHeight: 0,
            elWidth: 0,
            axis: ['Gender', 'Age', 'Related Case', 'SES', 'Deprivation'],
            tag: [['F', 'M'], ['100', '75', '50', '25', '0'], [], ['High', 'Mid', 'Low'], ['High', 'Mid', 'Low']],
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            legendText: ['Sha Tin', 'Yau Tsim Mong', 'Central and Western', 'Kowloon City', 'Kwai Tsing', 'Kwun Tong', 'Wan Chai', 'Southern', 'Eastern', 'Sai Kung', 'Sham Shui Po', 'Wong Tai Sin', 'Tuen Mun', 'Yuen Long', 'Tai Po', 'Islands', 'Tsuen Wan', 'North']
        }
    },
    methods: {
        translate(x, y, r) {
            return `translate(${x}, ${y}) rotate(${r})`
        },
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.info.offsetHeight;
        this.elWidth = this.$refs.info.offsetWidth;
    },
}
</script>
<style scoped>

</style>

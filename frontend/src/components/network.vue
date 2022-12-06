<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-26 12:24:17
 * @LastEditTime: 2022-12-06 17:43:22
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Network View</div>
        <div class="slider-demo-block" style="width: 300px; float: right; margin-top: 7px; margin-right: 30px;">
            <el-slider v-model="value" range :min="minV" :max="maxV" />
        </div>
    </div>
    <div class="frameworkBody">
        <div ref="network" style="width: 100%; height: 100%">
            <svg id="net" height="100%" width="100%">
                <g id="zoom_g">
                    <path v-for="(t, i) in links" :key="'link' + i"
                        :d="'M ' + t.source.nx + ' ' + t.source.ny + ' L ' + t.target.nx + ' ' + t.target.ny"
                        fill="none" :opacity="isShow[t.sr] && isShow[t.tr]" stroke="rgb(99, 99, 99)" stroke-width="0.1">
                    </path>
                    <circle v-for="(t, i) in nodes" :key="'node' + i" :cx="t.nx" :cy="t.ny" r="2" fill="black"
                        stroke="rgb(213, 213, 213)" stroke-width="0.5" :opacity="isShow[t.name]"></circle>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import * as d3 from 'd3';
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            networkWidth: 0,
            networkHeight: 0,
            nodes: [],
            links: [],
            value: [0, 10],
            maxV: 1,
            minV: 0,
            isShow: {},
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            district: ['unknown', 'Sha Tin', 'Kwai Tsing', 'Wan Chai', 'Tuen Mun', 'Yuen Long', 'Central & Western', 'Southern', 'Yau Tsim Mong', 'Eastern', 'Islands', 'Kowloon City', 'North', 'Tsuen Wan', 'Sham Shui Po', 'Tai Po', 'Kwun Tong', 'Sai Kung', 'Wong Tai Sin']
        }
    },
    methods: {
        calcNetwork(data) {
            let nodes = [];
            let edges = [];
            let repeatEdges = {};
            let nodeIndex = {};
            let cnt = 0;
            for (let i in data) {
                let d = data[i];
                // let relate = (d['relatedcasesno'].split(','));
                // if (relate.length == 1)
                //     continue;
                nodes.push({
                    name: d['caseno'],
                    cnt: 0
                })
                nodeIndex[parseInt(d['caseno'])] = cnt;
                cnt++;
            }
            for (let i in data) {
                let d = data[i];
                // nodes.push({
                //     name: d['caseno']
                // })
                let start_id = parseInt(d['caseno']);
                let relate = (d['relatedcasesno'].split(','));
                // if (nodeIndex[start_id] == 8392)
                //     console.log(start_id);
                if (relate.length == 0) continue;
                for (const rn of relate) {
                    if (parseInt(rn) == 0 || parseInt(rn) == 8848)
                        break;
                    if (parseInt(rn) == start_id)
                        continue;
                    let r1 = 's' + (start_id).toString() + 't' + (rn).toString();
                    let r2 = 's' + (rn).toString() + 't' + (start_id).toString();
                    if (repeatEdges[r1] != 1 && repeatEdges[r2] != 1) {
                        repeatEdges[r1] = 1;
                        repeatEdges[r2] = 1;
                    } else {
                        continue;
                    }
                    // console.log(start_id, nodeIndex[start_id], parseInt(rn), nodeIndex[parseInt(rn)]);
                    nodes[nodeIndex[start_id]].cnt++;
                    nodes[nodeIndex[parseInt(rn)]].cnt++;
                    edges.push({
                        source: nodeIndex[start_id],
                        target: nodeIndex[parseInt(rn)],
                        value: 1,
                        id: r1,
                        sr: start_id,
                        tr: parseInt(rn)
                    });
                }
            }

            return { nodes: nodes, edges: edges };
        },
        drawNetwork(data) {
            // const svg = d3.select('#net');
            let nodes = data.nodes;
            let links = data.edges;
            // console.log(nodes);
            d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).distance(0).strength(1))
                .force("charge", d3.forceManyBody().strength(-50))
                .force("x", d3.forceX())
                .force("y", d3.forceY());

            let xMax = d3.max(nodes, d => d['x']);
            let xMin = d3.min(nodes, d => d['x']);
            let yMax = d3.max(nodes, d => d['y']);
            let yMin = d3.min(nodes, d => d['y']);
            // console.log(xMax, xMin, yMax, yMin);
            let xScale = d3.scaleLinear([xMin, xMax], [10, this.networkWidth - 10]);
            let yScale = d3.scaleLinear([yMin, yMax], [10, this.networkHeight - 10]);
            for (let i in nodes) {
                nodes[i].nx = xScale(nodes[i].x);
                nodes[i].ny = yScale(nodes[i].y);
            }
            for (let i in links) {
                links[i]['source']['nx'] = xScale(links[i]['source']['x']);
                links[i]['source']['ny'] = yScale(links[i]['source']['y']);
                links[i]['target']['nx'] = xScale(links[i]['target']['x']);
                links[i]['target']['ny'] = yScale(links[i]['target']['y']);
            }
            return [nodes, links];
        },
        networkZoom() {
            let zoom_g = d3.select("#zoom_g");
            const zoom = d3.zoom().on("zoom", e => {
                zoom_g.attr("transform", (transform = e.transform));
                // g.style("stroke-width", 3 / Math.sqrt(transform.k));
                // points.attr("r", 3 / Math.sqrt(transform.k));
            });
            return zoom;
        },
        calcHive(data) {
            let sumMonth = this.month;
            for (let i = 1; i < sumMonth.length; ++i) {
                sumMonth[i] += sumMonth[i - 1];
            }
            let nodes = [];
            let edges = [];
            let repeatEdges = {};
            let nodeIndex = {};
            let cnt = 0;
            for (let i in data) {
                let d = data[i];
                // let relate = (d['relatedcasesno'].split(','));
                // if (relate.length == 1)
                //     continue;
                let date = (d['reportdate'].split('/'));
                let day = parseInt(date[2]);
                let month = parseInt(date[1]);
                let dIndex = (day - 1);
                if (month >= 2)
                    dIndex += sumMonth[month - 2];
                // console.log(isNaN(d['district_en']), d['district_en'] == "NaN", d['district_en']);
                nodes.push({
                    name: d['caseno'],
                    date: d['reportdate'],
                    dateIndex: dIndex,
                    district: d['district_en'] == "NaN" ? 'unknown' : d['district_en'],
                    cnt: 0
                });
                nodeIndex[parseInt(d['caseno'])] = cnt;
                cnt++;
            }
            console.log(nodeIndex);
            for (let i in data) {
                let d = data[i];
                // nodes.push({
                //     name: d['caseno']
                // })
                let start_id = parseInt(d['caseno']);
                let relate = (d['relatedcasesno'].split(','));
                // if (nodeIndex[start_id] == 8392)
                //     console.log(start_id);
                if (relate.length == 0) continue;
                for (const rn of relate) {
                    if (parseInt(rn) == 0 || parseInt(rn) == 8848)
                        break;
                    if (parseInt(rn) == start_id)
                        continue;
                    let r1 = 's' + (start_id).toString() + 't' + (rn).toString();
                    let r2 = 's' + (rn).toString() + 't' + (start_id).toString();
                    if (repeatEdges[r1] != 1 && repeatEdges[r2] != 1) {
                        repeatEdges[r1] = 1;
                        repeatEdges[r2] = 1;
                    } else {
                        continue;
                    }
                    // console.log(start_id, nodeIndex[start_id], parseInt(rn), nodeIndex[parseInt(rn)]);
                    nodes[nodeIndex[start_id]].cnt++;
                    nodes[nodeIndex[parseInt(rn)]].cnt++;
                    edges.push({
                        source: nodeIndex[start_id],
                        target: nodeIndex[parseInt(rn)],
                        value: 1,
                        id: r1,
                        sr: start_id,
                        tr: parseInt(rn)
                    });
                }
            }

            return { nodes: nodes, edges: edges };
        },
        drawHive(data) {
            let district_set = {};
            for (let d of this.district) {
                district_set[d] = new Array();
            }
            for (let d of data.nodes) {
                district_set[d['district']].push(d);
            }
            for (let i in district_set) {
                district_set[i].sort((x, y) => {
                    return x.dateIndex - y.dateIndex;
                })
            }
            console.log(district_set);
            // let angle = d3.scaleLinear([0, this.district.length - 1], [0, 2 * Math.PI]);
            // let radius = d3.scaleLinear([0, 1230], [20, 100]);
        }
    },
    created() {
    },
    mounted() {
        this.networkHeight = this.$refs.network.offsetHeight;
        this.networkWidth = this.$refs.network.offsetWidth;
        // this.calcNetwork(this.allData);

        // let netData = this.calcNetwork(this.allData);
        // for (const d of netData.nodes) {
        //     this.isShow[d.name] = 1;
        // }
        // let maxV = d3.max(netData.nodes, d => d.cnt);
        // this.value = [0, maxV];
        // this.maxV = maxV;
        // [this.nodes, this.links] = this.drawNetwork(netData);

        let netData = this.calcHive(this.allData);
        // console.log(netData);
        this.drawHive(netData);

        d3.select("#net").call(d3.zoom()
            .extent([[0, 0], [this.networkWidth, this.networkWidth]])
            .scaleExtent([1, 20])
            .on("zoom", zoomed));

        function zoomed({ transform }) {
            d3.select("#zoom_g").attr("transform", transform);
        }
    },
    watch: {
        value() {
            for (let i in this.nodes) {
                if (this.nodes[i].cnt >= this.value[0] && this.nodes[i].cnt <= this.value[1]) {
                    this.isShow[this.nodes[i].name] = 1;
                } else {
                    this.isShow[this.nodes[i].name] = 0;
                }
            }
        },
        // deep: true
    }
}
</script>
<style scoped>
.frameworkTitle {
    /* background-color: #000; */
    height: 50px;
    width: 100%;
}

.frameworkBody {
    /* background-color: #000; */
    height: calc(100% - 60px);
    /* width: 100%; */
    /* background-color: #4C87EC; */
    padding: 0px 10px 10px 10px;
}

.frameworkTitle .title {
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

.slider-demo-block {
    display: flex;
    align-items: center;
}

.slider-demo-block .el-slider {
    margin-top: 0;
    margin-left: 12px;
}
</style>

<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-26 12:24:17
 * @LastEditTime: 2022-12-16 22:36:14
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Case Related Network</div>
        <!-- <div class="slider-demo-block" style="width: 300px; float: right; margin-top: 7px; margin-right: 30px;">
            <el-slider v-model="value" range :min="minV" :max="maxV" />
        </div> -->

        <div style="float: right; margin-top: 7px; margin-right: 10px; ">
            <el-button @click="switchClass()" style="width: 150px; font-size: 18px;">{{ classTag == 1 ? 'SES' :
                    'Deprivation'
            }}</el-button>
        </div>
        <div style="float: right; margin-top: 7px; margin-right: 10px; font-size: 18px;">
            <svg height="30px" width="300px">
                <circle cx="15" cy="15" r="10" :fill="class_color[classTag == 1 ? 0 : 2]"></circle>
                <circle cx="115" cy="15" r="10" :fill="class_color[1]"></circle>
                <circle cx="215" cy="15" r="10" :fill="class_color[classTag == 1 ? 2 : 0]"></circle>
                <text x="35" y="21">Low</text>
                <text x="135" y="21">Mid</text>
                <text x="235" y="21">High</text>
            </svg>
        </div>
    </div>
    <div class="frameworkBody">
        <div ref="network" style="width: 100%; height: 100%">
            <svg id="net" height="100%" width="100%">
                <g id="zoom_g">
                    <path v-for="(t, i) in links" :key="'link' + i" :d="linkArc(t)" fill="none"
                        :opacity="isShow[t.sr] && isShow[t.tr]" stroke="rgb(99, 99, 99)" stroke-width="0.5">
                    </path>
                    <circle v-for="(t, i) in nodes" :key="'node' + i" :cx="t.nx" :cy="t.ny" :r="t.nr"
                        :fill="classTag == 1 ? t.t_color : t.d_color" stroke="rgb(99, 99, 99)" stroke-width="0.5"
                        :opacity="isShow[t.id]" @mouseenter="selectNode(t.id, t.rcase)" @mouseout="removeSelect()"
                        @click="clickNode(t.id, t.rcase)">
                    </circle>

                    <g v-show="isClick == 1">
                        <text v-for="(t, i) in nodes" :key="'tnd' + i" :x="t.nx" :y="t.ny" :opacity="isShow[t.id]" font-size="18">
                            {{ t.id }}
                        </text>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>
<script>
import * as d3 from 'd3';
import { useDataStore } from "../stores/counter";
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            networkWidth: 0,
            networkHeight: 0,
            nodes: [],
            links: [],
            edges: [],
            value: [0, 10],
            class_color: ['rgb(83, 167, 145)', 'rgb(244, 189, 80)', 'rgba(217,83,79,1)'],
            maxV: 1,
            minV: 0,
            isShow: {},
            classTag: 1,
            axisline: [],
            timeGap: [],
            isClick: 0,
            scale_num: 1,
            selectionNode: [],
            selectionID: [],
            month: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
            district: ['unknown', 'Sha Tin', 'Kwai Tsing', 'Wan Chai', 'Tuen Mun', 'Yuen Long', 'Central & Western', 'Southern', 'Yau Tsim Mong', 'Eastern', 'Islands', 'Kowloon City', 'North', 'Tsuen Wan', 'Sham Shui Po', 'Tai Po', 'Kwun Tong', 'Sai Kung', 'Wong Tai Sin']
        }
    },
    methods: {
        BeLarge() {
            scale_num++;
            const zoom = d3.zoom()
                .extent([[0, 0], [this.networkWidth, this.networkWidth]])
                .scaleExtent([1, 20])
                .on("zoom", zoomed);


            function zoomed({ transform }) {
                d3.select("#zoom_g").attr("transform", transform);
            }
            // 多少时间内完成缩放
            d3.select("#net").transition().duration(500).call(
                // zoom.transform,
                // // d3.zoomIdentity.translate(100, 100)
                // d3.zoomIdentity.scaleTo(10)
                zoom.scaleTo, scale_num
            );
        },

        BeLow() {
            if (scale_num > 1)
                scale_num--;
            const zoom = d3.zoom()
                .extent([[0, 0], [this.networkWidth, this.networkWidth]])
                .scaleExtent([1, 20])
                .on("zoom", zoomed);
            function zoomed({ transform }) {
                d3.select("#zoom_g").attr("transform", transform);
            }
            // 多少时间内完成缩放
            if (scale_num > 1)
                d3.select("#net").transition().duration(500).call(
                    // zoom.transform,
                    // // d3.zoomIdentity.translate(100, 100)
                    // d3.zoomIdentity.scaleTo(10)
                    zoom.scaleTo, scale_num
                );
            else

                d3.select("#net").transition().duration(500).call(
                    zoom.transform,
                    // // d3.zoomIdentity.translate(100, 100)
                    d3.zoomIdentity.translate(0, 0).scale(scale_num)
                );
        },

        switchClass() {
            this.classTag = !this.classTag;
            const dataStore = useDataStore();
            dataStore.classTag = this.classTag;
        },
        clickNode(sid, rid) {
            // console.log(sid, rid);
            this.isClick = 1;
            for (let i in this.isShow) {
                this.isShow[i] = 0;
            }
            let snode = {};
            this.isShow[sid] = 1;
            snode[parseInt(sid)] = 1;
            for (let i of rid) {
                if (parseInt(i) == 0)
                    break;
                snode[parseInt(i)] = 1;
                this.isShow[parseInt(i)] = 1;
            }
            this.selectionNode = snode;
            const dataStore = useDataStore();
            // console.log(this.selectionNode);
            dataStore.selectionNode = this.selectionNode;
        },
        selectNode(sid, rid) {
            if (this.isClick == 1) return;
            console.log(sid, rid);
            for (let i in this.isShow) {
                this.isShow[i] = 0;
            }
            this.isShow[sid] = 1;
            for (let i of rid) {
                if (parseInt(i) == 0)
                    break;
                this.isShow[parseInt(i)] = 1;
            }
        },
        removeSelect() {
            if (this.isClick != 1)
                for (let i in this.isShow) {
                    this.isShow[i] = 1;
                }
        },
        transform(x, y, r) {
            return `translate(${x}, ${y}) rotate(${r})`;
        },
        calcNetwork(data) {
            // data
            let nodes = [];
            let edges = [];
            // let repeatEdges = {};
            // let nodeIndex = {};
            // let cnt = 0;
            // for (let i in data) {
            //     let d = data[i];
            //     // let relate = (d['relatedcasesno'].split(','));
            //     // if (relate.length == 1)
            //     //     continue;
            //     nodes.push({
            //         name: d['caseno'],
            //         cnt: 0
            //     })
            //     nodeIndex[parseInt(d['caseno'])] = cnt;
            //     cnt++;
            // }
            // for (let i in data) {
            //     // if (i > 20) break;
            //     let d = data[i];
            //     // nodes.push({
            //     //     name: d['caseno']
            //     // })
            //     let start_id = parseInt(d['caseno']);
            //     let relate = (d['relatedcasesno'].split(','));
            //     // if (nodeIndex[start_id] == 8392)
            //     //     console.log(start_id);
            //     if (relate.length == 0) continue;
            //     for (const rn of relate) {
            //         if (parseInt(rn) == 0 || parseInt(rn) == 8848)
            //             break;
            //         if (parseInt(rn) == start_id)
            //             continue;
            //         let r1 = 's' + (start_id).toString() + 't' + (rn).toString();
            //         let r2 = 's' + (rn).toString() + 't' + (start_id).toString();
            //         if (repeatEdges[r1] != 1 && repeatEdges[r2] != 1) {
            //             repeatEdges[r1] = 1;
            //             repeatEdges[r2] = 1;
            //         } else {
            //             continue;
            //         }
            //         // console.log(start_id, nodeIndex[start_id], parseInt(rn), nodeIndex[parseInt(rn)]);
            //         nodes[nodeIndex[start_id]].cnt++;
            //         nodes[nodeIndex[parseInt(rn)]].cnt++;
            //         edges.push({
            //             source: nodeIndex[start_id],
            //             target: nodeIndex[parseInt(rn)],
            //             value: relate.length,
            //             id: r1,
            //             sr: start_id,
            //             tr: parseInt(rn)
            //         });
            //     }
            // }
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
            d3.select("#net").call(d3.zoom()
                .extent([[0, 0], [this.networkWidth, this.networkWidth]])
                .scaleExtent([1, 20])
                .on("zoom", zoomed));

            function zoomed({ transform }) {
                d3.select("#zoom_g").attr("transform", transform);
            }
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
            // console.log(nodeIndex);
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
            let district_cnt = {};
            let cnt = 0;
            for (let d of this.district) {
                district_set[d] = new Array();
                district_cnt[d] = cnt;
                cnt++;
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
            console.log(district_cnt);
            let angle = d3.scaleLinear([0, this.district.length - 1], [0, 2 * Math.PI]);
            let RH = (this.networkHeight > this.networkWidth ? this.networkWidth : this.networkHeight) / 2;
            let RW = (this.networkHeight < this.networkWidth ? this.networkWidth : this.networkHeight) / 2;
            let radius = d3.scaleLinear([0, 1230], [30, RH + 100]);
            let axisLine = d3.line().x(d => d.x).y(d => d.y);
            for (const d of this.district) {
                this.axisline.push({
                    d: axisLine([{
                        x: radius(district_set[d].length) * Math.cos(angle(district_cnt[d])) + RW,
                        y: radius(district_set[d].length) * Math.sin(angle(district_cnt[d])) + RH
                    }, {
                        x: radius(0) * Math.cos(angle(district_cnt[d])) + RW,
                        y: radius(0) * Math.sin(angle(district_cnt[d])) + RH
                    }])
                })
            }
            for (const d of this.district) {
                for (let i in district_set[d]) {
                    district_set[d][i].nx = radius(i) * Math.cos(angle(district_cnt[d])) + RW;
                    district_set[d][i].ny = radius(i) * Math.sin(angle(district_cnt[d])) + RH;
                }
            }
            // console.log(district_set);
            let RLine = d3.lineRadial()
                .angle(function (d) {
                    return angle(d[0]);
                })
                .radius(function (d) {
                    return radius(d[1]);
                })
            // console.log(data.edges);
            for (let i in data.edges) {
                data.edges[i].spos = [data.nodes[data.edges[i].source].nx, data.nodes[data.edges[i].source].ny];
                data.edges[i].tpos = [data.nodes[data.edges[i].target].nx, data.nodes[data.edges[i].target].ny];
                data.edges[i].d = RLine([data.edges[i].spos, data.edges[i].tpos]);
            }
            console.log(data.edges)
            this.nodes = data.nodes;
            this.edges = data.edges;
        },
        calcNet(data, time_tag, timeGap) {
            let nodes = [];
            let edges = [];
            // let repeatEdges = {};
            let nodeIndex = {};
            let cnt = 0;
            // let rl_max = 0;
            for (let i in data) {
                if (time_tag == 1) {
                    if (data[i]['report_trans_date'] < timeGap[0] || data[i]['report_trans_date'] > timeGap[1]) {
                        continue;
                    }
                }
                let d = data[i];
                // let relate = (d['relatedcasesno'].split(','));
                // if (relate.length == 1)
                //     continue;
                let relate = (d['relatedcasesno'].split(','));
                let t_color = '';
                let d_color = '';
                if (d['Dcca_type'][0] == 'H') {
                    t_color = 'rgba(217,83,79,1)';
                } else if (d['Dcca_type'][0] == 'M') {
                    t_color = 'rgb(244, 189, 80)';
                } else {
                    t_color = 'rgb(83, 167, 145)';
                }
                if (d['Deprivation_type'][0] == 'H') {
                    d_color = 'rgb(83, 167, 145)';
                } else if (d['Deprivation_type'][0] == 'M') {
                    d_color = 'rgb(244, 189, 80)';
                } else {
                    d_color = 'rgba(217,83,79,1)';
                }
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
                // rl_max = Math.max(rl_max, t_relate.length);
                nodes.push({
                    id: d['caseno'],
                    cnt: 0,
                    relate: t_relate.length,
                    rcase: t_relate,
                    t_color: t_color,
                    d_color: d_color
                })
                nodeIndex[parseInt(d['caseno'])] = cnt;
                cnt++;
            }
            // console.log(rl_max);
            for (let i in nodes) {
                let d = nodes[i];
                let start_id = parseInt(d['id']);
                let relate = d.rcase;
                for (const rn of relate) {

                    if (parseInt(rn) == 0 || parseInt(rn) == 8848)
                        break;
                    if (parseInt(rn) == start_id)
                        continue;
                    edges.push({
                        source: start_id,
                        target: parseInt(rn),
                        sr: start_id,
                        tr: parseInt(rn)
                    });
                }
            }
            // console.log(nodes);

            // for (let i in data) {
            //     // if (i > 20) break;
            //     let d = data[i];
            //     // nodes.push({
            //     //     name: d['caseno']
            //     // })
            //     let start_id = parseInt(d['caseno']);
            //     let relate = (d['relatedcasesno'].split(','));
            //     // if (nodeIndex[start_id] == 8392)
            //     //     console.log(start_id);
            //     if (relate.length == 0) continue;
            //     for (const rn of relate) {
            //         if (parseInt(rn) == 0 || parseInt(rn) == 8848)
            //             break;
            //         if (parseInt(rn) == start_id)
            //             continue;
            //         // let r1 = 's' + (start_id).toString() + 't' + (rn).toString();
            //         // let r2 = 's' + (rn).toString() + 't' + (start_id).toString();
            //         // if (repeatEdges[r1] != 1 && repeatEdges[r2] != 1) {
            //         //     repeatEdges[r1] = 1;
            //         //     repeatEdges[r2] = 1;
            //         // } else {
            //         //     continue;
            //         // }
            //         // console.log(start_id, nodeIndex[start_id], parseInt(rn), nodeIndex[parseInt(rn)]);
            //         // nodes[nodeIndex[start_id]].cnt++;
            //         // nodes[nodeIndex[parseInt(rn)]].cnt++;
            //         edges.push({
            //             source: start_id,
            //             target: parseInt(rn),
            //             sr: start_id,
            //             tr: parseInt(rn)
            //         });
            //     }
            // }

            // console.log(nodes, edges);
            return { nodes: nodes, links: edges };
        },
        linkArc(d) {
            const r = Math.hypot(d.target.nx - d.source.nx, d.target.ny - d.source.ny);
            return `
                M${d.source.nx},${d.source.ny}
                A${r},${r} 0 0,1 ${d.target.nx},${d.target.ny}
            `;
        },
        drawNet(data) {
            // console.log(data);
            const links = data.links.map(d => {
                // console.log(d, Object.create(d));
                return Object.create(d);
            });
            const nodes = data.nodes.map(d => Object.create(d));
            // console.log(nodes, links);
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id(d => d.id))
                .force("charge", d3.forceManyBody().strength(1))
                .force("x", d3.forceX())
                .force("y", d3.forceY());

            let xMax = d3.max(nodes, d => d['x']);
            let xMin = d3.min(nodes, d => d['x']);
            let yMax = d3.max(nodes, d => d['y']);
            let yMin = d3.min(nodes, d => d['y']);
            // console.log(xMax, xMin, yMax, yMin);
            // console.log(nodes[0].relate);
            let xScale = d3.scaleLinear([xMin, xMax], [10, this.networkWidth - 10]);
            let yScale = d3.scaleLinear([yMin, yMax], [10, this.networkHeight - 10]);
            let rScale = d3.scaleLinear(this.relateNum, [6, 15])
            for (let i in nodes) {
                nodes[i].nx = xScale(nodes[i].x);
                nodes[i].ny = yScale(nodes[i].y);
                nodes[i].nr = rScale(nodes[i].relate);
                if (nodes[i].relate == 0)
                    nodes[i].nr = 4;
                // console.log(nodes[i].id);
                // if (nodes[i].id == 6774)
                //     nodes[i].nr = 30;
            }
            for (let i in links) {
                links[i]['source']['nx'] = xScale(links[i]['source']['x']);
                links[i]['source']['ny'] = yScale(links[i]['source']['y']);
                links[i]['target']['nx'] = xScale(links[i]['target']['x']);
                links[i]['target']['ny'] = yScale(links[i]['target']['y']);
            }
            return [nodes, links];
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

        const dataStore = useDataStore();
        this.timeGap = dataStore.timeGap;
        let netData = this.calcNet(this.allData, 1, dataStore.timeGap);
        for (const d of netData.nodes) {
            this.isShow[d.id] = 1;
        }
        let maxV = d3.max(netData.nodes, d => d.relate);
        this.value = [0, maxV];
        this.relateNum = [1, maxV]
        this.maxV = maxV;
        // [this.nodes, this.links] = this.drawNetwork(netData);
        [this.nodes, this.links] = this.drawNet(netData);

        const vm = this;
        dataStore.$subscribe((mutation, state) => {
            if (vm.timeGap != dataStore.timeGap) {
                vm.timeGap = dataStore.timeGap;
                let netData = this.calcNet(this.allData, 1, dataStore.timeGap);
                for (const d of netData.nodes) {
                    this.isShow[d.id] = 1;
                }
                let maxV = d3.max(netData.nodes, d => d.relate);
                this.value = [0, maxV];
                this.relateNum = [1, maxV]
                this.maxV = maxV;
                // [this.nodes, this.links] = this.drawNetwork(netData);
                [this.nodes, this.links] = this.drawNet(netData);
            }
        })

        this.networkZoom();
    },
    watch: {
        value() {
            for (let i in this.nodes) {
                if (this.nodes[i].relate >= this.value[0] && this.nodes[i].relate <= this.value[1]) {
                    this.isShow[this.nodes[i].id] = 1;
                } else {
                    this.isShow[this.nodes[i].id] = 0;
                }
            }
        },
        // isShow
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

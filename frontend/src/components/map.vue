<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-26 05:07:07
 * @LastEditTime: 2022-12-16 23:20:21
-->
<template>
    <!-- <div style="height: 100%; width: 100%;"> -->
    <div class="frameworkTitle">
        <div class="title">Cases Distribution Map</div>
    </div>
    <div class="frameworkBody">
        <div id="mapCase" ref="map" style="height: 100%; width: 100%; margin: 0px 0 0 0px;">
        </div>
        <svg id="svg" :width="elWidth" :height="elHeight"
            style="z-index: 10000; position: absolute; top: 0px; left: 0px;pointerEvents: none;">

            <!-- <g>
                <rect v-for="(t, i) in rectData" :key="'r' + i" :x="t.x" :y="t.y" :width="t.rw" :height="t.rw" :fill-opacity="t.cnt * 10" fill="pink" :stroke="t.cnt != 0 ? 'black' : 'none'"></rect>
            </g> -->
            <g>
                <circle v-for="(c, i) in case_data" :key="'c' + i" :id="'c' + i" :cx="c.x" :cy="c.y" :fill="classTag == 1 ? c.t_color : c.d_color"
                    fill-opacity="0.8" :r="c.id == 'bar' ? 20 : 3" stroke="rgb(99, 99, 99)" stroke-width="0.5"
                    :opacity="(((c.id == 'bar') || (selectionNode[c.id] == 1) && (c.reportTime >= timeGap[0] && c.reportTime <= timeGap[1]))) ? 1 : 0" :time="c.reportTime">
                </circle>
            </g>
        </svg>
    </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useDataStore } from "../stores/counter";
export default {
    name: 'Map',
    props: ['allData'],
    data() {
        return {
            map: null,
            case_data: [],
            case_pos: [],
            elHeight: 0,
            elWidth: 0,
            rectData: [],
            timeGap: [1, 366],
            classTag: 1,
            selectionNode: {}
        }
    },
    methods: {
        creatMap(mapTag) {
            let map = L.map(mapTag, {
                center: [22.37, 114.09555],
                zoom: 12, //缩放比例
                maxZoom: 20,
                minZoom: 1,
                zoomControl: false, //+ - 按钮
                doubleClickZoom: true, //双击放大
                attributionControl: false, // 右下角leaflet标识
            })

            //引入图层,可以引入多个图层
            L.tileLayer(
                // 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
            ).addTo(map)
            this.map = (map);
        },
        calcScatter(data) {
            let c_data = [];
            let c_pos = []
            for (const i in data) {
                // if (data[i]['report_trans_day'] < timeGap[0] || data[i]['report_trans_day'] > timeGap[1])
                //     continue;
                let d = data[i];
                let _loc = this.map.latLngToContainerPoint(L.latLng(parseFloat(d['GS84_Y']), parseFloat(d['GS84_X'])));
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
                c_data.push({
                    x: _loc.x,
                    y: _loc.y,
                    d: d,
                    id: parseInt(d['caseno']),
                    lat: parseFloat(d['GS84_Y']),
                    lon: parseFloat(d['GS84_X']),
                    t_color: t_color,
                    d_color: d_color,
                    reportTime: data[i]['report_trans_date']
                });
                // if (i == 'c1')
                // console.log(data[i], data[i]['report_trans_day'])
                c_pos.push({
                    lat: parseFloat(d['GS84_Y']),
                    lon: parseFloat(d['GS84_X'])
                });
            }
            
            let _loc = this.map.latLngToContainerPoint(L.latLng(22.262691, 114.131692));
            c_data.push(
                {
                    x: _loc.x,
                    y: _loc.y,
                    lat: parseFloat(22.262691),
                    lon: parseFloat(114.131692),
                    t_color: 'red',
                    d_color: 'red',
                    id: 'bar'
                }
            )
            return [c_data, c_pos];
        },
        updateScatter() {
            // let c_data = [];
            for (const i in this.case_data) {
                let d = this.case_data[i];
                let _loc = this.map.latLngToContainerPoint(L.latLng(parseFloat(d['lat']), parseFloat(d['lon'])));
                this.case_data[i]['x'] = _loc.x;
                this.case_data[i]['y'] = _loc.y;
            }
        },
        calcArc(data) {
            let rect = [];
            let rw = 50;
            let sw = 0;
            for (let i = 0; i < parseInt(this.elWidth / rw); ++i) {
                let sh = 0;
                for (let j = 0; j < parseInt(this.elHeight / rw); ++j) {
                    rect.push({
                        cnt: 0,
                        nx: i,
                        ny: j,
                        x: sw,
                        y: sh,
                        rw: rw
                    });
                    sh += rw;
                }
                sw += rw
            }
            let max_r = 0;
            for (let i in data) {
                let index = parseInt(data[i]['x'] / rw) * parseInt(this.elHeight / rw) + parseInt(data[i]['y'] / rw);
                // console.log(index)
                rect[index].cnt++;
                max_r = Math.max(max_r, rect[index].cnt);
            }
            for (let i in rect) {
                rect[i].cnt /= max_r;
            }
            return rect;
        }
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.map.offsetHeight;
        this.elWidth = this.$refs.map.offsetWidth;
        this.creatMap('mapCase');

        const dataStore = useDataStore();
        this.timeGap = dataStore.timeGap;
        [this.case_data, this.case_pos] = this.calcScatter(this.allData);
        for (let i in this.case_data) {
            this.selectionNode[this.case_data[i].id] = 1;
            // break;
        }
        // this.rectData = this.calcArc(this.case_data);
        this.map.on('zoom', () => {
            this.updateScatter();
        });
        this.map.on('dragend', () => {
            this.updateScatter();
        });
        let vm = this;
        dataStore.$subscribe((mutation, state) => {
            // console.log(mutation, state);
            // console.log(dataStore.timeGap)
            if (vm.timeGap != dataStore.timeGap) {
                vm.timeGap = dataStore.timeGap;
            }else if (vm.classTag != dataStore.classTag) {
                vm.classTag = dataStore.classTag;
            } else {
                vm.selectionNode = dataStore.selectionNode;
                console.log(vm.selectionNode);
            }
        })
        // console.log(this.case_data);
    },
}
</script>
<style scoped>

</style>

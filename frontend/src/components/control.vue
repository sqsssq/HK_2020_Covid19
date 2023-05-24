<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 -->

<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 -->

<!--
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑     永不宕机     永无BUG
 -->

<!--
 * @Author: Qing Shi
 * @LastEditTime: 2023-05-10 16:04:43
-->
<!--  -->
<template>
    <div class="frameworkTitle">
        <div class="title" style="font-weight: 700;">Control Panel</div>
    </div>
    <div class="frameworkBody">
        <div ref="control" style="height: 100%; width: 100%; font-size: 18px; text-align: left; margin-left: 10px; padding-right: 10px;">
            <!-- <svg height="100%" width="100%">
                                
                            </svg> -->
    
            <!-- <div style="height: 10%;">
                <div>
                    ALL TIME PERIOD
                </div>
                <div style="padding-top: 10px; width: 100%;">
                    2020.1.1 ~ 2021.12.31
                </div>
            </div> -->
            <!-- <div style="height: 10%;">
                <div>
                    ALL CASES
                </div>
                <div style="padding-top: 10px; width: 100%;">
                    12000
                </div>
            </div> -->
            <div style="height: 10%;">
                <div style="height: 30px;">
                    <!-- SOCIETY LEVEL -->
                    Neighborhood Deprivation Index 
                </div>
                <div style="padding-top: 5px;">
                    <svg height="30" width="100%">
                                <circle cx="15" cy="15" r="10" :fill="class_color[0]"></circle>
                                <circle cx="115" cy="15" r="10" :fill="class_color[1]"></circle>
                                <circle cx="215" cy="15" r="10" :fill="class_color[2]"></circle>
                                <text x="35" y="21">Low</text>
                                <text x="135" y="21">Mid</text>
                                <text x="235" y="21">High</text>
                            </svg>
                </div>
            </div>
            <div style="height: 10%;">
                <div>
                    Analysis Level
                </div>
                <div style="padding-top: 5px; width: 100%;">
                    <el-select v-model="value" class="m-2" placeholder="Select" size="large" style="width: calc(100% - 10px);">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" class="selectOptionCls" />
                    </el-select>
                </div>
            </div>

            <div style="height: 10%;">
                <div>
                    Related Cases No.
                </div>
                <div style="padding-top: 5px; width: 100%;">
    
                    <div class="slider-demo-block" style="width: calc(100% - 20px); padding-left: 10px;">
                        <el-slider v-model="caseValue" range :min="0" :max="36" />
                    </div>
    
                </div>
            </div>
            <!-- <hr style="margin-bottom: 10px;"> -->
            <!-- <div style="height: 20%;">
                <div style="height: 30px;">
                    TIME PERIOD
                </div>
                <div style="height: calc(100% - 30px);" ref="timePeriodDiv">
                    <svg height="100%" width="100%" id="timePeriodSvg">
                        <g id="brush_g"></g>
                    </svg>
                </div>
            </div> -->
            <div style="height: 30%;">
                <div style="height: 30px;">
                    Betweenness Centrality
                </div>
                <div style="padding-top: 5px; width: 100%;">
                    <el-select v-model="bcValue" class="m-2" placeholder="Select" size="large" style="width: calc(100% - 10px);">
                        <el-option v-for="item in bcOptions" :key="item.value" :label="item.label" :value="item.value" class="selectOptionCls" />
                    </el-select>
                </div>

                <div style="height: calc(100% - 95px); overflow-y: auto;" ref="degreeDiv">
                    <svg height="500" width="100%" id="degreeSvg">
                        <g v-for="(item, i) in betweenData" :key="i" :transform="translate(0, 30 * (i + 1))">
                            <text>{{ item.CASENO }}</text>
                            <rect x="60" y="-15" :width="item['len_between_center']" height="20" fill="#bbb"></rect>
                            <text x="70">{{ item['between_center'].substr(1, item['between_center'].length - 10) }}</text>
                        </g>
                    </svg>
                </div>
            </div>

            <div style="height: 20%;">
                <div style="height: 30px;">
                    Degree Centrality
                </div>
                <div style="height: calc(100% - 35px); overflow-y: auto;" ref="degreeDiv">
                    <svg height="500" width="100%" id="degreeSvg">
                        <g v-for="(item, i) in degreeData" :key="i" :transform="translate(0, 30 * (i + 1))">
                            <text>{{ item.CASENO }}</text>
                            <rect x="60" y="-15" :width="item['len_degree_center']" height="20" fill="#bbb"></rect>
                            <text x="70">{{ item['degree_center'].substr(1, item['degree_center'].length - 10) }}</text>
                        </g>
                    </svg>
                </div>
            </div>
            <div style="height: 20%; margin-top:10px;">
                <div style="height: 30px;">
                    Out Degree
                </div>
                <div style="height: calc(100% - 35px); overflow-y: auto;" ref="degreeDiv">
                    <svg height="500" width="100%" id="degreeSvg">
                        <g v-for="(item, i) in outData" :key="i" :transform="translate(0, 30 * (i + 1))">
                            <text>{{ item.CASENO }}</text>
                            <rect x="60" y="-15" :width="item['len_out_degree']" height="20" fill="#bbb"></rect>
                            <text x="70">{{ item['out_degree'] }}</text>
                        </g>
                    </svg>
                </div>
            </div>
    
        </div>
    </div>
</template>

<script>
import outDegree from '../assets/case_stat.csv';
import { brushX } from 'd3';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleUtc } from 'd3-scale';
import { select } from 'd3-selection';
import { line} from 'd3-shape';
import { useDataStore } from '../stores/counter';
export default {
    props: ['allData'],
    data() {
        return {
            value: 1,
            caseValue: 0,
            class_color: ['rgb(83, 167, 145)', 'rgb(244, 189, 80)', 'rgba(217,83,79,1)'],
            degreeData: [],
            outData: [],
            betweenData: [],
            bcValue: 0,
            bcOptions: [{
                value: 0,
                label: 'All',
            }, {
                value: 1,
                label: '>0',
            }, {
                value: 2,
                label: '= 0',
            }],
            options: [{
                    value: 1,
                    label: 'Case Level',
                },
                {
                    value: 2,
                    label: 'Neighborhood Level',
                },
                {
                    value: 3,
                    label: 'Distinct Level',
                },
            ]
        };
    },

    components: {},

    computed: {},

    mounted() {
        // console.log(this.allData)
        // this.calcTimePeriod(this.allData);
        this.degreeData = this.calcDegree(outDegree, 'degree_center');
        this.outData = this.calcDegree(outDegree, 'out_degree');
        console.log(this.outData)
        this.betweenData = this.calcDegree(outDegree, 'between_center');

        console.log(this.betweenData)
    },

    watch: {
        value() {
            const dataStore = useDataStore();
            dataStore.area_lev = this.value;
        }
    },

    methods: {

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
        setupBrush() {
            let vm = this;

            let height = this.$refs.timePeriodDiv.offsetHeight;
            let width = this.$refs.timePeriodDiv.offsetWidth;
            function brushed({ selection }) {
                let scale = scaleLinear([30, width - 10], [1, 366]);
                // vm.timeGap1 = vm.parseDayToDate(parseInt(scale(selection[0])));
                // vm.timeGap2 = vm.parseDayToDate(parseInt(scale(selection[1])))

            }
            function brushended({ selection }) {

                const dataStore = useDataStore();

                let scale = scaleLinear([30, width - 10], [1, 366]);
                dataStore.timeGap = [parseInt(scale(selection[0])), parseInt(scale(selection[1]))];
            }
            // height - 30, 10
            const brush = brushX()
                .extent([[30, 10], [width - 10, height - 30]])
                .on("brush", brushed)
                .on("end", brushended);
            select('#brush_g').call(brush)
                .call(brush.move, [30, width - 10]);
        },
        translate (x, y) {
            return `translate(${x}, ${y})`;
        },
        calcTimePeriod (data) {
            // console.log(data);
            let dailyData = {};
            let maxCase = 0;
            for (let i in data) {
                let timePeriod = new Date(data[i]['reportdate']);
                // let sYear = parseInt(timePeriod[0]) - 2020;
                // let sMonth = sYear * 12 + parseInt(timePeriod[1]);
                // console.log(timePeriod);

                // break;
                if (typeof(dailyData[timePeriod]) == 'undefined') {
                    dailyData[timePeriod] = 0;
                }
                    dailyData[timePeriod]++;
                    maxCase = Math.max(dailyData[timePeriod], maxCase);
            }
            // console.log(dailyData);
            let height = this.$refs.timePeriodDiv.offsetHeight;
            let width = this.$refs.timePeriodDiv.offsetWidth;
            let tScale = scaleUtc([new Date('2020/01/01'), new Date('2020/12/31')], [30, width - 10]);
            let timeXAxis = (g, x, height) => g
                .attr("transform", `translate(0,${height - 0})`)
                .call(axisBottom(x).ticks(3).tickSizeOuter(0))
            select('#timePeriodSvg').append('g').attr('id', 'timeAxis_g').call(timeXAxis, tScale, height - 30)
            let yScale = scaleLinear([0, maxCase], [height - 30, 10]);
            let caseYAxis = (g, y, width) => g
                .attr("transform", `translate(30,${width - 0})`)
                .call(axisLeft(y).ticks(3).tickSizeOuter(0))
            select('#timePeriodSvg').append('g').attr('id', 'caseAxis_g').call(caseYAxis, yScale, 0)
            let res_data = new Array();
            for (let i in dailyData) {
                res_data.push({t: i, y: dailyData[i]});
            }
            // console.log(res_data);
            let lineGenerator = line().x(d => tScale(new Date(d.t))).y(d => yScale(d.y));
            
            select('#timePeriodSvg').append('g').append('path').attr('d', lineGenerator(res_data)).attr('fill', 'none').attr('stroke', 'black');
            // console.log(height, width);
            // let res_data = new Array();
            // for (let i in monthData) {
            //     // console.log(i);
            //     res_data.push()
            // }
            this.setupBrush();
        },
        calcDegree(data, type_name) {
            let bData = []
            let sData = []
            let oData = [];
            for (let i in data) {
                sData.push(data[i]);
                bData.push(data[i]);
                oData.push(data[i]);
            }
            sData.sort((a, b) => {
                return parseFloat(b[type_name]) - parseFloat(a[type_name]);
            })
            bData.sort((a, b) => {
                return parseFloat(b[type_name]) - parseFloat(a[type_name]);
            })
            oData.sort((a, b) => {
                return parseFloat(b[type_name]) - parseFloat(a[type_name]);
            })
            
            // console.log(sData, bData, oData);
            
            let height = this.$refs.degreeDiv.offsetHeight;
            let width = this.$refs.degreeDiv.offsetWidth;
            let xScale = scaleLinear([0, parseFloat(sData[0][type_name])], [0, width - 105]);
            let resData = [];
            for (let i in sData) {
                sData[i]['len_' + type_name] = xScale(parseFloat(sData[i][type_name]));
                if (resData.length <= 100) {
                    resData.push(sData[i]);
                }
            }
            return resData;
        }
    }
}
</script>

<style>
.el-input__inner {
    font-size: 18px;
}
</style>
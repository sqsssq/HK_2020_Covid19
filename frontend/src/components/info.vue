<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-12-14 16:37:02
 * @LastEditTime: 2023-05-07 11:56:26
-->
<template>
    <div class="frameworkTitle">
        <div class="title">Wordclod View</div>
    </div>
    <div class="frameworkBody">
        <div ref="info" style="height: 100%; width: 100%; font-size: 18px;">
            <svg height="100%" width="100%">
                <g id="word_cloud_g"></g>

                <!-- <g v-for="(t, i) in caseSet" :key="'alp' + i" :transform="translate(30, 0, 0)">
                    <path :d="t" stroke="steelblue" fill="none" stroke-width="0.5"></path>
                </g>
                <g v-for="(t, i) in axis" :key="'a' + i" :transform="translate(30 + i * (elWidth - 80) / 4, 0, 0)">
                    <path :d="'M 0 55 L 0 ' + (elHeight - 10)" stroke="black" fill="none" stroke-width="1"></path>
                    <text :x="'0'" :y="'0'" :transform="translate(0, 35, 0)" :text-anchor="'middle'">{{ t }}</text>
                    <g v-for="(d, j) in tag[i]" :key="'t' + j">
                        <circle cx="0"
                            :cy="55 + (i != 1 && i != 2 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))"
                            r="3" fill="black"></circle>
                        <text x="10"
                            :y="55 + (i != 1 && i != 2 ? ((j + 1) * (elHeight - 65) / (tag[i].length + 1)) : (j * (elHeight - 65) / (tag[i].length - 1)))"
                            dy="0.3em">{{ d }}</text>
                    </g>
                </g> -->
            </svg>
        </div>
    </div>
</template>
<script>
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import * as d3Cloud from 'd3-cloud';
import { timeParse } from 'd3-time-format';
import { useDataStore } from '../stores/counter';
import wordcloud_data from '../assets/wordcloud.csv';
import { extent, select } from 'd3';
export default {
    name: 'APP',
    props: ['allData'],
    data() {
        return {
            elHeight: 0,
            elWidth: 0,
            timeGap: [],
            caseSet: [],
            axis: ['Gender', 'Age', 'Related Case', 'SES', 'Deprivation'],
            tag: [['F', 'M'], ['100', '75', '50', '25', '0'], ['36', '24', '12', '0'], ['High', 'Mid', 'Low'], ['High', 'Mid', 'Low']],
            color_map: ['rgb(235, 237, 240)', 'rgb(234, 193, 166)', 'rgb(221, 115, 109)', 'rgb(179, 92, 81)', 'rgb(115, 68, 50)'],
            legendText: ['Sha Tin', 'Yau Tsim Mong', 'Central and Western', 'Kowloon City', 'Kwai Tsing', 'Kwun Tong', 'Wan Chai', 'Southern', 'Eastern', 'Sai Kung', 'Sham Shui Po', 'Wong Tai Sin', 'Tuen Mun', 'Yuen Long', 'Tai Po', 'Islands', 'Tsuen Wan', 'North']
        }
    },
    methods: {
        translate(x, y, r) {
            return `translate(${x}, ${y}) rotate(${r})`
        },
        calcLink(data, time_tag, timeGap) {
            const scaleAge = scaleLinear([0, 100], [(this.elHeight - 10), 55]);
            const scaleRelate = scaleLinear([0, 36], [(this.elHeight - 10), 55]);
            const scaleGender = {
                'F': 55 +(this.elHeight - 10 - 55) / 3,
                'M': 55 +(this.elHeight - 10 - 55) / 3 * 2
            };
            const scaleType = {
                'H': 55 +(this.elHeight - 10 - 55) / 4,
                'M': 55 +(this.elHeight - 10 - 55) / 4 * 2,
                'L': 55 +(this.elHeight - 10 - 55) / 4 * 3,
            }
            const lenGenerate = line().x(d => d.x).y(d => d.y);
            let caseSet = new Array();
            for (let i in data) {
                if (time_tag == 1) {
                    if (data[i]['report_trans_date'] < timeGap[0] || data[i]['report_trans_date'] > timeGap[1]) {
                        continue;
                    }

                    let d = data[i];
                    let relate = (d['relatedcasesno'].split(','));
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
                    let aStep = (this.elWidth - 80) / 4;
                    let singleCase = [
                        {
                            x: aStep * 0,
                            y: scaleGender[data[i]['gender']]
                        }, {
                            x: aStep * 1,
                            y: scaleAge(data[i]['age'])
                        }, {
                            x: aStep * 2,
                            y: scaleRelate(t_relate.length)
                        }, {
                            x: aStep * 3,
                            y: scaleType[data[i]['Dcca_type'][0]]
                        }, {
                            x: aStep * 4,
                            y: scaleType[data[i]['Deprivation_type'][0]]
                        }];
                    caseSet.push(lenGenerate(singleCase));
                }
            }
            return caseSet;
        },
        wordCloud: function(data, size) {
            let selectWord = {};
            let _this = this;
            for (let i in data) {
                let keys = Object.keys(data[i]);
                // console.log(keys);
                selectWord[data[i][keys[0]]] = parseInt(data[i][keys[1]]);
            }
            // console.log(Object.keys(data), data);
            // const stopWords = ["有", "何", "一", "人", "得", "无", "不", "-", "时"];
            // for (let d in select_dot) {
            //     let word = (data[parseInt(d)].separate);
            //     for (let wd of word) {
            //         if (stopWords.indexOf(wd) != -1) {
            //             continue;
            //         }
            //         if (typeof selectWord[wd] == "undefined") {
            //             selectWord[wd] = 0;
            //         }
            //         selectWord[wd] += 1;
            //     }
            // }
            let wordGroup = [];
            // let sizeScale = d3.extent(selectWord.map(d => d));
            // // console.log(sizeScale);

            for (let d in selectWord) {
                wordGroup.push({
                    word: d,
                    count: selectWord[d]
                });
            }
            wordGroup = wordGroup.sort(function(a, b) {
                return b.count - a.count;
            }).slice(0, 300);
            // console.log(wordGroup);÷
            const sizeScale = scaleLinear(extent(wordGroup.map(d => d.count)), [15, 200])
            // // console.log(wordGroup.map(function (d) {
            //         return {
            //             text: d.word,
            //             size: d.count
            //         }
            //     }))
            // // console.log(wordGroup);
            const cloud = d3Cloud()
                .size(size)
                .words(wordGroup.map(function(d) {
                    return {
                        text: d.word,
                        size: d.count
                    }
                }))
                .padding(3)
                // .spiral('rectangular')
                .spiral('archimedean')
                // .rotate(function () { return ~~(Math.random() * 2) * 90; })
                .rotate(0)
                .fontSize(function(d) { return sizeScale(d.size) * 1; })
                .on("end", drawWordCloud);
            cloud.start();

            function drawWordCloud(words) {
                select('#word_cloud_g')
                    .append("g")
                    .attr("transform", `translate(${size[0] / 2}, ${size[1] / 2})`)
                    .selectAll('.lasso_word')
                    .attr('class', 'lasso_word')
                    .data(words)
                    .enter().append("text")
                    .style("font-size", function(d) { return d.size; })
                    .style("fill", "#69b3a2")
                    .attr("text-anchor", "middle")
                    .style("font-family", "STXingkai")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; })
                    // .attr('opacity', 0)
                    // .transition()
                    // .duration(1000)
                    .attr('opacity', 1);


            }
        },
    },
    created() {
    },
    mounted() {
        this.elHeight = this.$refs.info.offsetHeight;
        this.elWidth = this.$refs.info.offsetWidth;
        const dataStore = useDataStore();
        this.timeGap = dataStore.timeGap;
        const vm = this;
        // console.log(wordcloud_data)
        this.wordCloud(wordcloud_data, [this.elWidth, this.elHeight])
        // this.caseSet = this.calcLink(this.allData, 1, this.timeGap);
        // dataStore.$subscribe(() => {
        //     if (vm.timeGap != dataStore.timeGap) {
        //         vm.timeGap = dataStore.timeGap;
        //         vm.caseSet = vm.calcLink(vm.allData, 1, vm.timeGap);
        //     }
        // })


        // let parseTime = timeParse("%Y/%m/%d");
        // let scale = scaleLinear([parseTime("2020/1/1"), parseTime('2020/12/31')], [1, 366]);
        // console.log(scale(parseTime("2020/1/2")), parseTime("2020/1/1"), parseTime('2020/12/31'))
    },
}
</script>
<style scoped>

</style>

<!--
 * @Description: 
 * @Author: Qing Shi
 * @Date: 2022-11-26 12:24:17
 * @LastEditTime: 2022-11-26 14:17:41
-->
<template>
    <div ref="network" style="width: 100%; height: 100%">
        <svg id="net" height="100%" width="100%"></svg>
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
            networkHeight: 0
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
                let relate = (d['relatedcasesno'].split(','));
                if (relate.length == 1)
                    continue;
                nodes.push({
                    name: d['caseno']
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
                    console.log(start_id, nodeIndex[start_id], parseInt(rn), nodeIndex[parseInt(rn)]);
                    edges.push({
                        source: nodeIndex[start_id],
                        target: nodeIndex[parseInt(rn)],
                        value: 1,
                        id: r1
                    });
                }
            }

            return { nodes: nodes, edges: edges };
        },
        drawNetwork(data) {
            const svg = d3.select('#net');
            let nodes = data.nodes;
            let links = data.edges;
            console.log(nodes);
            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).distance(0).strength(1))
                .force("charge", d3.forceManyBody().strength(-50))
                .force("x", d3.forceX())
                .force("y", d3.forceY());

            console.log(links);
            console.log(nodes);
            // let drag = simulation => {

            //     function dragstarted(event, d) {
            //         if (!event.active) simulation.alphaTarget(0.3).restart();
            //         d.fx = d.x;
            //         d.fy = d.y;
            //     }

            //     function dragged(event, d) {
            //         d.fx = event.x;
            //         d.fy = event.y;
            //     }

            //     function dragended(event, d) {
            //         if (!event.active) simulation.alphaTarget(0);
            //         d.fx = null;
            //         d.fy = null;
            //     }

            //     return d3.drag()
            //         .on("start", dragstarted)
            //         .on("drag", dragged)
            //         .on("end", dragended);
            // }

            // const link = svg.append("g")
            //     .attr("stroke", "#999")
            //     .attr("stroke-opacity", 0.6)
            //     .selectAll("line")
            //     .data(links)
            //     .join("line");

            // const node = svg.append("g")
            //     .attr("fill", "#fff")
            //     .attr("stroke", "#000")
            //     .attr("stroke-width", 1.5)
            //     .selectAll("circle")
            //     .data(nodes)
            //     .join("circle")
            //     .attr("fill", d => d.children ? null : "#000")
            //     .attr("stroke", d => d.children ? null : "#fff")
            //     .attr("r", 3.5)
            //     .call(drag(simulation));

            // simulation.on("tick", () => {
            //     link
            //         .attr("x1", d => d.source.x)
            //         .attr("y1", d => d.source.y)
            //         .attr("x2", d => d.target.x)
            //         .attr("y2", d => d.target.y);

            //     node
            //         .attr("cx", d => d.x)
            //         .attr("cy", d => d.y);
            // });
        }
    },
    created() {
    },
    mounted() {
        this.networkHeight = this.$refs.network.offsetHeight;
        this.networkWidth = this.$refs.network.offsetWidth;
        this.calcNetwork(this.allData);
        let netData = this.calcNetwork(this.allData);
        this.drawNetwork(netData);
    },
}
</script>
<style scoped>

</style>

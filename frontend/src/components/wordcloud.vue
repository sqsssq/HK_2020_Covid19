<template>
    <div class="container">
        <svg style="background-color: white; border-radius: 50%;" :width="width" :height="height" ref="test"
            @mousemove="listener($event)">
            <a class="fontA" :href="tag.href" v-for="(tag, index) in tags" :key="tag.id"
                @mouseenter="mouseenter($event)" @mouseleave="mouseleave($event)">
                <text :x="tag.x" :y="tag.y" :fill="colors[index]" :font-size="tag.size"
                    :fill-opacity="(400 + tag.z) / 600">
                    {{ tag.label }}
                </text>
            </a>
        </svg>
    </div>
</template>
<script>
export default {
    name: "word-cloud",
    //数据，宽，高，半径，半径一般位宽高的一半。
    data() {
        return {
            data: [
                { label: "十九大精神", value: "111", weight: 288 },
                { label: "两学一做", value: "111", weight: 11 },
                { label: "中华民族", value: "111", weight: 22 },
                { label: "马克思主义", value: "111", weight: 33 },
                { label: "民族复兴", value: "111", weight: 44 },
                { label: "社会主义制度", value: "111", weight: 55 },
                { label: "国防白皮书", value: "111", weight: 66 },
                { label: "民主革命", value: "111", weight: 77 },
                { label: "文化强国", value: "111", weight: 88 },
                { label: "国家主权", value: "111", weight: 99 },
                { label: "武装颠覆", value: "111", weight: 56 },
                { label: "领土完整", value: "111", weight: 66 },
                { label: "安全", value: "111", weight: 77 },
                { label: "从严治党", value: "111", weight: 1 },
                { label: "现代化经济体系", value: "111", weight: 122 },
                { label: "国防动员", value: "111", weight: 33 },
                { label: "信息化战争", value: "111", weight: 44 },
                { label: "局部战争", value: "111", weight: 55 },
                { label: "教育", value: "111", weight: 66 },
                { label: "兵法", value: "111", weight: 77 },
                { label: "一国两制", value: "111", weight: 88 },
                { label: "特色社会主义思想", value: "111", weight: 99 },
            ],
            width: 700, //svg宽度
            height: 700, //svg高度
            tagsNum: 0, //标签数量
            RADIUS: 250, //球的半径
            speedX: Math.PI / 360 / 1.5, //球一帧绕x轴旋转的角度
            speedY: Math.PI / 360 / 1.5, //球-帧绕y轴旋转的角度
            tags: [],
            timer: null,
            minSize: 14,
            maxSize: 44,
            colors: [], //存储颜色
        };
    },
    computed: {
        CX() {
            //球心x坐标
            return this.width / 2;
        },
        CY() {
            //球心y坐标
            return this.height / 2;
        },
    },
    created() {
        //初始化标签位置
        this.changeColors();
        let tags = [];
        this.tagsNum = this.data.length;
        for (let i = 0; i < this.data.length; i++) {
            let tag = {};
            let k = -1 + (2 * (i + 1) - 1) / this.tagsNum;
            let a = Math.acos(k);
            let b = a * Math.sqrt(this.tagsNum * Math.PI); //计算标签相对于球心的角度

            tag.label = this.data[i].label;
            tag.value = this.data[i].value;
            let size = this.minSize + parseInt((this.data[i].weight / 100) * 20)
            tag.size = size > this.maxSize ? this.maxSize : size;
            // tag.href = "";

            tag.x = this.CX + this.RADIUS * Math.sin(a) * Math.cos(b); //根据标签角度求出标签的x,y,z坐标
            tag.y = this.CY + this.RADIUS * Math.sin(a) * Math.sin(b);
            tag.z = this.RADIUS * Math.cos(a);
            tags.push(tag);
            console.log(tag);
        }
        this.tags = tags;
    },

    mounted() {
        this.timer = setInterval(() => {
            this.rotateX(this.speedX);
            this.rotateY(this.speedY);
        }, 17);
    },
    methods: {
        // 纵向
        rotateX(angleX) {
            var cos = Math.cos(angleX);
            var sin = Math.sin(angleX);
            for (let tag of this.tags) {
                var y1 = (tag.y - this.CY) * cos - tag.z * sin + this.CY;
                var z1 = tag.z * cos + (tag.y - this.CY) * sin;
                tag.y = y1;
                tag.z = z1;
            }
        },

        // 横向
        rotateY(angleY) {
            var cos = Math.cos(angleY);
            var sin = Math.sin(angleY);
            for (let tag of this.tags) {
                var x1 = (tag.x - this.CX) * cos - tag.z * sin + this.CX;
                var z1 = tag.z * cos + (tag.x - this.CX) * sin;
                tag.x = x1;
                tag.z = z1;
            }
        },

        // 监听鼠标方向
        listener(e) {
            var x = e.clientX - this.CX;
            var y = e.clientY - this.CY;
            if (x * 0.0001 > 0 && y * 0.0001 > 0) {
                this.speedX = -Math.min(this.RADIUS * 0.00002, x * 0.0002);
                this.speedY = -Math.min(this.RADIUS * 0.00002, y * 0.0002);
            } else if (x * 0.0001 < 0 && y * 0.0001 < 0) {
                this.speedX = -Math.max(-this.RADIUS * 0.00002, x * 0.0002);
                this.speedY = -Math.max(-this.RADIUS * 0.00002, y * 0.0002);
            } else {
                this.speedX =
                    x * 0.0001 > 0
                        ? Math.min(this.RADIUS * 0.00002, x * 0.0001)
                        : Math.max(-this.RADIUS * 0.00002, x * 0.0001);
                this.speedY =
                    y * 0.0001 > 0
                        ? Math.min(this.RADIUS * 0.00002, y * 0.0001)
                        : Math.max(-this.RADIUS * 0.00002, y * 0.0001);
            }
        },

        // 鼠标进入文字
        mouseenter(e) {
            // 修改透明度
            let doms = document.getElementsByClassName('fontA');
            for (let i = 0; i < doms.length; i++) {
                doms[i].childNodes[0].style.fillOpacity = '0.3';
            }
            e.target.childNodes[0].style.fillOpacity = 1;

            // 停止动画
            clearInterval(this.timer);
            this.timer = null;
        },

        // 鼠标离开文字
        mouseleave() {
            // 修改透明度
            let doms = document.getElementsByClassName('fontA');
            for (let i = 0; i < doms.length; i++) {
                doms[i].childNodes[0].style.fillOpacity = '';
            }

            // 开始动画
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.timer = setInterval(() => {
                this.rotateX(this.speedX);
                this.rotateY(this.speedY);
            }, 17);
        },

        // 颜色
        changeColors() {
            //随机变色
            for (var i = 0; i < 22; i++) {
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                this.colors[i] = "rgb(" + r + "," + g + "," + b + ")";
            }
        },
    }
};
</script>
  
  
<style scoped>
.container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.fontA {
    font-weight: bold;
    font-family: Apple LiGothic Medium;
}
</style>
  
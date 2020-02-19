<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <strong>用户名：</strong>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>2019-11-01</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>哈尔滨</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:300px;">
                    <div slot="header" class="clearfix">
                        <span>报考前五详情</span>
                    </div>{{percent.firstName}}
                    <el-progress :percentage=percent.first color="#42b983"></el-progress>{{percent.secondName}}
                    <el-progress :percentage=percent.second color="#f1e05a"></el-progress>{{percent.thirdName}}
                    <el-progress :percentage=percent.third></el-progress>{{percent.fourthName}}
                    <el-progress :percentage=percent.fourth color="#f56c6c"></el-progress>{{percent.fifthName}}
                    <el-progress :percentage=percent.fifth color="#f56c6c"></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{count.studentNumber}}</div>
                                    <div>学生数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{count.announcementNumber}}</div>
                                    <div>公告数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-roundcheckfill grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{count.paidNumber}}</div>
                                    <div>完成报名数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:451px;">
                    <schart ref="pie" class="schart" canvasId="pie" :options="options"></schart>
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>-->
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
import { getCount,getSite,getPercent } from '../../api/index';
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            count: {
                studentNumber: 0,
                announcementNumber: 0,
                paidNumber: 0
            },
            options: {
                type: 'pie',
                title: {
                    text: '考点报名人数饼状图'
                },
                legend: {
                    position: 'left'
                },
                bgColor: '#fff',
                labels: ['江苏省常州市', '河南省郑州市', '湖南省长沙市', '江西省赣州市', '河北省唐山市', '西安市未央区'],
                datasets: [
                    {
                        data: [334, 278, 190, 235, 260, 200]
                    }
                ]
            },
            percent: {
                
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return '超级管理员';
        }
    },
    created() {
        this.getData();
    },
    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        getData(){
            getCount().then(res => {
                this.count = res.data[0];
            });
            getSite().then(res => {
                this.options.labels = res.data[0][0];
                this.options.datasets[0].data = res.data[0][1];
            });
            getPercent().then(res => {
                this.percent.firstName = res.data[0][0][0];
                this.percent.first = res.data[0][0][1]; 
                this.percent.secondName = res.data[0][1][0]; 
                this.percent.second = res.data[0][1][1]; 
                this.percent.thirdName = res.data[0][2][0];
                this.percent.third = res.data[0][2][1]; 
                this.percent.fourthName = res.data[0][3][0];
                this.percent.fourth = res.data[0][3][1]; 
                this.percent.fifthName = res.data[0][4][0];
                this.percent.fifth = res.data[0][4][1];
                this.$forceUpdate;
            });
        }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>

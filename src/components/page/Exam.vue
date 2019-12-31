<template>
    <div>
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 专业考试管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.majorName" placeholder="专业" @change="selectQueryMajorChange" class="mr10">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option v-for="item in majorList" 
                                :key="item.id" 
                                :lable="item.id" 
                                :value="item.name">
                    </el-option>
                </el-select>
                <el-select v-model="query.siteName" placeholder="考点" @change="selectQuerySiteChange" class="mr10">
                    <el-option key="" label="全部" value=""></el-option>
                    <el-option v-for="item in siteList" 
                                :key="item.id" 
                                :lable="item.id" 
                                :value="item.name">
                    </el-option>
                </el-select>
                <el-input v-model="query.keyword" placeholder="ID/名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center" column-key="createTime"></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="majorName" label="专业名称"></el-table-column>
                <el-table-column prop="siteName" label="考点名称"></el-table-column>
                <el-table-column prop="startExamineeNumber" label="起始考号"></el-table-column>
                <el-table-column prop="currentExamineeNumber" label="当前考号"></el-table-column>
                <el-table-column prop="province" label="允许报考的省份"></el-table-column>
                <el-table-column prop="startTime" label="开始时间" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="updateTime" label="最后修改时间" :formatter="dateFormat"></el-table-column>
                <el-table-column prop="createTime" label="注册时间" :formatter="dateFormat"></el-table-column>
                <el-table-column label="启用状态" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.isDeleted===false?'success':(scope.row.state===true?'danger':'')"
                        >{{scope.row.isDeleted===false?'正常':'关闭'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 添加弹出框 -->
        <el-dialog :title="dialog.editMode ? '编辑' : '新增'" :visible.sync="editVisible" width="35%">
            <el-form ref="form" :model="form" label-width="110px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="专业名称">
                    <el-select v-model="form.majorName" placeholder="请选择专业考试" @change="selectMajorChange">
                        <el-option v-for="item in majorList" 
                                    :key="item.id" 
                                    :lable="item.id" 
                                    :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考点名称">
                    <el-select v-model="form.siteName" placeholder="请选择考试考点位置" @change="selectSiteChange">
                        <el-option v-for="item in siteList" 
                                    :key="item.id" 
                                    :lable="item.id" 
                                    :value="item.name">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="起始考号">
                    <el-input v-model="form.startExamineeNumber"></el-input>
                </el-form-item>
                <el-form-item label="当前考号">
                    <el-input v-model="form.currentExamineeNumber"></el-input>
                </el-form-item>
                <el-form-item label="允许报考的省份">
                    <el-input v-model="form.province"></el-input>
                </el-form-item>
                <el-form-item label="考试时间设置">
                    <el-date-picker
                    v-model="form.examTime"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否关闭">
                    <template>
                        <el-radio-group v-model="form.isDeleted">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData,editData,delData,delAllData,addData,fetchAllEnabledData } from '../../api/base';
import moment from 'moment';
const mode = 'exams';
export default {
    name: 'examtable',
    data() {
        return {
            query: {
                keyword: '',
                siteId: '',
                majorId: '',
                pageIndex: 1,
                pageSize: 10
            },
            majorList: [],
            siteList: [],
            tableData: [],
            multipleSelection: [],
            dialog: {
                editMode: false
            },
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
        this.selectGetData();
    },
    methods: {
        getData() {
            let query = this.query;
            fetchData({mode, query}).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.pageTotal;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 触发添加按钮
        handleAdd() {
            this.form = { isDeleted:false };
            this.form.isDeleted = false;
            this.editVisible = true;
            this.selectGetData();
            this.dialog.editMode = false;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
            .then(() => {
                let id = row.id;
                delData({mode, id}).then(() => {
                this.$message.success('删除成功');
                this.tableData.splice(index, 1);
                }).catch(() => {
                this.$message.error(`删除失败`);
                });
            })
            .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].id
                if (i != length - 1) {
                    str += ',';
                }
            }
            delAllData({mode, str}).then(() => {
                this.$message.success('删除成功');
                 this.getData();
            }).catch(error => {
                console.log(error);
                this.$message.error(`删除失败`);
            });
            this.multipleSelection = [];
        },
        saveInfo() {
          this.dialog.editMode ? this.saveEdit() : this.saveAdd();  
        },
        // 编辑操作
        handleEdit(index, row) {
            this.dialog.editMode = true;
            this.idx = index;
            this.form = Object.assign({}, row);
            this.form.examTime = [this.form.startTime, this.form.endTime];
            this.selectGetData();
            this.editVisible = true;
        },
        selectGetData() {
            fetchAllEnabledData("majors").then(res => {
                this.majorList = JSON.parse(JSON.stringify(res.data).slice(1, -1));
            }).catch(error => {
               this.$message.error(`获取专业信息失败，稍后再试`);
            });
            fetchAllEnabledData("sites").then(res => {
                this.siteList = JSON.parse(JSON.stringify(res.data).slice(1, -1));
            }).catch(error => {
               this.$message.error(`获取考点信息失败，稍后再试`);
            });
        },
        selectMajorChange(e) {
            let obj = {};
            obj = this.majorList.find((item)=>{//这里的userList就是上面遍历的数据源
                return item.name === e;//筛选出匹配数据
            });
            this.form.majorId = obj.id;
        },
        selectSiteChange(e) {
            let obj = {};
            obj = this.siteList.find((item)=>{//这里的userList就是上面遍历的数据源
                return item.name === e;//筛选出匹配数据
            });
            this.form.siteId = obj.id;
        },
        selectQueryMajorChange(e) {
            this.query.majorId = '';
            let obj = {};
            obj = this.majorList.find((item)=>{//这里的userList就是上面遍历的数据源
                return item.name === e;//筛选出匹配数据
            });
            this.query.majorId = obj.id;
        },
        selectQuerySiteChange(e) {
            this.query.siteId = '';
            let obj = {};
            obj = this.siteList.find((item)=>{//这里的userList就是上面遍历的数据源
                return item.name === e;//筛选出匹配数据
            });
            this.query.siteId = obj.id;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            let form = this.form;
            form.startTime = form.examTime[0];
            form.endTime = form.examTime[1];
            editData({mode, form}).then(() => {
                this.$message.success(`修改 ID 为 ${this.form.id} 的专业考试信息成功`);
                this.$set(this.tableData, this.idx, this.form);
            }).catch(() => {
               this.$message.error(`保存失败`);
            });
        },
        // 保存添加的信息
        saveAdd() {
            this.editVisible = false;
            let form = this.form;
            form.startTime = form.examTime[0];
            form.endTime = form.examTime[1];
            addData({mode, form}).then(() => {
                this.$message.success(`添加专业考试信息成功`);
                this.getData();
            }).catch(() => {
               this.$message.error(`保存失败`);
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        dateFormat(row, column) {
            var date = row[column.property];
            if (date == undefined) {
                return "";
            }
           return moment(date).format("YYYY-MM-DD HH:mm:ss");
       }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

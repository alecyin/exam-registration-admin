<template>
    <div>
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 学生管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>-->
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-input
                    v-model="query.keyword"
                    placeholder="ID/姓名/身份证号码"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-download"
                    class="handle-del mr10"
                    @click="exportExcel"
                    :disabled="outButton"
                >导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 1600px"
                class="table"
                height="500"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center" header-align="center"></el-table-column>
                <el-table-column
                    prop="id"
                    label="ID"
                    align="center"
                    width="55"
                    header-align="center"
                ></el-table-column>
                <el-table-column prop="name" label="姓名" header-align="center"></el-table-column>
                <el-table-column
                    prop="idCardNumber"
                    label="身份证号码"
                    header-align="center"
                    width="170"
                    align="left"
                ></el-table-column>
                <el-table-column
                    prop="sex"
                    label="性别"
                    align="center"
                    width="55"
                    header-align="center"
                ></el-table-column>
                <el-table-column prop="phone" label="手机号码" width="110"></el-table-column>
                <el-table-column
                    prop="address"
                    show-overflow-tooltip
                    label="地址"
                    header-align="center"
                    width="200"
                ></el-table-column>
                <el-table-column
                    prop="school"
                    show-overflow-tooltip
                    label="学校"
                    width="200"
                    header-align="center"
                ></el-table-column>
                <el-table-column prop="email" width="160" label="邮箱" header-align="center"></el-table-column>
                <el-table-column label="照片查看" header-align="center" width="100" align="left">
                    <template slot-scope="scope">
                        <el-link @click="handLook(scope.$index, scope.row, 1)" target="_blank">身份证正面</el-link>
                        <br />
                        <el-link @click="handLook(scope.$index, scope.row, 2)" target="_blank">证件照</el-link>
                        <br />
                        <el-link @click="handLook(scope.$index, scope.row, 3)" target="_blank">省准考证</el-link>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="loginTime"
                    label="最后登录时间"
                    align="center"
                    width="160"
                    :formatter="dateFormat"
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="注册时间"
                    align="center"
                    width="160"
                    :formatter="dateFormat"
                ></el-table-column>
                <el-table-column label="启用状态" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-tag
                            :type="scope.row.isDeleted?'danger':'success'"
                        >{{scope.row.isDeleted?'关闭':'正常'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="200" header-align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-unlock"
                            @click="handleReset(scope.$index, scope.row)"
                        >重置密码</el-button>
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
            <div style="display:none">
                <el-table :data="tableOutData" id="studentTable">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="idCardNumber" label="身份证号码"></el-table-column>
                    <el-table-column prop="sex" label="性别"></el-table-column>
                    <el-table-column prop="phone" label="手机号码"></el-table-column>
                    <el-table-column prop="address" label="地址"></el-table-column>
                    <el-table-column prop="school" label="学校"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column prop="loginTime" label="最后登录时间"></el-table-column>
                    <el-table-column prop="createTime" label="注册时间" :formatter="dateFormat"></el-table-column>
                    <el-table-column label="启用状态">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.isDeleted?'danger':'success'"
                            >{{scope.row.isDeleted?'关闭':'正常'}}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio v-model="form.sex" label="男">男</el-radio>
                    <el-radio v-model="form.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="身份证号码" prop="idCardNumber">
                    <el-input v-model="form.idCardNumber"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="学校">
                    <el-input v-model="form.school"></el-input>
                </el-form-item>
                <el-form-item label="是否关闭">
                    <template>
                        <el-radio-group v-model="form.isDeleted">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetchData, editData, delData, delAllData } from '../../api/base';
import { resetPass } from '../../api/student';
import moment from 'moment';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
const mode = 'students';
export default {
    name: 'studentstable',
    data() {
        return {
            query: {
                keyword: '',
                pageIndex: 1,
                pageSize: 10
            },
            outButton: true,
            tableData: [],
            tableOutData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            suffix: '.jpg',
            prefix: 'http://47.105.93.192/api/photo/'
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            let query = this.query;
            fetchData({ mode, query }).then(res => {
                this.tableData = res.data;
                this.pageTotal = res.pageTotal;
            });
            let keyword = this.query.keyword;
            query = {
                keyword: keyword,
                pageIndex: 1,
                pageSize: 99999
            };
            fetchData({ mode, query }).then(res => {
                this.tableOutData = res.data;
                this.outButton = false;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.outButton = true;
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let id = row.id;
                    delData({ mode, id })
                        .then(() => {
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        })
                        .catch(() => {
                            this.$message.error(`删除失败`);
                        });
                })
                .catch(() => {});
        },
        // 重置操作
        handleReset(index, row) {
            // 二次确认
            this.$confirm('确定要重置成123456吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    resetPass(row).then(res => {
                        this.$message.success(`重置成功`);
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
                str += this.multipleSelection[i].id;
                if (i != length - 1) {
                    str += ',';
                }
            }
            delAllData({ mode, str })
                .then(() => {
                    this.$message.success('删除成功');
                    this.getData();
                })
                .catch(error => {
                    console.log(error);
                    this.$message.error(`删除失败`);
                });
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = Object.assign({}, row);
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            let form = this.form;
            editData({ mode, form })
                .then(() => {
                    this.$message.success(`修改 ID 为 ${this.form.id} 的学生信息成功`);
                    this.$set(this.tableData, this.idx, this.form);
                })
                .catch(() => {
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
                return '';
            }
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
        handLook(index, row, type) {
            console.log(type);
            if (type === 1) {
                if (row.idCardPic === undefined) {
                    this.$message.error(`考生还未上传此图片`);
                } else {
                    window.open(this.prefix + row.idCardPic + this.suffix, '_blank');
                }
            } else if (type === 2) {
                if (row.profilePic === undefined) {
                    this.$message.error(`考生还未上传此图片`);
                } else {
                    window.open(this.prefix + row.profilePic + this.suffix, '_blank');
                }
            } else if (type === 3) {
                if (row.provincialExamineePic === undefined) {
                    this.$message.error(`考生还未上传此图片`);
                } else {
                    window.open(this.prefix + row.provincialExamineePic + this.suffix, '_blank');
                }
            }
        },
        exportExcel() {
            var xlsxParam = { raw: true };
            var wb = XLSX.utils.table_to_book(document.querySelector('#studentTable'), xlsxParam);
            var wbout = XLSX.write(wb, {
                bookType: 'xlsx',
                bookSST: true,
                type: 'array'
            });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '学生.xlsx');
            } catch (e) {
                if (typeof console !== 'undefined') console.log(e, wbout);
            }
            return wbout;
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

<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">后台管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <!-- <div class="btn-bell">
                    <el-tooltip
                        effect="dark"
                        :content="message?`有${message}条未读消息`:`消息中心`"
                        placement="bottom"
                    >
                        <router-link to="/tabs">
                            <i class="el-icon-bell"></i>
                        </router-link>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div> -->
                <!-- 用户头像 -->
                <!-- <div class="user-avator">
                    <img src="../../assets/img/img.jpg" />
                </div> -->
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <a href="https://github.com/lin-xin/网上报名系统" target="_blank">
                            <el-dropdown-item>项目仓库</el-dropdown-item>
                        </a> -->
                        <el-dropdown-item divided command="handleEditPass">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
                <el-dialog title="修改密码" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="90px" :rules="rules">
                <el-form-item label="原密码"  prop="oldPass">
                    <el-input :type="passw1" v-model="form.oldPass">
                        <i slot="suffix" :class="icon1" @click="showPass1"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="新密码"  prop="newPass">
                    <el-input :type="passw2" v-model="form.newPass">
                        <i slot="suffix" :class="icon2" @click="showPass2"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPass">
                    <el-input :type="passw3" v-model="form.confirmPass">
                        <i slot="suffix" :class="icon3" @click="showPass3"></i>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import bus from '../common/bus';
import {updatePass} from '../../api/user';
export default {
    data() {
        return {
            collapse: false,
            fullscreen: false,
            name: 'yhf',
            message: 2,
            dialog: {},
            passw1: 'password',
            passw2: 'password',
            passw3: 'password',
            icon1: 'el-input__icon el-icon-view',
            icon2: 'el-input__icon el-icon-view',
            icon3: 'el-input__icon el-icon-view',
            form: {},
            editVisible: false,
            rules: {
                oldPass: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 30,
                        message: '长度在 6 到 30 个字符'
                    },
                    {
                        pattern: /^(\w){6,20}$/,
                        message: '只能输入6-20个字母、数字、下划线'
                    }
                ],
                newPass: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 30,
                        message: '长度在 6 到 30 个字符'
                    },
                    {
                        pattern: /^(\w){6,20}$/,
                        message: '只能输入6-20个字母、数字、下划线'
                    }
                ],
                confirmPass: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    },
                    {
                        min: 6,
                        max: 30,
                        message: '长度在 6 到 30 个字符'
                    },
                    {
                        pattern: /^(\w){6,20}$/,
                        message: '只能输入6-20个字母、数字、下划线'
                    }
                ]
            }
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                localStorage.removeItem('ms_username');
                this.$router.push('/login');
            } else {
                this.handleEditPass();
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        },
        handleEditPass() {
            this.editVisible = true;
        },
        saveEdit() {
            if (this.form.newPass != this.form.confirmPass) {
                this.$message.error('两次输入的新密码不一样，请重新输入');
            } else {
                let form =  this.form;
                updatePass(form).then(res => {
                    this.$message.success(`修改成功`);
                });
                this.editVisible = false;
                this.form = {};
            }
        },
        cancelEdit() {
            this.editVisible = false;
            this.form = {};
        },
        showPass1() {
            if (this.passw1 == 'text') {
                this.passw1 = 'password';
                this.icon1 = 'el-input__icon el-icon-view';
            } else {
                this.passw1 = 'text';
                this.icon1 = 'el-input__icon el-icon-loading';
            }
        },
        showPass2() {
            if (this.passw2 == 'text') {
                this.passw2 = 'password';
                this.icon2 = 'el-input__icon el-icon-view';
            } else {
                this.passw2 = 'text';
                this.icon2 = 'el-input__icon el-icon-loading';
            }
        },
        showPass3() {
            if (this.passw3 == 'text') {
                this.passw3 = 'password';
                this.icon3 = 'el-input__icon el-icon-view';
            } else {
                this.passw3 = 'text';
                this.icon3 = 'el-input__icon el-icon-loading';
            }
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    font-size: 20px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 50px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 50px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 50px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>

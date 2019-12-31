<template>
    <div>
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->
        <div class="container">
            <div class="plugins-tips">
                在下方输入保存即可
            </div>
            <quill-editor ref="myTextEditor" v-model="form.content" :options="editorOption"></quill-editor>
            <el-button class="editor-btn" type="primary" @click="submit">保存</el-button>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import { fetchData } from '../../api/base';
    import { editData } from '../../api/examineeNote';
    const mode = "examinee-notes";
    export default {
        name: 'editor',
        data: function(){
            return {
                form: {
                    content: ''
                },
                editorOption: {
                    placeholder: '请输入内容'
                }
            }
        },
        components: {
            quillEditor
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let query = null;
                fetchData({mode, query}).then(res => {
                    this.form.content = res.data[0].content;
                });
            },
            onEditorChange({ editor, html, text }) {
                this.form.content = html;
            },
            submit(){
                editData(this.form).then(() => {
                    this.$message.success(`保存成功`);
                }).catch(() => {
                    this.$message.error(`保存失败`);
                });
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
    }
</style>
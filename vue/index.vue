<template>
        <el-row style='height:100%;'>
            <el-col :span="4" style='height:100%;background-color:#eef1f6'>
                <el-menu default-active="/" :router='true' class="el-menu-vertical-demo">
                    <el-menu-item index="/"><i class="el-icon-menu"></i>访问记录</el-menu-item>
                    <el-menu-item index="/email"><i class="el-icon-setting"></i>邮件传递记录</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" style='padding:10px;'>
                <div class="toolbar">
                    <el-form :model='form' ref='form' :inline="true" :rules='rules' class="demo-form-inline">
                        <el-form-item label="目标邮箱" prop='email'>
                            <el-input placeholder="请输入邮箱地址" style='width:240px;' v-model='form.email'>
                                <template slot="append">{{prefix}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="操作行为">
                            <el-select placeholder="请选择操作行为" v-model='form.action'>
                                <el-option label="DELE" value="DELE"></el-option>
                                <el-option label="LOGIN" value="LOGIN"></el-option>
                                <el-option label="RETR" value="RETR"></el-option>
                                <el-option label="FETCH" value="FETCH"></el-option>
                                <el-option label="Adding" value="Adding"></el-option>
                                <el-option label="EXPUNGE" value="EXPUNGE"></el-option>
                                <el-option label="SendMsgRequest" value="SendMsgRequest"></el-option>
                            </el-select>
                        </el-form-item >
                        <el-form-item label="日期范围" v-model='form.date' >
                            <el-date-picker
                                    v-model='form.date'
                                    type="daterange"
                                    placeholder="选择日期范围">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click='onSearch' icon='search' >查询</el-button>
                            <!--<el-button  @click='onReset'  >重置</el-button>-->
                        </el-form-item>
                    </el-form>
                </div>
                <el-table
                        :data='data'
                        :height="height"
                        v-loading.body="loading"
                        element-loading-text="拼命加载中"
                >
                    <el-table-column type='index' label='#' width='60'>
                        <template scope='scope'>
                            <span>{{scope.$index + 1 + (form.page - 1)*form.size}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='地址（address）' prop='address'>
                    </el-table-column>
                    <el-table-column label='操作行为（action）'  prop='action'>
                    </el-table-column>
                    <el-table-column label='系统IP（systemIp）'  prop='systemIp'>
                    </el-table-column>
                    <el-table-column label='操作时间（timestamp）'  inline-template >
                        <span>{{new Date(row.timestamp*1000).Format('yyyy-MM-dd hh:ss')}}</span>
                    </el-table-column>
                </el-table>
                <div style="text-align:right;margin-top:5px;">
                    <el-pagination

                            @current-change="handleCurrentChange"
                            :current-page="form.page"
                            :page-size="20"
                            layout="total, prev, pager, next"
                            :total="total">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
</template>
<style lang='less'>
    body,html{
        height: 100%;
        padding: 0;
        margin: 0;
    }
    header{
        height:60px;
        background-color: #324157;
        position: fixed;
        top:0;
        left: 0;
        right:0;
        line-height: 60px;
        color: #fff;
        padding:0 20px;
        font-size:22px;
        z-index: 1000;
    }

    section{
        position: absolute;
        top:60px;
        bottom: 0;
        left: 0;
        width: 100%;
        .toolbar{
            padding-top: 10px;
        }
    }

    .el-menu-item.is-active{
        background-color: #9ddde5;
    }
</style>
<script>
    export default{
        data(){
            return{
                prefix:'@sjtu.edu.cn',
                form: {
                    email:'qizhwei',
                    date:[],
                    action:'DELE',
                    page:1,
                    size:20
                },
                rules:{
                    email:[
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                },
                data:[],
                height:document.documentElement.clientHeight - 190,
                total:0,
                loading:false
            }
        },
        methods:{
            onSearch() {
                if(this.loading){
                    return;
                }
                this.$refs.form.validate(valid =>{
                    if(valid){
                        this.getData();
                    }
                })
            },
            onReset(){
                this.form.email = '';
                this.form.date = [];
                this.form.action = 'DELE';
                this.form.page = 1;
                this.data = [];
            },
            transData(data) {
                return data.map(d=>{
                    let obj = d._fields[0].segments[0];

                    return {
                        address:obj.start.properties.address,
                        action:obj.relationship.properties.action,
                        timestamp:obj.relationship.properties.timestamp,
                        systemIp:obj.relationship.properties.systemIp
                    }
                });
            },
            getData() {
                this.loading = true;
                let params = JSON.parse(JSON.stringify(this.form));
                params.email += this.prefix;
                let query = $.extend(params,{date:this.getDate(this.form.date)})
                $.get('/email/data',query,rep=> {
                    this.total = rep.total.records[0]._fields[0].low;
                    this.data = this.transData(rep.data);
                    this.loading = false;
                })
            },
            getDate(d){

                if(d.length == 2){
                    return [d[0].valueOf()/1000,d[1].valueOf()/1000]
                }else{
                    return [];
                }
            },
            handleCurrentChange(p) {
                this.form.page = p;
                this.getData();
            }
        },
        mounted(){

        }
    }
</script>

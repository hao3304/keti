<template>
        <el-row style='height:100%;'>
            <el-col :span="4" style='height:100%;background-color:#eef1f6'>
                <el-menu default-active="/email" :router='true' class="el-menu-vertical-demo">
                    <el-menu-item index="/"><i class="el-icon-menu"></i>访问记录</el-menu-item>
                    <el-menu-item index="/email"><i class="el-icon-setting"></i>邮件传递记录</el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="20" style='padding:10px;'>
                <div class="toolbar">
                    <el-form :model='form' ref='form' :inline="true" :rules='rules' class="demo-form-inline">
                        <el-form-item label="目标邮箱" prop='email'>
                            <el-input placeholder="请输入邮箱地址" style='width:260px;' v-model='form.email'>
                                <template slot="append">{{prefix}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="日期范围" v-model='form.date' >
                            <el-date-picker
                                    v-model='form.date'
                                    type="daterange"
                                    placeholder="选择日期范围">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click='onSearch' icon='search' >查询</el-button>
                            <el-button type="default" @click='onReset'  >重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <el-tabs v-model="activeName"  >
                    <el-tab-pane label="收件箱" name="receive">
                        <el-table
                                :data='receive'
                                :height="height"
                                v-loading.body="receive_loading"
                                element-loading-text="拼命加载中"
                        >
                            <el-table-column type="expand">
                                <template scope="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="邮件ID">
                                            <span>{{ props.row.id }}</span>
                                        </el-form-item>
                                        <el-form-item label="对方IP">
                                            <span>{{ props.row.sendIp }}</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column type='index' label='#' width='60'>
                                <template scope='scope'>
                                    <span>{{scope.$index + 1 + (receive_page - 1)*20}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='对方地址' prop='address'>
                            </el-table-column>
                            <el-table-column label='对方发送时间' inline-template>
                                <span>
                                    {{new Date(row.sendTime*1000).Format('yyyy-MM-dd hh:ss')}}
                                </span>
                            </el-table-column>
                            <el-table-column label='邮件大小(Kb)'  inline-template>
                                <span>{{(row.size/1024).toFixed(2)}}</span>
                            </el-table-column>
                        </el-table>
                        <div style="text-align:right;margin-top:5px;">
                            <el-pagination
                                    @current-change="receiveCurrentChange"
                                    :current-page="receive_page"
                                    :page-size="20"
                                    layout="total, prev, pager, next"
                                    :total="receive_total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="发件箱" name="send">
                        <el-table
                                :data='send'
                                :height="height"
                                v-loading.body="send_loading"
                                element-loading-text="拼命加载中"
                        >
                            <el-table-column type="expand">
                                <template scope="props">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="邮件ID">
                                            <span>{{ props.row.id }}</span>
                                        </el-form-item>
                                        <el-form-item label="对方地址">
                                            <span>{{ props.row.address }}</span>
                                        </el-form-item>
                                        <el-form-item label="发送IP">
                                            <span>{{ props.row.sendIp }}</span>
                                        </el-form-item>
                                        <el-form-item label="发送时间">
                                            <span> {{new Date(props.row.sendTime*1000).Format('yyyy-MM-dd hh:ss')}}</span>
                                        </el-form-item>
                                        <el-form-item label="目标IP">
                                            <span>{{ props.row.receiveIp }}</span>
                                        </el-form-item>
                                        <el-form-item label="接收时间">
                                            <span>    <span> {{new Date(props.row.receiveTime*1000).Format('yyyy-MM-dd hh:ss')}}</span></span>
                                        </el-form-item>
                                        <el-form-item label="状态">
                                            <span>{{ props.row.status }}</span>
                                        </el-form-item>
                                    </el-form>
                                </template>
                            </el-table-column>
                            <el-table-column type='index' label='#' width='60'>
                                <template scope='scope'>
                                    <span>{{scope.$index + 1 + (send_page - 1) * 20}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label='发送地址' prop='address'>
                            </el-table-column>
                            <el-table-column label='发送时间'  inline-template >
                                <span>
                                    {{new Date(row.sendTime*1000).Format('yyyy-MM-dd hh:ss')}}
                                </span>
                            </el-table-column>
                            <el-table-column label='邮件大小'  inline-template>
                                <span>{{(row.size/1024).toFixed(2)}}</span>
                            </el-table-column>
                        </el-table>
                        <div style="text-align:right;margin-top:5px;">
                            <el-pagination
                                    @current-change="sendCurrentChange"
                                    :current-page="send_page"
                                    :page-size="20"
                                    layout="total, prev, pager, next"
                                    :total="send_total">
                            </el-pagination>
                        </div>
                    </el-tab-pane>
                </el-tabs>

            </el-col>
        </el-row>
</template>
<style lang='less'>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
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
                    size:20
                },
                send_page:1,
                receive_page:1,
                send_total:0,
                receive_total:0,
                send:[],
                receive:[],
                rules:{
                    email:[
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                },
                height:document.documentElement.clientHeight - 247,

                send_loading:false,
                receive_loading:false,
                activeName:'receive',
                hasSearch:false
            }
        },
        methods:{
            onSearch() {
                if(this.loading){
                    return;
                }

                this.send = [];
                this.receive = [];
                this.send_page = 1;
                this.receive_page = 1;

                this.$refs.form.validate(valid =>{
                    if(valid){
                        this.hasSearch = true;
                        this.getData();
                    }
                })
            },
            onReset(){
                this.send = [];
                this.receive = [];
                this.send_page = 1;
                this.receive_page = 1;
                this.form.email = '';
                this.form.date = [];
            },
            transData(data) {
                return data.map((d)=>{
                    if(this.activeName == 'receive'){
                        return {
                            id:d._fields[0],
                            address:d._fields[1],
                            sendIp:d._fields[2].properties.sendIp,
                            sendTime:d._fields[2].properties.sendTime,
                            status:d._fields[2].properties.status,
                            size:d._fields[2].properties.size.low
                        }

                    }else{
                        return {
                            id:d._fields[0],
                            address:d._fields[1],
                            sendIp:d._fields[2].properties.sendIp,
                            sendTime:d._fields[2].properties.sendTime,
                            receiveIp:d._fields[2].properties.receiveIp,
                            receiveTime:d._fields[2].properties.receiveTime,
                            status:d._fields[2].properties.status,
                            size:d._fields[2].properties.size.low
                        }
                    }

                });
            },
            getData() {
                this[this.activeName+'_loading'] = true;
                let email = this.form.email;
                let type = this.activeName;
                let page = this.activeName == 'send'?this.send_page:this.receive_page;
                let prefix = this.prefix;
                $.get(`/email/${email}${prefix}/${type}/${page}`,{date:this.getDate(this.form.date)},rep=>{
                    this[this.activeName+'_total'] = rep.total.records[0]._fields[0].low;
                    this[this.activeName] = this.transData(rep.data);
                     this[this.activeName+'_loading'] = false;
                })
               /* let query = $.extend(JSON.parse(JSON.stringify(this.form)),{date:this.getDate(this.form.date)})
                $.get('/email/data',query,rep=> {
                    this.total = rep.total.records[0]._fields[0].low;
                    this.data = this.transData(rep.data);
                    this.loading = false;
                }) */
            },
            getDate(d){
                if(d.length == 2){
                    return [d[0].valueOf()/1000,d[1].valueOf()/1000]
                }else{
                    return [];
                }
            },
            receiveCurrentChange(p) {
                this.receive_page = p;
                this.getData();
            },
            sendCurrentChange(p) {
                this.send_page = p;
                this.getData();
            }
        },
        watch:{
            activeName(){

                if(this[this.activeName].length == 0 && this.hasSearch) {
                    this.getData();
                }
            }
        },
        mounted(){

        }
    }
</script>

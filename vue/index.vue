<template>
    <div>
        <header>
            通用查询系统
        </header>
        <section>
            <div class="toolbar">
                <el-form :model='form' ref='form' :inline="true" :rules='rules' class="demo-form-inline">
                    <el-form-item label="目标邮箱" prop='email'>
                        <el-input placeholder="请输入目标邮箱地址" v-model='form.email'></el-input>
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
                </el-form-item>
                </el-form>
            </div>
            <el-table
                    :data='data'
                    :height="height"
                    v-loading.body="loading"
                    element-loading-text="拼命加载中"
            >
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
        </section>
    </div>
</template>
<style lang='less'>
    body,html{
        height: 100%;
        padding: 0;
        margin: 0;
    }
    header{
        height:60px;
        background-color: #0099cc;
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
        padding:60px 10px 0 10px;
        .toolbar{
            padding-top: 10px;
        }
    }
</style>
<script>
    export default{
        data(){
            return{
                form: {
                    email:'liu-wei@sjtu.edu.cn',
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
                height:document.documentElement.clientHeight - 200,
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
                let query = $.extend(JSON.parse(JSON.stringify(this.form)),{date:this.getDate(this.form.date)})
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
            Date.prototype.Format = function (fmt) { //author: meizz
                var o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        }
    }
</script>

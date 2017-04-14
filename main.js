/**
 * Created by jack on 2017/4/9.
 */


import Vue from 'vue'
import UI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import view from './vue/index.vue'
import email from './vue/email.vue'
import VueRouter from 'vue-router'

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

const routes = [
    {path:'/',component:view },
    {path:'/email',component:email }
]

const router = new VueRouter({
    routes
})

Vue.use(UI)
Vue.use(VueRouter)

const app = new Vue({
    router,
    data:{
        header:true
    },
    mounted() {
        $('.preloader').hide();
    }
}).$mount('#app')

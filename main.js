/**
 * Created by jack on 2017/4/9.
 */


import Vue from 'vue'
import UI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import view from './vue/index.vue'



Vue.use(UI)

new Vue({
    el:'#app',
    render:h=>h(view)
})


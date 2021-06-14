import Vue from './vue.js'

const vm = new Vue({
    el: "#app",
    data: {
        msg: "Hello, vue",
        count: "100",
        innerHtml: "<ul><li>good job</li></ul>"
    },
    methods: {
        handler(){
            alert(1111)
        }
    }
})

console.log(vm)
import Dep from "./dep.js"

/**
 * 功能：观察者对象类
 * 1、watcher初始化获取oldvalue的时候，会做哪些操作
 * 2、通过vm[key]获取oldvalue时，为什么将当前实例挂载在dep上获取后设置为null
 * 3、update方法在什么时候执行的：dp.notify()
 */
export default class Watcher {
    /**
     * @param {*} vm vue实例
     * @param {*} key data中的属性名
     * @param {*} cb 负责更新视图的回调函数
     */
    constructor(vm, key, cb){
        this.vm = vm
        this.key = key
        this.cb = cb

        //每次watcher初始化时，添加target属性
        Dep.target = this
        //触发get方法，在get方法里会取做一些操作
        this.oldValue = this.vm[key]
        Dep.target = null //可能会出现脏数据,清空操作
    }

    /**
     * 当数据变化时更新视图
     */
    update(){
        let newValue = this.vm[this.key]
        if(this.oldValue === this.newValue){
            return
        }
        this.cb(newValue)
    }
}

/**
 * 功能：实现数据劫持，利用dep进行依赖收集和派发更新
 * 1、调用时机：vue实例化时调用，监听data数据变化，new Observer(this.$data)
 * 2、实现机制：Object.defineProperty(this.$data, key, {})
 {
    a: 'tes',
    info: {
        name: "xiaoming"
    }
 }
const dep1 = new Dep()
Object.defineProperty(this.$data, 'a', {
	get(){
		dep1.depend() //收集依赖
	    return value
	},
    set(newValue){
		if(newValue === value) return
        value = newValue
        dep1.notify() //通知依赖
	}
})

const dep2 = new Dep()
Object.defineProperty(this.$data, 'info', {
 ...
})

const dep3 = new Dep()
Object.defineProperty(this.$data.info, 'name', {
 ...
})
* 3、使用dep完成依赖收集dep.addSub和派发更新dep.notify机制
* 编译模版：
为每个组件建立watch对象，eg：<div v-text="good"></div>  new Watcher(this.vm, key, newValue => {node.textContent = newValue}
建立watch时，获取oldvalue，设置Dep.target，获取this.vm."good"值，触发vm的getter
获取this.$data["good"]，触发this.$data的getter，添加值dep依赖中
设置Dep.target = null，清除脏数据
* 数据更新：this.flag = 1 -> vm的setter -> vm.$data.flag = 2 -> vm.$data.setter -> dep.notify -> 所有相关watcher.update
*/
import Dep from "./dep.js"

export default class Observer {
    constructor(data){
        this.traverse(data)
    }

    /**
     * 递归遍历data里的所有属性
     */
    traverse(data){
        if(!data || typeof data !== 'object'){
            return
        }
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    /**
     * 给传入的数据设置 getter/setter，响应式改造
     * 1、给vm.$data对象里的每个属性递归设置getter和setter
     * 2、使用dep进行依赖收集dep.addSub和派发更新dep.notify
     * @param {*} obj 
     * @param {*} key
     * @param {*} val
     */
    defineReactive(obj, key, val){
        this.traverse(val) //子元素是对象，递归处理
        const that = this
        const dep = new Dep() //dep存储观察者
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            get(){
                Dep.target && dep.addSub(Dep.target) //收集依赖，只有当watcher初始化时才会添加依赖
                return val
            },
            set(newValue){
                if(newValue === val){
                    return
                }
                val = newValue
                that.traverse(newValue)//设置的时候可能设置了对象
                dep.notify()
            }
        })
    }
}
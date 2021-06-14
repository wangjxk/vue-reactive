/**
 * 1. vue构造函数，接收各种配置参数等
 * 2. options里的data挂载至根实例
 * 3. 实例化observer对象，监听数据变化，利用dep进行依赖收集和派发更新
 * 4. 实例化compiler对象，简析指令和模版表达式
 */

import Observer from './observer.js'
import Compiler from './compiler.js'

export default class Vue {
    constructor(options = {}){
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods
    
        this.initRootElement(options)
        //options里的data挂载至根实例
        this._proxyData(this.$data)

        //实例化observer对象，监听数据变化
        new Observer(this.$data)

        //实例化compiler对象，简析指令和模版表达式
        new Compiler(this)
    }

    /**
     * 获取根元素，并存储到vue实例，校验传入的el是否合规
     */
    initRootElement(options){
        if(typeof options.el === 'string'){
            this.$el = document.querySelector(options.el)
        }else if(options.el instanceof HTMLElement){
            this.$el = options.el
        }

        if(!this.$el){
            throw new Error('input el error, you should input css selector or HTMLElement')
        }
    }

    /**
     * 利用Object.defineProperty将options传入的data注入vue实例中
     * 给vm设置getter和setter
     * vm.a触发getter，获取this.$data[key]
     * vm.a=2触发setter，设置this.$data[key]=2
     */
    _proxyData(data){
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key] === newValue){
                        return
                    }
                    data[key] = newValue
                }
            })
        })

    }
}
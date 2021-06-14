import Watcher from './watcher.js'

/**
 * 功能：模版编译
 * 1、模版编译时为每个组件添加一个watcher实例，设置回调函数为更新数据
 * 2、watcher初始化时，传入实例、key、回调
 */
export default class Compiler {
    constructor(vm){
        this.el = vm.$el
        this.vm = vm
        this.methods = vm.$methods
        this.compiler(vm.$el)
    }

    /**
     * 编译模版
     * @param {} el 
     */
    compiler(el){
        const childNodes = el.childNodes //nodeList伪数组
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)){//文本节点
                this.compilerText(node)
            }else if(this.isElementNode(node)){//元素节点
                this.compilerElement(node)
            }

            //有子节点，递归调用
            if(node.childNodes && node.childNodes.length > 0){
                this.compiler(node)
            }
        })
    }

   /** 判断文本节点 */
   isTextNode(node){
       return node.nodeType === 3
   }

    /** 判断元素节点 */
   isElementNode(node){
       return node.nodeType === 1
   }

   /** 判断元素属性是否是指令 */
   isDirective(attrName){
        return attrName.startsWith('v-')
   }

   /** 编译文本节点，{{text}} */
   compilerText(node){
       const reg = /\{\{(.+?)\}\}/;
       const value = node.textContent;
       if(reg.test(value)){ 
           const key = RegExp.$1.trim() //$1取到匹配内容，text
           node.textContent = value.replace(reg, this.vm[key]) //this.vm[key]即vm[text]
           new Watcher(this.vm, key, (newValue)=> {
                node.textContent = newValue //更新视图
           })
       }
   }

   /** 编译元素节点 */
   compilerElement(node){
        if(node.attributes.length){
            Array.from(node.attributes).forEach(attr => { //遍历节点的属性
                const attrName = attr.name //属性名
                if(this.isDirective(attrName)){ //v-model="msg"、v-on:click="handle"
                    let directiveName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2) //指令名，model、click
                    let key = attr.value //msg\handle，属性值
                    this.update(node, key, directiveName) //更新元素节点
                }
            })
        }
   }

   /**
    * 更新节点
    * @param {*} node 
    * @param {*} key 指令值：msg、handle
    * @param {*} directiveName 指令名，model
    */
   update(node, key, directiveName){
       //v-model\v-text\v-html\v-on:click
       const updateFn = this[directiveName + 'Updater']
       updateFn && updateFn.call(this, node, this.vm[key], key, directiveName) //
   }

   /** 解析v-text，编译模版，添加watcher */
   textUpdater(node, value, key){
        node.textContent = value
        new Watcher(this.vm, key, newValue => {
            node.textContent = newValue
        })
   }

   /** 解析v-model */
   modelUpdater(node, value, key){
        node.value = value
        new Watcher(this.vm, key, newValue => {
            node.value = newValue
        })
        node.addEventListener('input', ()=>{
            this.vm[key] = node.value
        })
   }

   /** 解析v-html */
   htmlUpdater(node, value, key){
        node.innerHTML = value
        new Watcher(this.vm, key, newValue => {
            node.innerHTML = newValue
        })
   }

   /** 解析v-on:click */
   clickUpdater(node, value, key, directiveName){
        node.addEventListener(directiveName, this.methods[key])
   }
}
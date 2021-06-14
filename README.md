# vue-reactive
Project for vue reactive principle

申明整体核心类及方法，确认整体框架结构：

* index.html 主页面
* vue.js Vue主文件
* compiler.js 编译模版，解析指令（v-model等）
* dep.js 收集依赖关系，存储观察者，以发布订阅模式实现
* observer.js 实现数据劫持
* watcher.js 观察者对象类

```js
//vue主文件
export default class Vue {
   constructor(options = {}){
     /**
       * 1. vue构造函数，接收各种配置参数等
       * 2. options里的data挂载至根实例
       * 3. 实例化observer对象，监听数据变化，利用dep进行依赖收集和派发更新
       * 4. 实例化compiler对象，简析指令和模版表达式
       */
      ...
      this._proxyData(this.$data)
      new Observer(this.$data)
      new Compiler(this)
   }
}

//observer.js：实现数据劫持
export default class Observer {
    constructor(data){
        this.traverse(data)
    }
    traverse(data){} //递归遍历data里的所有属性
    defineReactive(obj, key, val){} //给传入的数据设置getter/setter, 利用dep实现依赖收集和派发更新
}

//compiler.js：编译模版，解析指令
export default class Compiler {
    constructor(vm){
        this.compiler(vm.$el)
    }
    compiler(el){} //编译模版时为每个响应式对象建立watcher对象，并将watcher推送进dep用于依赖收集
}

//dep.js：收集依赖关系，存储观察者
export default class Dep {
    constructor(){ //存储所有观察者
        this.subs = []
    }
    addSub(watcher){} //添加观察者
    notify(){} //发送通知
}

//watcher.js：观察者对象类
export default class Watcher {
    constructor(vm, key, cb){} //vm实例、key属性、cb回调函数
    update(){} //当数据变化时更新视图
}
```

#### 2、index.html

使用module引入vue进行测试，测试指令及响应式

```html
<!DOCTYPE html>
<html lang="cn">
    <head>
        <title>my vue</title>
    </head>
    <body>
        <div id="app">
            <h1>模版表达式测试</h1>
            <h3>{{msg}}</h3>
            <h3>{{count}}</h3>
            <br/>

            <h1>v-text测试</h1>
            <div v-text="msg"></div>
            <br/>

            <h1>v-html测试</h1>
            <div v-html="innerHtml"></div>
            <br/>

            <h1>v-model测试</h1>
            <input type="text" v-model="msg">
            <input type="text" v-model="count">
            <button v-on:click="handler">按钮</button>
        </div>
        <script src="./index.js" type="module"></script>
    </body>
</html>
```

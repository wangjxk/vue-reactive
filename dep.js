/**
 * 发布订阅模式
 * 存储所有观察者，watcher
 * 每个watcher都有一个update
 * 通知subs里的每个watcher实例，触发update方法
 */
/**
 * 问题：
 * 1、dep 在哪里实例化，在哪里addsub：observer实例化并给this.$data添加getter和setter时初始化，用于收集依赖关系，存储观察者
 * 2、dep notify在哪里调用：数据变化时，this.$data.setter里调用
 */
export default class Dep {
    constructor(){
        //存储所有观察者
        this.subs = []
    }

    /**
     * 添加观察者
     */
    addSub(watcher){
        if(watcher && watcher.update){
            this.subs.push(watcher)
        }
    }

    /**
     * 发送通知
     */
    notify(){
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}


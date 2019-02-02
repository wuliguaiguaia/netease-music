window.eventHub = {
    // 保存所有接口及事件，key 保存接口，value 保存接口内的函数 为一数组
    events:{},
    //  订阅：通过接口名订阅相关事件
    on(eventName, fn){
        // 初始化
        if(!this.events[eventName]){
            this.events[eventName] = [];
        }
        // 保存事件以待触发
        this.events[eventName].push(fn)
    },
    // 发布：传递参数 data 进行触发
    emit(eventName,data){
        let fns = this.events[eventName];
        // 触发订阅的所有事件
        fns.map((fn)=>{
            fn(data);
        })
    }
}
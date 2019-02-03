window.eventHub = {
    events:[],
    // 订阅
    on(eventName,fn){
        if(!this.events[eventName]){
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
    },
    // 发布
    emit(eventName,data){
        let fns = this.events[eventName];
        fns.map(fn => {
            fn(data)
        })
    },
}
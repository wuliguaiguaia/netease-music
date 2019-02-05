# netease-music
简述：仿移动端网易云音乐，包含后台管理系统。核心在于MVC设计模式及eventHub发布订阅控制页面渲染与交互逻辑，使用learnCloud进行数据存储，七牛云进行文件云上传。

## 技能树： 
html css sass javascript jquery ...

## 应用启动：`
```js
    npm i -g http-server
    http-server -c-1
    node server 8888
    后台 open http://127.0.0.1:8080/src/admin.html 
    前台 open http://127.0.0.1:8080/src/index.html
```

## 图示：
- 管理页
- 主页1
- 主页2
- 主页3
- 播放页

# 核心 

## eventHub 发布订阅设计模式
```js
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
```

## MVC 
把所有模块分为三层：Model数据、View视图和Controller控制器。
- Model 控制页面数据：包括数据逻辑，数据请求，数据存储等，前端model主要包含localStorage 存储和ajax请求，该项目 Model主要是 learnCloud 的增删改查。
- View 负责用户界面，html模板渲染。
- Controller 负责处理view 的事件更新model，同时监听model的变化，更新view 
在这里所有的model 与 view 的双向绑定都是通过 eventHub 控制的。

MVC 基本写法：
```js
let view = {
    el: "",
    template: ``,
    render() {
        $(this.el).html(this.template);
    },
    ...
};
let model = {
    data: {},
    add(){},
    delete(){},
    update(){},
    getAll(){},
};
let controller = {
    init(view, model) {
        this.view = view;
        this.model = model;
        this.view.render();
        this.bindEventHub();
        this.bindEvents();
    },
    bindEventHub() {},
    bindEvents() {},
    ...
};
controller.init(view, model);
```

# 后台管理系统 
- events:
    - uploader : 控制右侧框的替换
    - new ： 已在七牛上传，正在新增编辑，等待保存
    - created : 点击保存
    - select ：左侧选择
    - update : 已在learnCloud 保存，正在更新编辑，等待保存
    - delete : 删除



other：获取文件外链：http://pluavauab.bkt.clouddn.com/ + key
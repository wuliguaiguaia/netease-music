# netease-music

简介：仿移动端网易云音乐，包含后台管理系统

应用启动：`
```
    npm i -g http-server
    http-server -c-1
    node server 8888
    open http://127.0.0.1:8080/src/admin.html 
```

other：获取文件外链：http://pluavauab.bkt.clouddn.com/ + key


## 后台管理系统 
### eventHub 发布订阅设计模式
- events:
    - uploader : 控制右侧框的替换
    - new ： 已在七牛上传，正在新增编辑，等待保存
    - created : 点击保存
    - select ：左侧选择
    - update : 已在learnCloud 保存，正在更新编辑，等待保存
    - delete : 删除
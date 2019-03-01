{
    let view = {
        el: ".form",
        init() {
            this.$el = $(this.el);
        },
        template: `
        <h1 class="title">新建歌曲</h1>
        <form>
            <div class="row">
                <label class="flex">
                    <span>歌单名</span>
                    <input name="listName" type="text" value="__listName__">
                </label>
            </div>
            <div class="row">
                <label>
                    <span>标签</span>
                    <input name="tags" type="text" value="__tags__">
                </label>
            </div>
            <div class="row">
                <label>
                    <span>简介</span>
                    <input name="description" type="text" value="__description__">
                </label>
            </div>
            <div class="row">
                <label>
                    <span>播放数</span>
                    <input name="clickNum" type="text" value="__clickNum__">
                </label>
            </div>
            <div class="row">
                <label class="bg" id="uploaderListbg"> 
                    <span>背景图</span>
                    <div>
                        <button type="button" id="uploaderListbgbtn">选择图片</button>
                        <input name="bg" type="text" value="__bg__">
                    </div>
                </label>
            </div>
            <div class="row jus-end">
                <button type="button" class="addSong">添加歌曲</button>
                <button type="submit">保存</button>
                <button type="reset" class="delete hide">删除</button>
            </div>
        </form>`,
        // 语法：默认传递空对象
        render(data = {}) {
            let html = this.template;
            let placeHolder = ['listName', 'tags', 'description', "bg","clickNum"];
            placeHolder.map(key => {
                html = html.replace(`__${key}__`, data[key] || " ")
            })
            $(this.el).html(html);
        },
        renderBg(bg){
            $(this.el).find("[name=bg]").val(bg)
        }
    };
    let model = {
        data: {
            listName: "",
            tags: "",
            description: "",
            id: "",
            bg: "",
            clickNum:""
        },
        create(listData) {
            let PlayList = AV.Object.extend('PlayList');
            let playList = new PlayList();
            // 保存字段：
            return playList.save({
                tags: listData.tags,
                listName: listData.listName,
                description: listData.description,
                clickNum: listData.clickNum,
                bg: listData.bg,
            }).then(res => {
                let {
                    id,
                    attributes
                } = res;
                Object.assign(this.data, {
                    id,
                    ...attributes
                });
                alert("保存成功！")
            })
        },
        update(listData) {
            console.log("云修改啦");
            // 第一个参数是 className，第二个参数是 objectId
            let playList = AV.Object.createWithoutData('PlayList', this.data.id);
            return playList.save({
                tags: listData.tags,
                listName: listData.listName,
                description: listData.description,
                clickNum: listData.clickNum,
                bg: listData.bg,
            }).then(res => {
                let {
                    id,
                    attributes
                } = res;
                Object.assign(this.data, {
                    id,
                    ...attributes
                });
                alert("修改成功！");
            })
        },
        delete() {
            console.log("云删除啦");
            let playList = AV.Object.createWithoutData('PlayList', this.data.id);
            return playList.destroy().then(res => {
                alert("删除成功！");
                return res.id;
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render();
            this.initQiniu();
            this.bindEvents();
            this.bindEventHub();
        },
        initQiniu() {
            qiniuMusic({
                btn: "uploaderListbgbtn",
                // container: "uploaderbgC",
                UploadProgress: () => {
                    // this.view.statusToggle(2);
                },
                FileUploaded: (sourceLink, key) => {
                    this.model.data.bg = sourceLink;
                    this.view.renderBg(sourceLink);
                }
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let placeHolder = ['listName', 'tags', 'description', "bg","clickNum"];
                let data = {};
                placeHolder.map(key => {
                    data[key] = this.view.$el.find(`[name=${key}]`).val().trim();
                });
                if (this.model.data.id) {
                    this.update(data);
                } else {
                    this.create(data)
                }
            })
            this.view.$el.on('click', 'button.delete', (e) => {
                e.preventDefault();
                if (window.confirm("确认删除")) {
                    this.model.delete().then(id => {
                        window.eventHub.emit('delete', id);
                    })
                }
            })
            this.view.$el.on('click', 'button.addSong', (e) => {
                e.preventDefault();
                if(this.model.data.id){
                    window.location = `/src/admin.html?id=${this.model.data.id}`
                }else{
                    alert("请保存歌单!")
                }
            })
        },
        create(data) {
            this.model.create(data).then(() => {
                window.eventHub.emit("create", JSON.parse(JSON.stringify(this.model.data)));
                this.editStatus();
            });
        },
        update(data) {
            this.model.update(data).then(() => {
                window.eventHub.emit("update", JSON.parse(JSON.stringify(this.model.data)));
            });
        },
        bindEventHub() {
            window.eventHub.on("add", () => {
                Object.assign(this.model.data, {
                    listName: "",
                    tags: "",
                    description: "",
                    clickNum: "",
                    id: "",
                    bg: "",
                });
                this.view.render({});
                this.initQiniu();
                this.newStatus()
            });   
            window.eventHub.on("select", (data) => {
                this.model.data = data;
                this.view.render(this.model.data);
                this.editStatus();
                this.initQiniu();
            });
            window.eventHub.on("update", () => {
                this.editStatus();
            })
            window.eventHub.on("delete", () => {
                Object.assign(this.model.data, {
                    listName: "",
                    tags: "",
                    clickNum: "",
                    description: "",
                    id: "",
                    bg: "",
                });
                this.view.render({});
            })
        },
        newStatus() {
            $(this.view.el).find(".delete").hide();

        },
        editStatus() {
            $(this.view.el).find(".delete").show();

        },
        show() {
            this.view.$el.show();
        },
        hide() {
            this.view.$el.hide();
        },
    }
    controller.init.call(controller, view, model);
}
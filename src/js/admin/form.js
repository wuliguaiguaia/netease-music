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
                    <span>歌名</span>
                    <input name="song" type="text" value="__song__">
                </label>
            </div>
            <div class="row">
                <label>
                    <span>歌手</span>
                    <input name="singer" type="text" value="__singer__">
                </label>
            </div>
            <div class="row">
                <label>
                    <span>外链</span>
                    <input name="link" type="text" value="__link__">
                </label>
            </div>
            <div class="row">
                <label class="bg"> 
                    <span>背景图</span>
                    <div>
                        <button type="button" id="uploaderbgbtn">选择图片</button>
                        <input name="bg" type="text" value="__bg__">
                    </div>
                </label>
            </div>
            <div class="row">
                <label class="lyric"> 
                    <span>歌词</span>
                    <textarea name="lyric">__lyric__</textarea>
                </label>
            </div>
            <div class="row jus-end">
                <button type="submit">保存</button>
                <button type="reset" class="delete hide">删除</button>
            </div>
        </form>`,
        // 语法：默认传递空对象
        render(data = {}) {
            let html = this.template;
            let placeHolder = ['song', 'singer', 'link', "bg","lyric"];
            placeHolder.map(key => {
                html = html.replace(`__${key}__`, data[key] || " ")
            })
            $(this.el).html(html);
        }
    };
    let model = {
        data: {
            song: "",
            singer: "",
            link: "",
            id: "",
            bg: "",
            lyric: "",
        },
        create(songData) {
            let Songs = AV.Object.extend('Songs');
            let song = new Songs();
            // 保存字段：
            return song.save({
                singer: songData.singer,
                song: songData.song,
                link: songData.link,
                bg: songData.bg,
                lyric: songData.lyric,
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
        update(songData) {
            console.log("云修改啦");
            // 第一个参数是 className，第二个参数是 objectId
            let song = AV.Object.createWithoutData('Songs', this.data.id);
            return song.save({
                singer: songData.singer,
                song: songData.song,
                link: songData.link,
                bg: songData.bg,
                lyric: songData.lyric,
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
            let song = AV.Object.createWithoutData('Songs', this.data.id);
            return song.destroy().then(res => {
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
            this.hide();
            this.bindEvents();
            this.bindEventHub();
        },
        initQiniu() {
            qiniuMusic({
                btn: "uploaderbgbtn",
                // container: "uploaderbgC",
                UploadProgress: () => {
                    // this.view.statusToggle(2);
                },
                FileUploaded: (sourceLink, key) => {
                    this.model.data.bg = sourceLink;
                    this.view.render(this.model.data)
                }
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let placeHolder = ['song', 'singer', 'link', "bg","lyric"];
                let data = {};
                placeHolder.map(key => {
                    data[key] = this.view.$el.find(`[name=${key}]`).val();
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
            window.eventHub.on("uploader", () => {
                Object.assign(this.model.data, {
                    song: "",
                    singer: "",
                    link: "",
                    id: "",
                    lyric: "",
                    bg: "",
                });
                this.view.render({});
                this.hide();
            })
            window.eventHub.on('new', (data) => {
                this.show();
                Object.assign(this.model.data, data);
                this.view.render(this.model.data);
                this.initQiniu();
            });
            window.eventHub.on("select", (data) => {
                this.show();
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
                    song: "",
                    singer: "",
                    link: "",
                    lyric: "",
                    id: "",
                    bg: "",
                });
                this.view.render({});
                this.hide();
            })
        },
        newStatus() {
            $(this.view.el).find('.title').text('新增歌曲')
            $(this.view.el).find(".delete").hide();

        },
        editStatus() {
            $(this.view.el).find('.title').text('编辑歌曲');
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
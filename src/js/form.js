{
    let view = {
        el: ".main-content",
        init() {
            this.$el = $(this.el)
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
            <div class="row jus-end">
                <button type="submit">保存</button>
            </div>
        </form>`,
        // 语法：默认传递空对象
        render(data = {}) {
            let html = this.template;
            let placeHolder = ['song', 'singer', 'link'];
            placeHolder.map(key => {
                html = html.replace(`__${key}__`, data[key] || " ")
            })
            $(this.el).html(html);
        },
        reset() {
            this.render({})
        }
    };
    let model = {
        data: {
            song: "",
            singer: "",
            link: "",
            id: "",
        },
        create(songData) {
            let Songs = AV.Object.extend('Songs');
            let song = new Songs();
            // 保存字段：
            return song.save({
                singer: songData.singer,
                song: songData.song,
                link: songData.link,
            }).then(res => {
                let {
                    id,
                    attributes
                } = res;
                Object.assign(this.data, {
                    id,
                    ...attributes
                });
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.init();
            this.view.render();
            this.bindEvents();
            this.bindEventHub();

        },
        refresh(data) {
            this.view.render(data);
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let placeHolder = ['song', 'singer', 'link'];
                let data = {};
                placeHolder.map(key => {
                    data[key] = this.view.$el.find(`input[name=${key}]`).val();
                })
                this.model.create(data).then(() => {
                    this.view.reset();
                    window.eventHub.emit("create", JSON.parse(JSON.stringify(this.model.data)));
                });

            })
        },
        bindEventHub() {
            window.eventHub.on('upload', (data) => {
                this.refresh(data);
                $(this.view.el).find('.title').text('新增歌曲')
            });
            window.eventHub.on('new', () => {
                $(this.view.el).find('.title').text('新增歌曲');
                this.view.reset();
            });
            window.eventHub.on("select", (data) => {
                this.model.data = data;
                this.view.render(this.model.data)
                $(this.view.el).find('.title').text('编辑歌曲')
            })
        }, 
    }
    controller.init.call(controller, view, model);
}
{
    let view = {
        el: ".page1 .songList",
        template: `
        <li>
            <a href="./song.html?id=__id__" class="jusBetween-alignCenter">
                <div class="flex-col left">
                    <h3 class="text-ellipsis song">__song__</h3>
                    <div class="align-center">
                        <span class="icon-sq"></span>
                        <span class="singer text-ellipsis">__singer__</span>
                    </div>
                </div>
                <div>
                    <span class="iconfont icon-bofang"></span>
                </div>
            </a>
        </li>`,
        render(data = {}) {
            data.map(item => {
                let tem = ["song", "singer", "link", 'id'];
                let plate = this.template;
                tem.map(x => {
                    plate = plate.replace(`__${x}__`, item[x])
                })
                $(this.el).append($(plate));
            })
        },
        toggleActive(index) {}
    };
    let model = {
        data: {
            songList: []
        },
        find() {
            let songs = new AV.Query("Songs");
            return songs.find().then(res => {
                this.data.songList = res.map(song => {
                    return Object.assign({
                            id: song.id
                        },
                        song.attributes)
                });
                return this.data.songList;
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.getAll();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEventHub() {},
        bindEvents() {

        },
        getAll() {
            this.model.find().then(list => {
                this.view.render(list)
            })
        }
    };
    controller.init(view, model);
}
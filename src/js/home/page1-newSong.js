{
    let view = {
        el: ".page1 .songList",
        template: `
        <li>
            <h3 class="">__song__</h3>
            <div>
                <span class="icon-sq "></span>
                <span>__singer__</span>
            </div>
        </li>`,
        render(data = {}) {
            data.map(item => {
                let tem = ["song","singer","link"];
                let plate = this.template;
                tem.map(x => {
                    plate= plate.replace(`__${x}__`,item[x])
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
                    return {
                        id: song.id,
                        ...song.attributes
                    }
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
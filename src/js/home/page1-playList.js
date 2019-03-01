{
    let view = {
        el: ".page1 .playList",
        template: `
        <li>
            <a href="./playList.html?id=__id__">
                <div class="item"> 
                <img src="__bg__" width=200 height=200>
                <span class="iconfont icon-erji">__num__亿</span>
                </div>
                <p class="listName text-ellipsis">__listName__</p>
            </a>
        </li>`,
        render(data = {}) {
            data.map(item => {
                let tem = ["bg", "listName","id","num"];
                let plate = this.template;
                if(item.listName){
                    tem.map(x => {
                        plate = plate.replace(`__${x}__`, item[x] || "")
                    })
                    $(this.el).append($(plate));
                }
            })
        },
        toggleActive(index) {}
    };
    let model = {
        data: {
            playList: []
        },
        find() {
            let lists = new AV.Query("PlayList");
            return lists.find().then(res => {
                this.data.playList = res.map(list => {
                    return Object.assign({
                            id: list.id
                        },
                        list.attributes)
                });
                return this.data.playList;
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
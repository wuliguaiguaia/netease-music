{
    let view = {
        el: "#app",
        template: ` 
        <div class="header flex">
            <div><img src="__bg__"><span class="iconfont icon-erji">3.7亿</span>
            </div>
            <div>
                <h1 class="listName">__listName__</h1>
                <div><img src="http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.webp?imageView&thumbnail=60x0&quality=75&tostatic=0&type=webp">网易云音乐</div>
            </div>
        </div>
        <div class="tags flex">
            标签：
            <ul>
                __tags__
            </ul>
        </div>
        <div class="description">
            简介：__description__
        </div>
        <div class="songs">
            <h3 class="title">歌曲列表</h3>
            <ol class="list">
            <ol>
        </div>
        `,
        render(data) {
            let {
                playList,
                songList
            } = data;
            let tem = ["listName", "tags", "description", "bg"];
            tem.map(x => {
                this.template = this.template.replace(`__${x}__`, playList[x]);
            })
            $(this.el).html(this.template)

            songList.forEach((x, i) => {
                let val  = x.attributes;
                let li = $(`
                <li class="flex" data-song-id=${x.id}>
                    <span class="index">${i+1}</span>
                    <div>
                        <h4>${val.song}</h4>
                        <p>${val.singer}</p>
                    </div>
                    <span class="iconfont icon-bofang"><span>
                </li>`);
                $(this.el).find(".songs .list").append(li)
            })
        },
    };
    let model = {
        data: {
            playList: {},
            songList: [],
        },
        getPlayList(id) {
            let playList = new AV.Query('PlayList');
            return playList.get(id).then((res) => {
                Object.assign(this.data.playList, {
                    id: res.id,
                    // ...res.attributes
                    listName: res.attributes.listName,
                    tags: res.attributes.tags,
                    description: res.attributes.description,
                    bg: res.attributes.bg,
                })
            })
        },
        getSongList(id) {
            let songs = new AV.Query('Songs');
            return songs.find().then((res) => {
                res.map(item => {
                    if (item.attributes.playList === id) {
                        this.data.songList.push(item)
                    }
                })
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;

            let id = this.getId();
            this.model.getPlayList(id).then(() => {
                this.model.getSongList(id).then(() => {
                    this.view.render(this.model.data)
                    this.bindEvents();
                    this.bindEventHub();
                })
            })
        },
        getId() {
            let query = location.search;
            let id = "";
            if (query.includes("?")) {
                let str = query.slice(1);
                let arr = str.split("&").filter(v => v); // filter !
                arr.map(item => {
                    let key = item.split("=")[0];
                    let val = item.split("=")[1];
                    if (key === "id") {
                        id = val;
                        return;
                    }
                })
            }
            return id;
        },
        bindEvents() {
            $(this.view.el).on("click",".songs .list li", (e)=>{
                let id = $(e.currentTarget).data("song-id");
                window.location = `/src/song.html?id=${id}`                
            })

        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
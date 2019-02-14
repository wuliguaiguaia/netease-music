{
    let view = {
        el: "#app",
        template: ` 
        <div class="header" >
            <div class="headerbg" style="background-image:url(__bg__)"></div>
            <div class="flex content">
                <div class="left">
                    <img src="__bg__"><span class="iconfont icon-erji">3.7亿</span>
                </div>
                <div class="right">
                    <h1 class="listName">__listName__</h1>
                    <div class="iconwrapper">
                        <img src="http://p1.music.126.net/QWMV-Ru_6149AKe0mCBXKg==/1420569024374784.webp?imageView&thumbnail=60x0&quality=75&tostatic=0&type=webp">
                        <span class="icon"></span>
                        <span class="name">网易云音乐</span>
                    </div>
                </div>
            </div>
        </div>
        <section class="tags flex">
            标签：
            <ul class="flex">
            </ul>
        </section>
        <section class="description">
            <div>
                简介：__description__
            </div>
            <span class="iconfont  icon-54"></span>
        </section>
        <section class="songs">
            <h3 class="maintitle">歌曲列表</h3>
            <ol class="list">
            </ol>
        </section>
        `,
        render(data) {
            let {
                playList,
                songList
            } = data;
            let tem = ["listName", "description", "bg", "bg"];
            tem.map(x => {
                this.template = this.template.replace(`__${x}__`, playList[x]);
            })
            $(this.el).html(this.template)
            // tag
            let tagAr = playList.tags.split("-");
            tagAr.forEach(item => {
                let li = $(`<li class="tag">${item}</li>`);
                $(this.el).find(".tags ul").append(li)
            })
            // song
            songList.forEach((x, i) => {
                let val = x.attributes;
                let li = $(`
                <li class="item">
                    <a href="./song.html?id=${x.id}"  class="jusBetween-alignCenter link">
                        <div class="align-center">
                            <span class="index jusCenter-alignCenter">${i+1}</span>
                            <div class="middle">
                                <h4 class="song text-ellipsis">${val.song}</h4>
                                <p class="singer text-ellipsis">${val.singer}</p>
                            </div>
                        </div>
                        <span class="iconfont icon-bofang"><span>
                    </a>
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
            $(this.view.el).on("click", ".songs .list li", (e) => {
                let id = $(e.currentTarget).data("song-id");
                window.location = `/src/song.html?id=${id}`
            })

        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
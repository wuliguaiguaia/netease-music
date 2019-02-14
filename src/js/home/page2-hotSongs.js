{
    let view = {
        el: ".page2 .list",
        template: ` 
        <li class="jusBetween-alignCenter item" data-song-id=__id__>
            <div class="align-center left">
                <span class="index">__index__</span>
                <div class="flex-col middle">
                    <h4 class="song text-ellipsis">__song__</h4>
                    <p class="singer text-ellipsis">__singer__</p>
                </div>
            </div>
            <span class="iconfont icon-bofang"><span>
        </li>
        `,
        render(data) {
            let tem = ["id", 'index',"song", "singer",];
            data.map((song,index) => {
                let template = this.template;
                tem.map(x => {
                    if(x === 'id'){
                        template = template.replace(`__${x}__`,song.id);
                    }else if(x === "index"){
                        template = template.replace(`__${x}__`,this.pad(2,index+1));
                    }else{
                        template = template.replace(`__${x}__`,song[x]);
                    }
                })
                $(this.el).append($(template))
            })
        },
        pad(n,num){
            return (Array(n).join(0) + num).slice(-n);
        }
    };
    let model = {
        data: {
            songList: []
        },
        getHot() {
            let songs = new AV.Query('Songs');
            return songs.find().then((res) => {
                this.data.songList = res.map(item => {
                    if(item.attributes.hot === "true"){
                        return Object.assign({ id:item.id},item.attributes);
                    }
                })
                this.data.songList = this.data.songList.filter(v=>v);
                return res;
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.getHot().then(() => {
                this.view.render(this.model.data.songList);
                this.bindEventHub();
                this.bindEvents();
            });
        },
        bindEvents() {


        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
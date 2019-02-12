{
    let view = {
        el: ".page2 .list ",
        template: ` 
        <li class="flex" data-song-id=__id__>
            <span class="index">__index__</span>
            <div>
                <h4>__song__</h4>
                <p>__singer__</p>
            </div>
            <span class="iconfont icon-bofang"><span>
        </li>
        `,
        render(data) {
            let tem = ["id", "song", "singer","index"];
            console.log(data);
            
            data.forEach((song,index) => {
                let template = this.template;
                let val = song.attributes;
                tem.forEach(x => {
                    if(x === id){
                        template = template.replace(`__${x}__`,song.id);
                    }else if(x === "index"){
                        template = template.replace(`__${x}__`,index+1);

                    }else{
                        template.replace(`__${x}__`,val[x]);
                    }
                })
                $(this.el).append($(template))
            })
        },
    };
    let model = {
        data: {
            songList: []
        },
        getHot() {
            let songs = new AV.Query('Songs');
            return songs.find().then((res) => {
                res.forEach((item) => {
                    let attr = item.attributes;
                    if(attr.hot.trim() === "true"){
                        this.data.songList.push(item);
                    }
                    
                    console.log(this.data.songList);
                })
                console.log();
                
                return res;
            })
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.getHot().then(() => {
                console.log(1);
                
                console.log(this.model.data.songList);
                
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
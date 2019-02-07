
{
    let view = {
        el: "#app",
        template: `<audio src="__link__"></audio>
        <div class="bg"><img src="__bg__"></div>
        <div class="disc-container flex-col align-center">
            <img class="pointer" src="./static/img/plate3.png" width=110>
            <div class="disc jusCenter-alignCenter ">
                <img class="platebg rotate" src="__bg__" width=342 height=342> 
                <img class="plate1 rotate" src="./static/img/plate1.png" width=342 height=342>
                <img class="plate2 rotate" src="./static/img/plate2.png" width=342 height=342> 
                <img class="play hide" src="./static/img/play.png" width=50 height=50>
            </div>
        </div>
        <div class="song-description text-center">
            <h1>__song__</h1>
            <div class="lyric">
                <div class="lines">

                </div>
            </div>
        </div>
        <div class="links jusAround-alignCenter fixed-bottom">
            <div class="open">打开</div>
            <div class="download">下载</div>
        </div>
        `,
        render(data) {
            let tem = ["song", "singer", "link", 'id', "bg", "bg"];
            let plate = this.template;
            tem.map(x => {
                plate = plate.replace(`__${x}__`, data[x])
            })
            $(this.el).html(plate);
            this.createLyric(data.lyric);
        },
        play() {
            let audio = $(this.el).find("audio")[0];
            audio.play();
            $(this.el).find(".play").hide();
            $(this.el).find(".rotate").removeClass("pause");
        },
        pause() {
            let audio = $(this.el).find("audio")[0];
            audio.pause();
            $(this.el).find(".play").show();
            $(this.el).find(".rotate").addClass("pause");
        },
        createLyric(data) {
            let lyricArr = data.split("\n");
            lyricArr.map(lyric => {
                let matches = lyric.match(/\[([\d:.]+)\](.*)/)
                if(matches){
                    let time = matches[1];
                    let min = time.split(":")[0];
                    let sec = time.split(":")[1];
                    time = parseInt(min) * 60 + parseFloat(sec);
    
                    let p = $(`<p data-time=${time}>${matches[2]}</p>`)
                    $(this.el).find(".lyric .lines").append(p);
                }
            })

        },
        toggleLyric(time){
            let p = $(this.el).find(".lyric .lines p")
            p.map((i,el)=>{
                let cur = $(el).data("time")
                if($(el).next()[0]){
                    let next = $(el).next().data("time");
                    if(time >= cur && time < next){
                        $(el).addClass("active").siblings().removeClass("active")

                        $(this.el).find(".lyric .lines").css({transform:`translateY(-${24*(i-1)}px)`})
                    }
                }
            })
        },
    };
    let model = {
        data: {
            id: "",
            song: "",
            singer: "",
            link: "",
            bg: "",
            lyric: ""
        },
        status: "play",
        get(id) {
            let songs = new AV.Query('Songs');
            return songs.get(id).then((res) => {
                Object.assign(this.data, {
                    id: res.id,
                    ...res.attributes
                })
            }, function (error) {});
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;

            let id = this.getId();
            this.model.get(id).then(() => {
                this.view.render(this.model.data)
                this.view.play();
                this.bindEvents();
                this.bindEventHub();
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
            $(this.view.el).on("click", ".disc", () => {
                if (this.model.status === "pause") {
                    this.view.play();
                    this.model.status = "play";
                } else {
                    this.view.pause();
                    this.model.status = "pause";
                }
            })
            $(this.view.el).find("audio")[0].addEventListener("ended", () => {
                console.log('end');
                this.view.pause();
            })
            $(this.view.el).find("audio")[0].addEventListener("timeupdate", (e) => {
                this.view.toggleLyric(e.currentTarget.currentTime);
            })
        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
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
                    <p data-time="00:00.00"> 作曲 : 朴树</p><p data-time="00:01.00"> 作词 : 朴树（中文）/范玮琪（英文）</p><p data-time="00:06.300">那 些 花 儿</p><p data-time="00:17.300">那片笑声让我想起我的那些花儿</p><p data-time="00:25.180">在我生命每个角落静静为我开着</p><p data-time="00:33.500">我曾以为我会永远守在她身旁</p><p data-time="00:41.610">今天我们已经离去在人海茫茫</p><p data-time="00:49.400">她们都老了吧她们在哪里呀</p><p data-time="00:58.190">我们就这样各自奔天涯</p><p data-time="01:06.520">啦啦啦啦啦啦啦啦啦啦啦 想她</p><p data-time="01:14.770">啦啦啦啦啦啦啦啦</p><p data-time="01:18.870">她还在开吗</p><p data-time="01:23.200">啦啦啦啦啦啦啦啦啦啦啦 去呀</p><p data-time="01:31.400">她们已经被风吹走散落在天涯</p><p data-time="01:39.780"></p><p data-time="01:56.100">有些故事还没讲完那就算了吧</p><p data-time="02:04.310">那些心情在岁月中已经难辨真假</p><p data-time="02:12.570">如今这里荒草丛生没有了鲜花</p><p data-time="02:20.829">好在曾经拥有你们的春秋和冬夏</p><p data-time="02:28.700">她们都老了吧她们在哪里呀</p><p data-time="02:37.190">我们就这样各自奔天涯</p><p data-time="02:45.790">啦啦啦啦啦啦啦啦啦啦啦 想她</p><p data-time="02:54.100">啦啦啦啦啦啦啦啦</p><p data-time="02:58.130">她还在开吗</p><p data-time="03:02.280">啦啦啦啦啦啦啦啦啦啦啦 去呀</p><p data-time="03:10.590">她们已经被风吹走散落在天涯</p><p data-time="03:18.100">oh yiya</p><p data-time="03:18.490">where have all the flowers gone</p><p data-time="03:22.970">where the flowers gone</p><p data-time="03:27.900">where have all the young girls gone</p><p data-time="03:31.150">where have all they gone</p><p data-time="03:35.420">where have all the young men gone</p><p data-time="03:39.360">where have the sodiers gone</p><p data-time="03:43.730">where have all the graveryards gone</p><p data-time="03:47.560">where did they all gone</p><p data-time="03:51.430">她们都老了吧她们在哪里呀</p><p data-time="04:00.150">我们就这样各自奔天涯</p>
                </div>
            </div>
        </div>
        <div class="links jusAround-alignCenter">
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
        },
        play() {
            let audio = $(this.el).find("audio")[0];
            audio.play();
            $(this.el).find(".play").hide();
            $(this.el).find(".rotate").removeClass("pause");
            this.model.status = "play";
        },
        pause() {
            let audio = $(this.el).find("audio")[0];
            audio.pause();
            $(this.el).find(".play").show();
            $(this.el).find(".rotate").addClass("pause");
            this.model.status = "pause";
        },
        rotate() {}
    };
    let model = {
        data: {
            id: "",
            song: "",
            singer: "",
            link: "",
            bg: ""
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
            this.bindEvents();
            this.bindEventHub();

            let id = this.getId();
            this.model.get(id).then(() => {
                this.view.render(this.model.data)
                this.view.play();
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
                } else {
                    this.view.pause();
                }
            })
        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
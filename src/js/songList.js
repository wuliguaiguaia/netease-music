{
    let view = {
        el: ".songList",
        template: `
        <ul>
        </ul>`,
        render(data = {}) {
            $(this.el).html(this.template);
            $(this.el).find('ul').empty();
            data.map(item => {
                let li = $(`<li><span>${item.song}-${item.singer}</span></li>`);
                $(this.el).find('ul').append(li);
            })
        },
        clearActive() {
            $(this.el).find('li.active').removeClass('active')
        }
    };
    let model = {
        data: {
            songList: []
        },
        find() {
            var songs = new AV.Query('Songs');
            songs.find().then(function (res) {
                this.model.songList = res.map(item => {
                    return {
                        id: item.id,
                        ...item.attributes
                    };
                })

                // 成功
            }, function (error) {
                // 异常处理
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.find();

            this.bindEvents();
            window.eventHub.on('upload', () => {
                this.view.clearActive();
            });
            window.eventHub.on("create", (data) => {
                this.model.data.songList.push(data);
                this.view.render(this.model.data.songList);
            })
        },
        bindEvents() {
            $(this.view.el).on("click", 'li', (e) => {
                $(e.currentTarget).addClass("active").siblings().removeClass("active");
                window.eventHub.emit('select')
            })
        },
        getAliiSong(){
            
        }
    }
    controller.init(view, model);
}
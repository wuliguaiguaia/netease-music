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
                let li = $(`<li data-song-id="${item.id}"><span>${item.song}-${item.singer}</span></li>`);
                $(this.el).find('ul').append(li);
            })
        },
        clearActive() {
            $(this.el).find('li.active').removeClass('active')
        },
        classActive(li){
            $(li).addClass("active").siblings('.active').removeClass("active");
        }

    };
    let model = {
        data: {
            songList: []
        },
        find() {
            var songs = new AV.Query('Songs');
            return songs.find().then((res) => {
                this.data.songList = res.map(item => {
                    return {
                        id: item.id,
                        ...item.attributes
                    };
                })
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.find();
            this.getAllSong();
            this.bindEvents();
            this.bindEventHub();
        },
        bindEvents() {
            $(this.view.el).on("click", 'li', (e) => {
                this.view.classActive(e.currentTarget);
                let data={};
                let id = $(e.currentTarget).attr('data-song-id');
                data = this.model.data.songList.find(item => {
                    return item.id === id;
                })
                window.eventHub.emit('select',data)
            })
        },
        bindEventHub() {
            window.eventHub.on('upload', () => {
                this.view.clearActive();
            });
            window.eventHub.on("create", (data) => {
                this.model.data.songList.push(data);
                this.view.render(this.model.data.songList);
            });
            window.eventHub.on("new",()=>{
                this.view.clearActive();
            })
        },
        getAllSong() {
            return this.model.find().then(() => {
                this.view.render(this.model.data.songList);
            })
        }
    }
    controller.init(view, model);
}
{
    let view = {
        el: ".songList",
        template: `
        <ul>
        </ul>`,
        render(data = {}) {
            $(this.el).html(this.template);
            $(this.el).find('ul').html("");
            data.map(item => {
                let li = $(`<li data-song-id="${item.id}"><span>${item.song}-${item.singer}</span></li>`);
                $(this.el).find('ul').append(li);
            })
        },
        clearActive() {
            $(this.el).find('li.active').removeClass('active');
        },
        toggleActive(li){
            $(li).addClass("active").siblings('.active').removeClass("active");
        }
    };
    let model = {
        data: {
            songList: [],
            selectId:""
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
            this.getAllSong();
            this.bindEvents();
            this.bindEventHub();
        },
        bindEvents() {
            $(this.view.el).on("click", 'li', (e) => {
                this.view.toggleActive(e.currentTarget);
                let data = {};
                this.model.data.selectId = $(e.currentTarget).attr('data-song-id');
                data = this.model.data.songList.find(item => {
                    return item.id === this.model.data.selectId;
                })
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)));
            })
        },
        bindEventHub() {
            window.eventHub.on('new', () => {
                this.view.clearActive();
            });
            window.eventHub.on("create", (data) => {
                this.model.data.songList.push(data); 
                this.view.render(this.model.data.songList);
            });
            window.eventHub.on("update", (data) => {
                let index = this.model.data.songList.findIndex(song => {
                    return song.id === data.id;
                })
                this.model.data.songList[index] = data; 
                this.view.render(this.model.data.songList);
                this.view.toggleActive($(this.view.el).find('ul li').eq(index)[0])
            });
        },
        getAllSong() {
            return this.model.find().then(() => {
                this.view.render(this.model.data.songList);
            })
        }
    }
    controller.init(view, model);
}
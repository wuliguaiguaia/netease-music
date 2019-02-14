{
    let view = {
        el: ".songList",
        template: `
        <ul>
        </ul>`,
        render(data = {},index) {
            $(this.el).html(this.template);
            $(this.el).find('ul').html("");
            data.map(item => {
                let li = $(`<li class="align-center" data-list-id="${item.id}"><i class="iconfont icon-liebiao"></i>${item.listName}</li>`);
                $(this.el).find('ul').append(li);
            })
            this.toggleActive($(this.el).find('ul li').eq(index)[0])
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
            playList: [],
            selectId:""
        },
        find() {
            var playList = new AV.Query('PlayList');
            return playList.find().then((res) => {
                this.data.playList = res.map(item => {
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
            this.getAllList();
            this.bindEvents();
            this.bindEventHub();
        },
        bindEvents() {
            $(this.view.el).on("click", 'li', (e) => {
                this.view.toggleActive(e.currentTarget);
                let data = {};
                this.model.data.selectId = $(e.currentTarget).attr('data-list-id');
                data = this.model.data.playList.find(item => {
                    return item.id === this.model.data.selectId;
                })
                console.log(data);
                
                window.eventHub.emit('select',JSON.parse(JSON.stringify(data)));
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (data) => {
                this.model.data.playList.push(data); 
                this.view.render(this.model.data.playList);
                this.view.toggleActive($(this.view.el).find("ul li").last()[0]);
            });
            window.eventHub.on('add', () => {
                this.view.clearActive();
            });
            window.eventHub.on("update", (data) => {
                let index = this.model.data.playList.findIndex(list => {
                    return list.id === data.id;
                })
                this.model.data.playList[index] = data; 
                this.view.render(this.model.data.playList,index);
            });
            window.eventHub.on('delete', id => {
                this.view.clearActive();
                let index = this.model.data.playList.findIndex( list => {
                    return list.id === id; 
                })
                this.model.data.playList.splice(index,1);
                this.view.render(this.model.data.playList);
            });
        },
        getAllList() {
            return this.model.find().then(() => {
                this.view.render(this.model.data.playList);
            })
        }
    }
    controller.init(view, model);
}
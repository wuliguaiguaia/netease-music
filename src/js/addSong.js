{
    let view = {
        el: ".addSong",
        template: `新建歌曲`,
        render() {
            $(this.el).html(this.template);
        },
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.active();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEventHub() {
            window.eventHub.on('upload', (data) => {
                this.active(); 
            });
            window.eventHub.on("select", () => {
                this.deActive(); 
            })
        },
        bindEvents(){
            $(this.view.el).on("click",(e) => {
                this.active();
                window.eventHub.emit("new");
            })
        },
        active() {
            $(view.el).addClass("active")
        },
        deActive() {
            $(view.el).removeClass("active")
        }
    };
    let model = {};
    controller.init.call(controller, view, model)
}
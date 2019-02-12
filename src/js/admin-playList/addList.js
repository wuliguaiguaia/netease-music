{
    let view = {
        el: ".newSong",
        template: `<i class="iconfont  icon-27CIRCLE"></i>
        <div class="">新建歌单</div>`,
        render() {
            $(this.el).html(this.template);
        },
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEventHub() {
        },
        bindEvents(){
            $(this.view.el).on("click",() => {
                window.eventHub.emit("add");
            })
        } 
    };
    let model = {};
    controller.init.call(controller, view, model)
}
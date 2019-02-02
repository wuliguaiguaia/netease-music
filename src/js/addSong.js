{
    let view = {
        el:".addSong",
        template:`新建歌曲`,
        render(){
            $(this.el).html(this.template);
            console.log(1);
            
        },
    };
    let controller =  {
        init(view,model){
            view.render();
            this.active();
            this.bindEvents();
            window.eventHub.on('upload',(data)=>{
                this.active();
            });
            window.eventHub.on("select",()=>{
                this.deActive();
            })
        },
        bindEvents(){
            // $(this.el).on('click')
        },
        active(){
            $(view.el).addClass("active")
        },
        deActive(){
            $(view.el).removeClass("active")
        }
    };
    let model = {};
    controller.init.call(controller,view,model)
}
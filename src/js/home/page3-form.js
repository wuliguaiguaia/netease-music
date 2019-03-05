{
    let view= {
        el:".page3 .form",
        template:` 
        <div class="searchBox align-center">
            <span class="iconfont icon-search"></span>
            <input  class="search" type="text" name="" id="search" placeholder="搜索歌曲">
        </div>`,
        render(){
            $(this.el).html(this.template)
        },
    }
    let model={
        data:{searchSong:""},
    }
    let controller = {
        init(view,model){
            this.view = view;
            this.model = model;
            this.bindEventHub();
            this.bindEvents();
        },
        bindEvents(){
            $(this.view.el).on("keydown", "input", (e) => {
                if (e.key === "Enter") {
                    let tag = e.currentTarget.value.trim();
                    if(tag){
                        this.model.save(tag);
                        this.view.add(tag);
                    }
                }
            })
        },
        bindEventHub(){

        }
    }
    controller.init(view,model)
}
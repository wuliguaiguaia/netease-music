{
    let view = {
        el: ".page3",
        template: ` 
        <div >  
            <input type="text" name="" id="search" placeholder="搜索歌曲，歌手，专辑">
        </div>
        <div  class="hotTag">
            <h3>热门搜索</h3>
            <ol class="flex"></ol>
            </div>
        <div class="myTag">
            <h3>我的搜索</h3>
            <ol class="" class="flex"></ol>
        </div>
        `,
        render(data) {
            let {hotTag,tagList} = data;
            $(this.el).html(this.template);
            hotTag.forEach(item => {
                let li = $(`<li>${item}</li>`);
                $(this.el).find(".hotTag ol").append(li)
            });
            tagList.forEach(item => {
                let li = $(`<li>${item}</li>`);
                $(this.el).find(".myTag ol").append(li)
            });
        },
    };
    let model = {
        data: {
            hotTag:["韩寒新歌","流浪地球","离家最近的路","央视春晚","恭喜发财","吴青峰起风了","ONE OK ROCK新歌","Vara合作新歌"],
            tagList: []
        }, 
        save(tag){
            let tags = this.data.tagList;
            tags.push(tag);
            window.localStorage.setItem("music-tags-his",tags)
        },
        get(){
            this.data.tagList = window.localStorage.getItem("music-tags-his").split(",")
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.get() 
                this.view.render(this.model.data);
                this.bindEventHub();
                this.bindEvents();
        },
        bindEvents() {
            $(this.view.el).on("keydown","input",(e)=>{
               if(e.key === "Enter"){
                   let tag = e.currentTarget.value.trim();
                   this.model.save(tag) 
                   this.view.render(this.model.data)
               }
            })
        },
        bindEventHub() {},
    }
    controller.init(view, model);
}
{
    let view = {
        el: ".page3",
        template: ` 
        <div class="form">
            <div class="searchBox align-center">
                <span class="iconfont icon-search"></span>
                <input  class="search" type="text" name="" id="search" placeholder="搜索歌曲">
            </div>
        </div>
        <div class="content">
            <section  class="hotTag">
                <h3 class="title">热门搜索</h3>
                <ol class="flex-wrap"></ol>
            </section>
            <section class="myTag">
                <ol class="" class="flex"></ol>
            </section>
        </div>
        <div class="jus-center footer">
            <span id="deleteAll">删除所有搜索记录</span>
        </div>
        `,
        tagTemplate: `
        <li class="item flex align-center">
            <span class="iconfont icon-history"></span>
            <div class="tag">__tag__</div>
            <span id="delete" class="iconfont icon-shanchu"></span>
        </li>
        `,
        render(data) {
            let {
                hotTag,
                tagList
            } = data;
            $(this.el).html(this.template);
            hotTag.forEach(item => {
                let li = $(`<li class="tag">${item}</li>`);
                $(this.el).find(".hotTag ol").append(li)
            });
        },
        renderMayTag(data) {
            let {
                hotTag,
                tagList
            } = data;
            tagList.forEach(item => {
                let tem = this.tagTemplate.replace("__tag__", item);
                $(this.el).find(".myTag ol").prepend($(tem))
            });
        },
        add(val) {
            let tem = this.tagTemplate.replace("__tag__", val)
            $(this.el).find(".myTag ol").prepend(tem)
            $("#deleteAll").show();
        },
        delete(index) {
            $(this.el).find(".myTag ol li").eq(index).remove();
        },
        deleteAll() {
            $(this.el).find(".myTag ol").empty();
            $(this.el).find("#search").val("");
        },
        
    };
    let model = {
        data: {
            hotTag: ["韩寒新歌", "流浪地球", "离家最近的路", "央视春晚", "恭喜发财", "吴青峰起风了", "ONE OK ROCK新歌", "Vara合作新歌"],
            tagList: []
        },
        save(tag) {
            let tags = this.data.tagList;
            tags.push(tag);
            window.localStorage.setItem("music-tags-his", tags)
        },
        get() {
            let tags =  window.localStorage.getItem("music-tags-his");
            this.data.tagList = tags ? tags.split(",") : [];
        },
        delete(index) {
            let len = this.data.tagList.length;
            this.data.tagList.splice(len - 1 - index, 1);
            window.localStorage.setItem("music-tags-his", this.data.tagList)
        },
        deleteAll() {
            window.localStorage.removeItem("music-tags-his")
            this.data.tagList = [];
        }
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.model.get()
            this.view.render(this.model.data);
            this.view.renderMayTag(this.model.data);
            this.judge();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEvents() {
            $(this.view.el).on("keydown", "input", (e) => {
                if (e.key === "Enter") {
                    let tag = e.currentTarget.value.trim();
                    if(tag){
                        this.model.save(tag);
                        this.view.add(tag);
                    }
                }
            })
            $(this.view.el).on("click", "#delete", (e) => {
                let index = $(e.currentTarget).parent("li.item").index();
                this.view.delete(index);
                this.model.delete(index);
                this.judge();
            })
            $(this.view.el).on("click", "#deleteAll", (e) => {
                this.view.deleteAll();
                this.model.deleteAll();
                this.judge();
            })
        },
        bindEventHub() {},
        judge(){
            if (this.model.data.tagList.length > 0) {
                $("#deleteAll").show();
            }else{
                $("#deleteAll").hide();
            }
        }
    }
    controller.init(view, model);
}
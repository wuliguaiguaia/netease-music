{
    let view = {
        el: ".siteNav",
        template: `
        <ol class="nav flex-around">
            <li class="active">推荐音乐</li>
            <li>热歌榜</li>
            <li>搜索</li>
        </ol>
        `,
        render() {
            $(this.el).html(this.template);
        },
        toggleActive(index) {
            $(this.el).find("ol.nav>li").eq(index).addClass("active").siblings().removeClass("active");
        }
    };
    let model = {
        data: {}
    };
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.bindEventHub();
            this.bindEvents();
        },
        bindEventHub() {},
        bindEvents() {
            $(this.view.el).on("click", "ol.nav li", (e) => {
                let index = $(e.currentTarget).index();
                this.view.toggleActive(index);
                
                $(".tabContent li.page").eq(index).show().siblings().hide();
            })
        }
    };
    controller.init(view, model);
}
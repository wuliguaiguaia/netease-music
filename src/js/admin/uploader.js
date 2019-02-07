{
    let view = {
        el: ".uploader",
        template: `
        <div class="uploaderArea  jusCenter-alignCenter  ">
            <div id="uploaderContainer" class="flex-col cr" >
                <div class="status1 status">
                    <span>请选择文件或拖拽到此处进行上传</span>
                    <p>文件大小不能超过40MB</p>
                </div>
                <div class="status2 status">
                    文件正在上传中....
                </div>
                <div class="status3 status">
                    文件上传成功,请编辑歌曲信息!
                </div>
            </div>
        </div>
        <button id="uploaderBtn">选择文件</button>
        `,
        render() {
            $(this.el).html(this.template);
        },
        statusToggle(num) {
            $(`.status${num}`).show().siblings(".status").hide();
            if (num == 2) {
                $(loading).css({
                    "display": "flex"
                });
            } else {
                $(loading).hide();
            }
        }
    };
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render();
            this.initQiuniu();
            this.view.statusToggle(1);
            this.eventHub();
        },
        eventHub() {
            window.eventHub.on("uploader", () => {
                this.show();
                this.view.statusToggle(1);
                this.initQiuniu();
            });
            window.eventHub.on("select", () => {
                this.hide();
            });
            window.eventHub.on("new", () => {
                this.hide();
            });
            window.eventHub.on("delete", () => {
                this.show();
                this.view.statusToggle(1);
                this.initQiuniu();
            });
        },
        show() {
            $(this.view.el).show();
        },
        hide() {
            $(this.view.el).hide();
        },
        initQiuniu() {
            qiniuMusic({
                btn: "uploaderBtn",
                container: "uploaderContainer",
                UploadProgress: () => {
                    this.view.statusToggle(2);
                },
                FileUploaded: (sourceLink, key) => {
                    this.view.statusToggle(3);
                    let rule = /(.*) \- (.*)\.mp3/;
                    let matches = key.match(rule);
                    setTimeout(() => {
                        window.eventHub.emit('new', {
                            singer: matches[1],
                            song: matches[2],
                            link: sourceLink,
                        });
                    }, 1000);
                }
            })
        }
    }
    controller.init.call(controller, view, model);
}
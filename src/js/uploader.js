{
    let view = {
        el: ".uploader",
        template: `
        <div class="uploaderArea  jusCenter-alignCenter  ">
         <div id="uploaderContainer" class="flex-col cr">
            <span id="uploaderBtn">点击或拖拽文件</span>
            <p>文件大小不能超过40MB</p>
          </div>
        </div>
        `,
        render() {
            $(this.el).html(this.template);
        }
    };
    let model = {}
    let controller = {
        init(view, model) {
            view.render();
            this.initQiuniu();
        },
        initQiuniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5', //上传模式,依次退化
                browse_button: 'uploaderBtn', //上传选择的点选按钮，**必需**
                uptoken_url: 'http://localhost:8888/uptoken',
                domain: 'http://qiniu-plupload.qiniudn.com/', //bucket 域名，下载资源时用到，**必需**
                get_new_uptoken: false, //设置上传文件的时候是否每次都重新获取新的token
                max_file_size: '40mb', //最大文件体积限制
                dragdrop: true, //开启可拖曳上传
                drop_element: 'uploaderContainer', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        plupload.each(files, function (file) {
                            // 文件添加进队列后,处理相关的事情
                        });
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前,处理相关的事情
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时,处理相关的事情
                    },

                    // 文件上传成功
                    'FileUploaded': function (up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info.response 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info.response);
                        var sourceLink = 'http://pluavauab.bkt.clouddn.com/' + encodeURIComponent(res.key);
                        let {
                            hash,
                            key
                        } = res;
                        window.eventHub.emit('upload', {
                            singer:"xxx",
                            song:key,
                            link:sourceLink,
                        });
                        // window.app.form.refresh({
                        //     hash,
                        //     key
                        // });
                        // window.app.addSong.active();
                    },
                    'Error': function (up, err, errTip) {
                        //上传出错时,处理相关的事情
                    },
                    'UploadComplete': function () {
                        //队列文件处理完毕后,处理相关的事情
                    },
                }
            });

        }
    }
    controller.init.call(controller, view, model);
}
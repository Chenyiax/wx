const app = getApp()

Page({
    data: {
        title: '',
        text: '',
        files: [],
        openid:'',
        urlArr: [], //这用来存放上传多张时的路径数
    },
    onLoad() { 
        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid
            })
        }
        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        })
    },
   
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    getTitle:function(value){
        this.data.title = value.detail.value
    },
    getText:function(value){
        this.data.text = value.detail.value
    },
    uplaodFile(files) {
        console.log('upload files', files)
        this.data.files = files
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tempFilePaths = files.tempFilePaths;
                this.setData({
                    filesUrl: tempFilePaths
                })
                var object = {};
                object['urls'] = tempFilePaths;
                resolve(object);
            }, 1000)
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e.detail)
    },


    onAdd: function () {
        var title = this.data.title
        var text = this.data.text
        var files = this.data.files
        const db = wx.cloud.database()
        db.collection('question').add({
            data: {
              title,
              text,
              files,
            },
            success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            this.setData({
              
            })
            wx.showToast({
              title: '发布成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '发布失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
        wx.navigateTo({
            url: '../main/main'
        })
      },

});
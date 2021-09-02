var app = getApp()
Page({
  data: {
    userInfo: {},
    t: "",
    false: false,
    show:false,
    id:'',
    question: [],
    answer: []
  },
  onLoad : function() {
    let that = this;
    new Promise((resolve) => {
      wx.getStorage({
        key: 'key',
        success: (res) => {
          resolve(res)
        }
      })
    }).then((res) => {
      that.data.id = res.data;
      that.searchdata()
      that.searchanswer()
    })
    wx.getStorage({
      key: 'Info',
      success:(res) => {
        this.setData({
          userInfo: res.data
        })
      }
    }) 
  },
  getText:function(value){
    this.data.t = value.detail.value
  },
  send:function() {
    const db = wx.cloud.database()
    var that = this
    db.collection('questions').add({
      data: {
        number: that.data.id,
        userInfo: that.data.userInfo.nickName,
        text: that.data.t
      },
      success:function(res) {
        wx.showToast({
          title: '发布成功',
        })
      }
    })
  },
  open:function(){
    this.setData({
      show: true
    })
  },
  searchanswer() {
    var that = this
    const db = wx.cloud.database()
    db.collection("questions").where({
      number: that.data.id
    }).get({
      success: function(res) {
        that.setData({
          answer: res.data
        })
      }
    })
  },
  searchdata() {
    var that = this
    const db = wx.cloud.database()
    db.collection('question').where({
      _id: that.data.id
    }).get({
      success: function(res) {
        that.setData({
          question: res.data
        })
        console.log(that.data.question[0].files.tempFilePaths[0])
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  
  
})
var app = getApp()
Page({
  data: {
    openid:'',
    hiddenmodalput: true,

    question: [],

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),

    name: '',
    age: '',
    college: '',
    classes: '',

    test: '',
    list: [{
      "text": "主页",
     "iconPath": "/images/home.png",
      "selectedIconPath": "/images/home1.png",
    },
    {
      "text": "广场",
      "iconPath": "/images/square.png",
      "selectedIconPath": "/images/square1.png",
    },
    {
      "text": "我的",
      "iconPath": "/images/my.png",
      "selectedIconPath": "/images/my1.png",
    }]
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  tabChange:function(e) {
    this.setData({
      test: e.detail.index
    })
    if(this.data.test == 2) {
      this.searchdatabase()
    }
    if(this.data.test == 1) {
      this.searchQuestion()
    }
  },
  upload() {
    wx.navigateTo({
      url: '../upload/upload'
    })
  },

  modalinput: function () {
    this.setData({ 
      hiddenmodalput: !this.data.hiddenmodalput 
    })   
  },  

  cancel: function () {
    this.setData({
      hiddenmodalput: true  
    })
  },

  confirm: function() {
    this.checkdatabase()
    this.setData({
      hiddenmodalput: true  
    })
  },

  checkdatabase() {
    var that = this
    console.log("检查数据")
    const db = wx.cloud.database()
    db.collection('users').where({
      _openid: this.data.openid,
    }).get({
      success: function(res) {
        console.log(res.data)
        if(res.data[0]._openid == '') {
          console.log("1")
          that.adddatabase()
        } else {
          console.log("2")
          that.updatedatabase()
        }
      },
      fail: function(err) {
        
      }
    })
  },

  searchdatabase() {
    var that = this
    console.log("初始化数据")
    const db =wx.cloud.database()
    db.collection('users').where({
      _openid: this.data.openid
    }).get({
      success: function(res) {
        that.setData({
          name: res.data[0].name,
          age: res.data[0].age,
          college: res.data[0].college,
          classes: res.data[0].classes
        })
      }
    })
  },

  updatedatabase() {
    console.log("更新数据")
    var that = this
    const db = wx.cloud.database()
    db.collection('users').where({
      _openid: that.data.openid
    }).update({
      data: {
        name: that.data.name,
        age: that.data.age,
        college: that.data.college,
        classes: that.data.classes
      },
      success: function(res) {
        wx.showToast({
          title: '修改成功',
        })
      }
    })
  },

  adddatabase() {
    console.log("添加数据")
    var name = this.data.name
    var age = this.data.age
    var college = this.data.college
    var classes = this.data.classes
    const db = wx.cloud.database()
    db.collection('users').add({
      data: {
        name,
        age,
        college,
        classes
      },
      success: function(res) {
        // 在返回结果中会包含新创建的记录的 _id
        wx.showToast({
          title: '修改成功',
        })
      },
      fail: function(err) {
        wx.showToast({
          icon: 'none',
          title: '修改失败'
        })
      }
    })
  },

  getName: function(value) {
    this.data.name = value.detail.value
  },
  getAge: function(value) {
    this.data.age = value.detail.value
  },
  getCollege: function(value) {
    this.data.college = value.detail.value
  },
  getClasses: function(value) {
    this.data.classes = value.detail.value
  },
  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name:'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  searchQuestion() {
    console.log("加载图片")
    var that = this
    const db = wx.cloud.database()
    db.collection('question').where({
      _openid: this.data.openid
    }).get({
      success: function(res) {
        that.setData({
          question: res.data
        })
      }
    })
  },
  
  toquestion:function(e) {
    wx.setStorage({
      data: e.currentTarget.dataset.name._id,
      key: 'key',
    })
    wx.navigateTo({
      url: '../question/question',
    })
  },

  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      this.onGetOpenid()
    }
  },
});
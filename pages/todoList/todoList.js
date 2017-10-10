// pages/todoList/todoList.js
var app = getApp(); // 应用实例
var all = {};       // 显示的所有条目

Page({

  /**
   * 页面的初始数据
   */
  data: {
		addItemContent : '',
    userInfo: {},
    left: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		console.log("todoList onLoad");
    this.setData({

    });
    var that = this;

    // 调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      // 更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
		console.log("todoList onShow");
    
    // 默认显示的条目
    var defaultData = {
      time: 0, // 上一次更新的时间
      list: [
        { id: 1, content: '点击底部【+】添加新的事项' },
        { id: 2, content: '点击事项进入专注模式' },
        { id: 3, content: '左滑移除/置顶/完成' },
        { id: 4, content: '我是已完成的事项', finish: 'fn' },
      ],
    };

    // 缓存的条目数据
    var data = wx.getStorageSync('list') || defaultData;

    // 是否需要添加条目Item
    if (this.data.addItemContent.length != 0) {
      console.log("添加Item");
      var newItem = new Object();
      newItem.id = data.index;
      newItem.content = this.data.addItemContent;
      data.list.unshift(newItem);
    }

    // 读取缓存中的条目，如果不存在，就使用默认的
    all = data;
    
    // 更新显示
    showList(this);

    // 更新缓存的数据
    try {
      all.time = parseInt((new Date()).valueOf() / 1000);
      wx.setStorageSync('list', all);
    } catch (e) {
      alert('保存失败!');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  /*
  onPullDownRefresh: function () {
		console.log("todoList onPullDownRefresh");
		// 下拉页面 跳转到 添加条目页面
		wx.navigateTo({
			url: '../addItem/addItem',
		});
  },
  */

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
		//console.log("todoList onReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

	// ScrollView滚动到顶部的回调
	/*
	scrollToUpper: function(){
		console.log("scrollToUpper");
	},

	// ScrollView滚动到底部的回调
	scrollToLower: function(){
		console.log("scrollToLower");
	},
	*/

  addItem: function() {
    console.log("todoList 跳转到 addItem");
    wx.navigateTo({
      url: '../addItem/addItem',
    });
  }

})

// 刷新显示列表
function showList(instance) {
  var arr = all.list;
  // 暂时不做任何筛选
  instance.setData({
    list: arr,
    left: 0
  })
}

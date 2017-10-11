// pages/focusMode/focusMode.js
var listHelper = require("../../utils/listHelper.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:"", // 当前事项的内容
    minute:"",  // 控制时间进度条的样式、动画速度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var itemId = options.id;
    var list = wx.getStorageSync('list') || [];
    if(list == [] || list.length == 0)
    {
      wx.showToast({
        title: '事项不存在！',
        icon: 'loading'
      })
      wx.navigateBack();
    };

    var item = listHelper.getItemById(list.list, itemId);
    if (typeof (item) == "undefined")
    {
      wx.showToast({
        title: '事项不存在！',
        icon: 'loading'
      })
      wx.navigateBack();
    };

    // 显示当前事项的内容
    var str = item.content;
    this.setData({
      content: str,
    });

    // 时间进度条先不执行
    this.setData({
      minute: "",
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
    console.log("focusMode onShow");

    // 专注模式下，保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("focusMode onHide");
    
    // 小程序进入后台，取消屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("focusMode onUnload");

    // 离开专注模式，取消屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
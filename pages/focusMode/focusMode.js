// pages/focusMode/focusMode.js
var listHelper = require("../../utils/listHelper.js");
var timeHelper = require("../../utils/timeHelper.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : "",   // 当前事项的内容
    timeStyle : "", // 控制时间进度条的样式、动画速度
    timeStr : "",   // 剩余时间
    tipsViewShow: "",  // 是否显示提示文字
    startBtnShow : "",  // 是否显示【开始】按钮
    pauseBtnShow: "",   // 是否显示【暂停】按钮
    continueBtnShow: "",// 是否显示【继续】按钮
    exitBtnShow: "",    // 是否显示【结束】按钮
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
    
    this.setData({
      timeStyle: "", // 时间进度条先不执行
      timeStr : "00:00",
      tipsViewShow : "Hide",
      timeViewShow : "Show",
      startBtnShow : "Hide",
      pauseBtnShow : "Hide",
      continueBtnShow : "Hide",
      exitBtnShow: "Hide",
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
  
  },

  // 选择5分钟
  click5minutes: function () {
    console.log("focusMode：选择5分钟");
    selectMinutes(this, 5);
  },

  // 选择25分钟
  click25minutes: function () {
    console.log("focusMode：选择25分钟");
    selectMinutes(this, 25);
  },

  // 选择50分钟
  click50minutes: function () {
    console.log("focusMode：选择50分钟");
    selectMinutes(this, 50);
  },

  // 开始按钮
  startBtn: function () {
    console.log("focusMode：开始按钮");
    // 隐藏开始按钮和时间选择，显示提示文字和暂停按钮
    this.setData({
      startBtnShow: "Hide",
      timeViewShow: "Hide",
      tipsViewShow: "Show",
      pauseBtnShow: "Show",
    });

    // todo 开始计时
  },

  // 暂停按钮
  pauseBtn: function () {
    console.log("focusMode：暂停按钮");
    // 隐藏暂停按钮，显示继续和结束按钮
    this.setData({
      pauseBtnShow: "Hide",
      continueBtnShow: "Show",
      exitBtnShow: "Show",
    });

    // todo 暂停计时
  },

  // 继续按钮
  continueBtn: function () {
    console.log("focusMode：继续按钮");
    // 显示暂停按钮，隐藏继续和结束按钮
    this.setData({
      pauseBtnShow: "Show",
      continueBtnShow: "Hide",
      exitBtnShow: "Hide",
    });

    // todo 继续计时
  },

  // 结束按钮
  exitBtn: function () {
    console.log("focusMode：结束按钮");
  },

});

// 选择时间
function selectMinutes(currPage, e) {
  var second = e * 60; // 分 --> 秒
  var minuteSecond = timeHelper.second2minutesecond(second);

  // 显示开始按钮，更新剩余时间
  currPage.setData({
    startBtnShow: "Show",
    timeStr: minuteSecond,
  });
};
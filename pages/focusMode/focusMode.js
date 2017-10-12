// pages/focusMode/focusMode.js
var listHelper = require("../../utils/listHelper.js");
var timeHelper = require("../../utils/timeHelper.js");
var currPage; 
var itemId; // 当前的事项Id
var timer;  // 计时器
var tipsInterval = 15; // 默认每15s切换一次鼓励标语
var tipsDelTime = 0;
var tips = require("../../data/tips.js"); // 包含所有元素
var tipId; // 当前显示的鼓励标语的角标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content : "",   // 当前事项的内容
    timeStyle : "", // 控制时间进度条的样式、动画速度
    timeStr : "",   // 剩余时间
    tipsViewShow: "",     // 是否显示鼓励标语
    tipsContent: "",      // 鼓励标语的内容
    startBtnShow : "",    // 是否显示【开始】按钮
    pauseBtnShow: "",     // 是否显示【暂停】按钮
    continueBtnShow : "", // 是否显示【继续】按钮
    exitBtnShow : "",     // 是否显示【结束】按钮
    isClocking : false,   // 是否正在倒计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    itemId = options.id;
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

    // 随机第一条鼓励标语的角标
    var str = GetRandomTipContent();

    // 初始化其他数据层
    currPage = this;
    this.setData({
      timeStyle: "",      // 时间进度条先不执行
      timeStr : "00:00",  // 剩余时间
      tipsViewShow: "Hide",     // 不显示鼓励标语
      timeViewShow : "Show",    // 选择时间
      timeTipViewShow : "Show", // 提示选择时间
      startBtnShow : "Hide",
      pauseBtnShow : "Hide",
      continueBtnShow : "Hide",
      exitBtnShow : "Hide",
      tipsContent: str,
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
      // 隐藏开始按钮和时间选择，显示鼓励标语和暂停按钮
      this.setData({
        startBtnShow: "Hide",
        timeViewShow: "Hide",
        tipsViewShow: "Show",
        pauseBtnShow: "Show",
      });

      // 开始计时
      Countdown();
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

    // 暂停计时
    clearTimeout(timer);
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

    // 继续计时
    Countdown();
  },

  // 结束按钮
  exitBtn: function () {
    console.log("focusMode：结束按钮");
    clearTimeout(timer);  

    // 弹窗
    wx.showModal({
      content: '事项完成了吗？',
      cancelText: "要放弃",
      confirmText: "已完成",
      success: function (res) {
        if (res.confirm) {
          console.log('focusMode：已完成');
          wx.navigateBack();

          // 往上一级页面（主界面）传参
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; // 当前页面
          var prevPage = pages[pages.length - 2]; // 上一级页面
 
          // 直接调用上一级页面Page对象，存储数据到上一级页面中
          prevPage.setData({
            'finishItemId': itemId,
          });

        } else if (res.cancel) {
          console.log('focusMode：要放弃');
          // 直接回到主界面
          wx.navigateBack();
        }
      }
    })
  },

});

// 选择时间
function selectMinutes(currPage, e) {
  var seconds = e * 60; // 分 --> 秒
  var minuteSecond = timeHelper.second2MinuteSecond(seconds);

  // 显示开始按钮，更新剩余时间，隐藏提示选择时间
  currPage.setData({
    startBtnShow: "Show",
    timeStr: minuteSecond,
    timeTipViewShow: "Hide",
  });
};

// 倒计时
function Countdown() {
  timer = setTimeout(function () {
    // 当前剩余时间
    var minuteStr = currPage.data.timeStr.split(':')[0];
    var secondStr = currPage.data.timeStr.split(':')[1];
    // 时间字符 --> 秒数
    var seconds = Number(minuteStr) * 60 + Number(secondStr);
    if (seconds > 0) 
    {
      // 更新剩余时间
      seconds--;
      var minuteSecond = timeHelper.second2MinuteSecond(seconds);
      currPage.setData({
        timeStr: minuteSecond,
      });

      // 更新鼓励标语
      tipsDelTime++;
      if (tipsDelTime >= tipsInterval)
      {
        tipsDelTime = 0;
        var str = GetRandomTipContent();
        
        currPage.setData({
          timeStr: minuteSecond,
          tipsContent: str,
        });
      };     

      // 每秒递归调用
      Countdown();
    }
    else // todo 剩余时间已经结束
    { 

    }

  }, 1000);
};

// min <= 随机数 <= max，要求得到的与上一次的数字不相同
function GetRandomTipContent(){
  var list = tips;
  list = listHelper.delItemById(list, tipId);
  
  var range = list.length;
  var random = Math.random();
  var index = Math.floor(random * range); // 舍去
  var currItem = list[index]; // 本次抽中的鼓励标语Item
  var str = currItem.content;
  tipId = currItem.id;
  console.log("鼓励标语 id = " + tipId);

  return str;
};
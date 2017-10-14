// pages/todoList/todoList.js
var app = getApp(); // 应用实例
var listHelper = require("../../utils/listHelper.js");
var defaultItem = require("../../data/defaultItem.js");
var all = {}; 	// 显示的所有条目
var currItemId; // 当前点击的条目的ID
var currMaskStatu; // 当前操作菜单遮罩层的状态

Page({

  /**
   * 页面的初始数据
   */
  data: {
		addItemContent : '', // 本次添加的事项的内容
    finishItemId : -1, // 本次完成的事项的Id
    userInfo: {},
    list: {},
    left: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("todoList：onLoad");
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
    console.log("todoList：onShow");
    
		// ----test：清空本地数据
		//wx.clearStorageSync();

    // 默认显示的条目
    var defaultData = {
      time: 0, // 上一次更新的时间
      list: defaultItem,
    };

    // 缓存的条目数据
    var data = wx.getStorageSync('list') || defaultData;
    if (data.list == null){
      data = defaultData;
    }

    // 是否需要添加条目Item
    if (this.data.addItemContent.length != 0) {
      console.log("todoList：添加事项");
      var newItem = new Object();
      newItem.id = data.list.length + 1;
      newItem.content = this.data.addItemContent;
      data.list.unshift(newItem);
      // 清除数据
      this.setData({
        addItemContent : "",
      });
    }

    // 是否需要完成条目
    if (this.data.finishItemId != null && this.data.finishItemId > -1)
    {
      console.log("todoList：完成事项");
      var temp = listHelper.finishItemById(all.list, this.data.finishItemId);
      data.list = temp;
      // 清除数据
      this.setData({
        finishItemId : -1,
      });
    }

    // 读取缓存中的条目，如果不存在，就使用默认的
    all = data;
    // 更新显示
    showList(this);
    // 更新缓存的数据
    updateStorageData();
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

  // 跳转到添加事项
  addItem: function() {
    console.log("todoList：跳转到 addItem");
    wx.navigateTo({
      url: '../addItem/addItem',
    });
  },

  // 删除事项
  delItem: function(e) {
    var temp = listHelper.delItemById(all.list, e.currentTarget.dataset.id);
    all.list = temp;
    // 更新缓存数据
    updateStorageData();
    // 更新界面
    showList(this);
  },

  // 置顶事项
  topItem: function(e) {
    var temp = listHelper.topItemById(all.list, e.currentTarget.dataset.id);
    all.list = temp;
    // 更新缓存数据
    updateStorageData();
    // 更新界面
    showList(this);
  },
  
  // 完成事项
  finishItem: function (e) {
    var temp = listHelper.finishItemById(all.list, e.currentTarget.dataset.id);
    all.list = temp;
    // 更新缓存数据
    updateStorageData();
    // 更新界面
    showList(this);
  },

	// 事项上移
	moveUp: function (e) {
		all.list = listHelper.moveUpItemById(all.list, currItemId);
		// 关闭操作菜单
		this.closePopupMenu();
		// 更新缓存数据
		updateStorageData();
		// 更新界面
		showList(this);
	},

	// 事项下移
	moveDown: function (e) {
		all.list = listHelper.moveDownItemById(all.list, currItemId);
		// 关闭操作菜单
		this.closePopupMenu();
		// 更新缓存数据
		updateStorageData();
		// 更新界面
		showList(this);
	},

  // 进入专注模式
  focusMode: function (e){
    // 已完成的事项不能进入专注模式！
    var item = listHelper.getItemById(all.list, currItemId);
    if (item.finish != null && item.finish == "fn"){
      console.log("todoList：已完成的事项不能进入专注模式，条目Id = " + e.currentTarget.dataset.id);
      return;
    }
    
		// 页面跳转
    console.log("todoList：跳转到 focusMode，条目Id = " + currItemId);
    wx.navigateTo({
			url: '../focusMode/focusMode?id=' + currItemId,
    });

		// 关闭操作菜单
		this.closePopupMenu();
  },

  // 点击Item，弹出操作菜单
	popupMenu: function (e) {
		currMaskStatu = e.currentTarget.dataset.statu;
		currItemId = e.currentTarget.dataset.id;
		//console.log("todoList：点击条目，Id = " + currItemId); // 取消遮罩时，为undefined

		/* 动画部分 */
		// 第1步：创建动画实例 
		var animation = wx.createAnimation({
			duration: 100, // 动画时长 
			timingFunction: "linear", // 线性 
			delay: 0 // 0则不延迟 
		});

		// 第2步：这个动画实例赋给当前的动画实例 
		this.animation = animation;

		// 第3步：执行第一组动画 
		animation.opacity(0).rotateX(-100).step();

		// 第4步：导出动画对象赋给数据对象储存 
		this.setData({
			animationData: animation.export()
		})

		// 第5步：设置定时器到指定时候后，执行第二组动画 
		setTimeout(function () {
			// 执行第二组动画 
			animation.opacity(1).rotateX(0).step();
			// 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
			this.setData({
				animationData: animation
			})

			//关闭 
			if (currMaskStatu == "close") {
				this.setData(
					{
						showModalStatus: false
					}
				);
			}
		}.bind(this), 100)

		// 显示 
		if (currMaskStatu == "open") {
			this.setData(
				{
					showModalStatus: true
				}
			);
		}
	},

	// 执行操作后，关闭操作菜单
	closePopupMenu: function()
	{
		if (currMaskStatu == "open") {
			this.setData(
				{
					showModalStatus: false
				}
			);
		}
	},

});

// 刷新显示列表
function showList(currPage) {
  console.log("todoList：刷新事项列表");
  var arr = all.list;
  // 暂时不做任何筛选
  currPage.setData({
    list: arr,
    left: 0 // 条目的水平偏移恢复到最左边
  })
};

// 更新缓存中的数据
function updateStorageData(){
  console.log("todoList：更新缓存中的数据");
  try {
    all.time = parseInt((new Date()).valueOf() / 1000);
    wx.setStorageSync('list', all);
  } catch (e) {
    alert('缓存数据更新失败!');
  }
};

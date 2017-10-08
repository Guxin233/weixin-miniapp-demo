// pages/addItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
		content : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

	// 输入框失去焦点的回调，添加条目
	addItem: function (event){
		console.log("添加条目！");
		wx.navigateBack();

		// 往上一级页面传参
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1]; // 当前页面
		var prevPage = pages[pages.length - 2]; // 上一级页面

		// 直接调用上一级页面Page对象，存储数据到上一级页面中
		var str = event.detail.value;
		prevPage.setData({
			'addItemContent': str,
		});

	}
})
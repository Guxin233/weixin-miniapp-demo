/*
 * list列表帮助类
 */

// 获得指定arr列表中指定Id的条目
function getItemById(arr, id)
{
  var item;
  for (var i = 0; i < arr.length; i++) {
    if (id == arr[i].id) {
      item = arr[i];
    }
  }
  return item; 
}

// 根据Id，删除条目
function delItemById(arr, id){
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    if (id != arr[i].id) {
      temp.push(arr[i]);
    }
  }
  return temp;
};

// 根据Id，置顶条目
function topItemById(arr, id){
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    if (id == arr[i].id) {
      temp.push(arr[i]);
    }
  }
  for (var i = 0; i < arr.length; i++) {
    if (id != arr[i].id) {
      temp.push(arr[i]);
    }
  }
  return temp;
};

// 根据Id，修改条目状态为待办或完成
function finishItemById(arr, id){
  var temp = [];     // 存放除了目标Item外所有其他Item
  var tempdata = []; // 只存放目标Item
  var count = 0;     // 待完成的条目数

  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (id != item.id) {
      temp.push(item);
    } else {
      tempdata = item;
    }

    // 统计未完成的条目数
    if (item.finish != null && item.finish == 'fn')
    {
      count++;
    }
  }

  if (tempdata.finish == 'fn') {
    tempdata.finish = null;
    temp.unshift(tempdata);
  } else {
    tempdata.finish = 'fn';
    //temp.push(tempdata); // 加到未完成列表的末尾，而不是整个列表的末尾
    temp.splice(count, 0, tempdata);
  }

  return temp;
};

module.exports = {
  getItemById: getItemById,
  delItemById: delItemById,
  topItemById: topItemById,
  finishItemById: finishItemById,
}

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
  var temp = [];
  var tempdata = [];
  for (var i = 0; i < arr.length; i++) {
    if (id != arr[i].id) {
      temp.push(arr[i]);
    } else {
      tempdata = arr[i];
    }
  }
  if (tempdata.finish == 'fn') {
    tempdata.finish = null;
    temp.unshift(tempdata);
  } else {
    tempdata.finish = 'fn';
    temp.push(tempdata);
  }

  return temp;
};

module.exports = {
  getItemById: getItemById,
  delItemById: delItemById,
  topItemById: topItemById,
  finishItemById: finishItemById,
}

/*
 * list列表帮助类
 */

// 根据Id删除条目
function delItemById(arr, id){
  var temp = [];
  for (var i = 0; i < arr.length; i++) {
    if (id != arr[i].id) {
      temp.push(arr[i]);
    }
  }
  return temp;
};

// 根据Id置顶条目
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

// 根据Id修改条目为已完成状态
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
  delItemById: delItemById,
  topItemById: topItemById,
  finishItemById: finishItemById,
}
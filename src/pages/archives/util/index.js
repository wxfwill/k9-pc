//获取单个详情列表
export const getSingle = (arr, name) => {
  let newArr = [];
  if (arr && arr.length > 0) {
    arr.map((item, index) => {
      item.bookName = name;
      if (index == 0) {
        item.$indexes = true;
      }
      newArr.push(item);
    });
  } else {
    newArr = [
      {
        bookName: name,
        noData: true,
        $indexes: true,
      },
    ];
  }
  return newArr;
};

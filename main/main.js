'use strict';

function findItemById(id) {
  let goodsDB = loadAllItems();
  let item;
  return goodsDB.filter((value, index, array) => {
    return id === value['barcode']
  })[0];
}

function isInPrivilege(id, promotion) {
  let promotions = loadPromotions();
  let itemsPromo;
  let isIn = false;
  promotions.forEach( (value) => {
    if(value['type'] == promotion) {
      itemsPromo = value['barcodes'];
    }
  });
  // console.log(itemsPromo);
  for(let p of itemsPromo) {
    if(p == id) {
      isIn = true
    }
  }
  return isIn;
}

/*
 * @param {*} barCodeList [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2.5',
    'ITEM000005',
    'ITEM000005-2',
]
 */
function generateItems(barCodeList) {
  let item = {};
  barCodeList.forEach((value, index) => {
    if (value.indexOf('-') == -1) {
      if (item[value] == undefined) {
        item[value] = 1;
      } else {
        item[value]++;
      }
    } else {
      let _val = value.split('-')[0];
      let _count = Number(value.split('-')[1]);
      if (item[_val] == undefined) {
        item[_val] = _count;
      } else {
        item[_val] += _count;
      }
    }
  })
  return item;
}

/**
 * @param {*} items {ITEM000001: 5, ITEM000003: 2.5, ITEM000005: 3}
 */
function getReceiptContent(items) {
  let expextedMoney = 0;
  let actualMoney = 0;
  let receiptContent = '***<没钱赚商店>收据***\n';
  for (let id in items) {
    let item = findItemById(id);
    if(item != undefined) {
      let littleCount;
      let _items_id = Number(items[id]);
      if(isInPrivilege(id, 'BUY_TWO_GET_ONE_FREE')){
        littleCount = (_items_id - Math.floor(_items_id/3)) * item['price']
      }else {
        littleCount = item['price']*_items_id;
      }

      receiptContent += `名称：${item['name']}，数量：${_items_id}${item['unit']}，单价：${item['price'].toFixed(2)}(元)，小计：${littleCount.toFixed(2)}(元)\n`
      expextedMoney += item['price']*_items_id;
      actualMoney += littleCount;
    }
  }
  receiptContent += `----------------------
总计：${actualMoney.toFixed(2)}(元)
节省：${(expextedMoney - actualMoney).toFixed(2)}(元)
**********************`
  return receiptContent;
}

function printReceipt(barCodeList) {
  let items = generateItems(barCodeList);
  let result = getReceiptContent(items);
  console.log(result)
}

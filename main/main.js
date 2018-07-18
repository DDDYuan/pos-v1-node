module.exports = function printInventory(inputs) {
    var result =
        '***<没钱赚商店>购物清单***\n' +
        '名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n' +
        '名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)\n' +
        '名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n' +
        '----------------------\n' +
        '挥泪赠送商品：\n' +
        '名称：雪碧，数量：1瓶\n' +
        '名称：方便面，数量：1袋\n' +
        '----------------------\n' +
        '总计：51.00(元)\n' +
        '节省：7.50(元)\n' +
        '**********************';
    console.log(result);
};

function getTotal(inputs) {
    const result = [];
    const items = require('./datbase').loadAllItems();
    inputs.forEach(
        item => {
            const barcode = item.split("-")[0];
            const count = item.split("-").length > 1 ? parseInt(item.split("-")[1]) : 1;
            const receiptItem = result.filter(itemInResult => itemInResult.item.barcode === barcode).pop();
            if (receiptItem) {
                receiptItem.count += count;
            } else {
                result.push({
                    item: items.filter(itemInList => itemInList.barcode === barcode).pop(),
                    count: count
                });
            }
        }
    );
    return result;
}

function getPromotions(total) {
    const result = [];
    const promotions = require('./datbase').loadPromotions();
    total.forEach(
        item => {
            if (promotions[0].barcodes.includes(item.item.barcode)) {
                result.push({
                    item: item.item,
                    count: 1
                });
            }
        }
    );
    return result;
}
module.exports = function printInventory(inputs) {
    const total = getTotal(inputs);
    const promotion = getPromotions(total);
    const receipt = generateReceipt(total, promotion);
    console.log(receipt);
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

function generateReceipt(total, promotions) {
    let amount = 0;
    let promotionAmout = 0;
    let result = '***<没钱赚商店>购物清单***\n';
    total.forEach(
        item => {
            const subtotal = item.item.price * item.count;
            amount += subtotal;
            result += `名称：${item.item.name}，数量：${item.count}${item.item.unit}，单价：${item.item.price.toFixed(2)}(元)，小计：${subtotal.toFixed(2)}(元)`;
            result += '\n';
        }
    );
    result += '----------------------\n挥泪赠送商品：\n';
    promotions.forEach(
        item => {
            const subtotal = item.item.price * item.count;;
            promotionAmout += subtotal;
            result += `名称：${item.item.name}，数量：${item.count}${item.item.unit}`;
            result += '\n';
        }
    );
    result += '----------------------\n' +
        `总计：${amount.toFixed(2)}(元)` + '\n' +
        `节省：${promotionAmout.toFixed(2)}(元)` + '\n' +
        '**********************';

    return result;
}
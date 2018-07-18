module.exports = function printInventory(inputs) {
    const total = getTotal(inputs);
    const totalWithPromotion = getPromotions(total);
    const receipt = generateReceipt(totalWithPromotion);
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
    const promotions = require('./datbase').loadPromotions();
    total.forEach(
        item => {
            if (promotions[0].barcodes.includes(item.item.barcode)) {
                item.promotionCount = 1;
            }
        }
    );
    return total;
}

function generateReceipt(totalWithPromotion) {
    let amount = 0;
    let promotionAmout = 0;
    const head = '***<没钱赚商店>购物清单***\n';
    const end = '**********************';
    const sep = '----------------------\n';
    const promoHead = '挥泪赠送商品：\n';
    let receiptTotal = '';
    let receiptPromo = '';

    totalWithPromotion.forEach(
        item => {
            let subtotal;
            if (item.promotionCount) {
                subtotal = item.item.price * (item.count - item.promotionCount);
                const promotionTotal = item.item.price * item.promotionCount;
                promotionAmout += promotionTotal;
                receiptPromo += `名称：${item.item.name}，数量：${item.promotionCount}${item.item.unit}` + '\n';
            } else {
                subtotal = item.item.price * item.count;
            }
            amount += subtotal;
            receiptTotal += `名称：${item.item.name}，数量：${item.count}${item.item.unit}，单价：${item.item.price.toFixed(2)}(元)，小计：${subtotal.toFixed(2)}(元)`;
            receiptTotal += '\n';
        }
    );
    const info = `总计：${amount.toFixed(2)}(元)` + '\n' +
        `节省：${promotionAmout.toFixed(2)}(元)` + '\n';

    return head + receiptTotal + sep + promoHead + receiptPromo + sep + info + end;
}
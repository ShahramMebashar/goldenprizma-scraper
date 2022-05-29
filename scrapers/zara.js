export default function (cheerio) {
    let name = cheerio('[property="og:title"]').attr('content');

    let price = cheerio('.product-detail-info__price-amount .price-current__amount').text();
    price = price.toString().replace(/[^0-9\.]/ig, ''); // normalize price - remove none digit letters i.e 400.2 TL => 400.2

    const image = cheerio('[property="og:image"]').attr('content');
    let productInfo = cheerio('.product-detail-selected-color.product-detail-color-selector__selected-color-name')
    .text()
    .split('|');
    
    let color, code;
    productInfo = productInfo.filter(Boolean);
    if(productInfo.length == 0) {
       productInfo = cheerio('.product-detail-selected-color.product-detail-info__color')
       .text()
       .split('|');
    }
    
    if (productInfo.length > 0) {
        color = productInfo[0].toString().trim();
        if(productInfo.length > 1) {
            code = productInfo[1].toString().trim();
        }
        name = `${name} ${code}`;
    }
    const categories = {
        'man': 'men',
        'woman': 'women',
        'kids': 'kids'
    };

    let category = cheerio('ol.layout-footer-breadcrumbs__items li:nth-child(2)')
        .text()
        .toString()
        .replace(/[^a-zA-Z]/ig, '')
        .toLowerCase();

    return {
        name,
        code,
        price,
        image,
        color,
        productInfo,
        parentCategory: categories[category],
    };
}
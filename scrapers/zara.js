export default function (cheerio) {
    let name = cheerio('[property="og:title"]').attr('content');

    let price = cheerio('.product-detail-info__price-amount .price-current__amount').text();
    price = price.toString().replace(/[^0-9\.]/ig, ''); // normalize price - remove none digit letters i.e 400.2 TL => 400.2

    const image = cheerio('[property="og:image"]').attr('content');
    const productInfo = cheerio('.product-detail-selected-color.product-detail-color-selector__selected-color-name')
        .text()
        .split('|');

    let color, code;

    if (productInfo.length > 0) {
        color = productInfo[0].replace(/\s+/, '');
        code = productInfo[1].replace(/\s+/, '');
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
    console.log(category);
    return {
        name,
        code,
        price,
        image,
        color,
        productInfo,
        parentCategory: categories[category]
    };
}
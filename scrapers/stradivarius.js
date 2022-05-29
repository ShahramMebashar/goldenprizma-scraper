module.exports = function (cheerio) {
    return JSON.parse(cheerio('[type="application/ld+json"]').html());
}
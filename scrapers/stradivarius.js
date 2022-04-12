export default function (cheerio) {
    return JSON.parse(cheerio('[type="application/ld+json"]').html());
}
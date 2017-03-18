const needle          = require('needle');
const cheerio         = require('cheerio');
const AVITO_CONSTANTS = require('./avito-constants').constants;
let results           = [];


function getQuery(queryString) {
	return new Promise(function (resolve) {
		needle
			.get(queryString, _parseHTML)
			.on('end', function () {
				resolve(results);
				results = [];
			});
	});
}

function _parseHTML(error, response) {
	if (!error && response.statusCode === 200) {
		const $ = cheerio.load(response.body);
		$('.js-catalog-item-enum').each((index, item) => {
			const link    = $(item).find('.item-description-title a');
			const img     = $(item).find('img');
			const itemObj = {};

			itemObj.text = link.text().trim();
			itemObj.href = AVITO_CONSTANTS.BASE_URL + link.attr('href');
			itemObj.img  = img.attr('src');

			results.push(itemObj);

		});

	}
}

module.exports.getQuery = getQuery;


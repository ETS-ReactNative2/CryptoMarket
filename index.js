const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const siteUrl = 'https://coinmarketcap.com/';
async function getNewlyAdded() {
	try {
		const { data } = await axios({
			method: 'GET',
			url: siteUrl,
		});

		const $ = cheerio.load(data);

		const keys = ['name', 'price'];

		const coinArr = [];

		const elemSelector =
			'#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.sc-1rmt1nr-0.sc-1rmt1nr-2.iMyvIy > div:nth-child(3) > div:not(:nth-child(1))';
		$(elemSelector).each((parentIndx, parentElem) => {
			const coinObj = { Images: $(parentElem).find('img').attr('src') };

			$(parentElem)
				.children()
				.each((childIdx, childElem) => {
					let text = $(childElem).text();
					if (childIdx === 0) {
						text = text.slice(1, text.length);
					}
					coinObj[keys[childIdx]] = text;
				});
			coinArr.push(coinObj);
		});
		return coinArr;
	} catch (error) {
		console.error(error);
	}
}

async function getBiggestGainers() {
	try {
		const { data } = await axios({
			method: 'GET',
			url: siteUrl,
		});

		const $ = cheerio.load(data);

		const keys = ['name', 'price'];

		const coinArr = [];

		const elemSelector =
			'#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.sc-1rmt1nr-0.sc-1rmt1nr-2.iMyvIy > div:nth-child(2) > div:not(:nth-child(1))';
		$(elemSelector).each((parentIndx, parentElem) => {
			const coinObj = { Images: $(parentElem).find('img').attr('src') };

			$(parentElem)
				.children()
				.each((childIdx, childElem) => {
					let text = $(childElem).text();
					if (childIdx === 0) {
						text = text.slice(1, text.length);
					}
					coinObj[keys[childIdx]] = text;
				});
			coinArr.push(coinObj);
		});
		return coinArr;
	} catch (error) {
		console.error(error);
	}
}

const app = express();
var cors = require('cors');

app.use(cors());

app.get('/api/newly-added-coins', async (req, res) => {
	try {
		const addedCoins = await getNewlyAdded();

		return res.status(200).json({
			result: addedCoins,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.toString(),
		});
	}
});

app.get('/api/biggest-gainers', async (req, res) => {
	try {
		const biggestGainers = await getBiggestGainers();

		return res.status(200).json({
			result: biggestGainers,
		});
	} catch (err) {
		return res.status(500).json({
			err: err.toString(),
		});
	}
});

app.listen(5000, () => {
	console.log('Live server on localhost:5000');
});

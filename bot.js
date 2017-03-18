const TelegramBot   = require('node-telegram-bot-api');
const grabber       = require('./avitoGrabber');
const fs            = require('fs');
const token         = '366349900:AAHjM45e9jFP9i-g2xQ6clikxPEPnMFzvKc';
const BOT_CONSTANTS = require('./bot-constants').constants;

const bot = new TelegramBot(token, {polling: true});
let chatID;
let interval;

function getQuery() {
	return grabber.getQuery();
}

function startInterval(data) {
	fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
	let prevData = JSON.parse(fs.readFileSync('./data.json'));
}

function compareData(currentData) {
	const message = `${currentData[0].text}, ${currentData[0].href}`;

	if (prevData[0].text === currentData[0].text) {
		return;
	}
	fs.writeFileSync('./currentData.json', JSON.stringify(currentData, null, 4));
	prevData = JSON.parse(fs.readFileSync('./currentData.json'));
	sendMessage(message);
	bot.sendPhoto(chatID, currentData[0].img);
}

/**
 * @param {String} text
 */
function sendMessage(text) {
	bot.sendMessage(chatID, text);
}

function startInterval() {
	interval = setInterval(()=> {
		getQuery().then(compareData);
	}, 1000);
}


bot.on('message', (msg) => {
	chatID = msg.chat.id;

	switch (msg.text) {
		case (BOT_CONSTANTS.START):
			getQuery()
				.then(startInterval);
			break;
		case (BOT_CONSTANTS.STOP):
			clearInterval(interval);
			break;
		default :
	}
});




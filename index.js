const TelegramBot = require('node-telegram-bot-api');
const grabber     = require('./avitoGrabber');
const fs          = require('fs');
const token       = '366349900:AAHjM45e9jFP9i-g2xQ6clikxPEPnMFzvKc';

const bot = new TelegramBot(token, {polling: true});
let chatID;
let interval;

function getQuery() {
	return grabber.getQuery();
}

function startInterval(data) {

	fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
	let prevData = JSON.parse(fs.readFileSync('./data.json'));

	function compareData(data) {
		if (prevData[0].text !== data[0].text) {
			fs.writeFileSync('./data.json', JSON.stringify(data, null, 4));
			prevData = JSON.parse(fs.readFileSync('./data.json'));

			bot.sendMessage(chatID, `${data[0].text}, ${data[0].href}`);
			bot.sendPhoto(chatID, data[0].img);
		}
	}

	interval = setInterval(()=> {
		getQuery().then(compareData)
	}, 1000)
}


bot.on('message', (msg) => {
	chatID = msg.chat.id;
	if (msg.text === 'start') {
		getQuery().then(startInterval);
	}

	else if (msg.text === 'stop') {
		clearInterval(interval);
	}

});




const TelegramBot = require('node-telegram-bot-api');
const request = require('request');
const lodash = require('lodash')

// replace the value below with the Telegram token you receive from @BotFather
const token = '1187853400:AAHz6wEs4EW-sTJQ-cSxMZmOe3WH6awL4IE';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/rates/, (msg, match) => {

  const chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Выберете валюту', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '$ USD',
            callback_data: 'USD'
          },
          {
            text: '€ EUR',
            callback_data: 'EUR'
          }
        ]
      ]
    }
  });
});

bot.on('callback_query', query => {
  const id = query.message.chat.id;

  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', (err, res, body) => {
    const data = JSON.parse(body);
    const { ccy, base_ccy, buy, sale } = lodash.get( data.filter( (rates => rates.ccy === query.data )), '[0]' )
    const result = `
      ${ccy} => ${base_ccy}
      Buy: ${buy}
      Sale: ${sale}
    `;

    bot.sendMessage(id, result, {parse_mode: 'Markdown'})
  })
})
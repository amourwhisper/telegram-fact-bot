const TelegramBot = require('node-telegram-bot-api');
//const token = '8407533841:AAH0ERHBngFNTHwEQvVBa1gMBXD1h4E83Nk';
const token = process.env.BOT_TOKEN;
if (!token) {
    throw new Error('Токен BOT_TOKEN не найден в переменных окружения!');
}
const scienceFacts = require('./facts.json');
const factsKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: 'Получить Факт'}], //создаем одну кнопку с текстом
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    },
};
const bot = new TelegramBot(token, {polling:true});
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `Привет! 👋 Я твой Научный Любопытик. 
    Я буду рассказывать тебе рандомные, интересные факты из мира науки.
    Чтобы получить факт, просто отправь команду /fact.`;
    bot.sendMessage(chatId, welcomeMessage, factsKeyboard)
});
bot.onText(/\/fact|Получить Факт/i, (msg) => {
    const chatId = msg.chat.id;
    const randomIndex = Math.floor(Math.random() * scienceFacts.length);
    const randomFact = scienceFacts[randomIndex];
    bot.sendMessage(chatId, randomFact, factsKeyboard)
});
bot.on('polling_error', (error) => {
    console.log("Произошла ошибка, но бот продолжает работать...");
});
bot.onText(/\/search (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];
    bot.sendMessage(chatId, `🔍 Ищу информацию по запросу: *${query}*...`, { parse_mode: 'Markdown' });
    try {
        const searchResult = await googleSearchTool.search(query);
        let responseText;
        if (searchResult.snippets && searchResult.snippets.length > 0) {
            responseText = `**Результат поиска по запросу "${query}":**\n\n`;
            responseText += searchResult.snippets[0];
            if (searchResult.url) {
                responseText += `/n/n[Подробнее](${searchResult.url})`;
            }
        } else {
            responseText = `Извините, не удалось найти информацию по запросу "${query}". Попробуйте перефразировать.`;
            bot.sendMessage(chatId, responseText, {parse_mode: 'Markdown' });
    } catch (error) {
        console.error(('Ошибка поиска:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при выполнении поиска. Пожалуйста, попробуйте позже.');
    }
});
console.log('Бот успешно запущен!');


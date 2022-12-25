// Configuration
const config = require(process.env.NODE_ENV === 'PROD' ? '../../config/config.json' : '../../config/config.json');
const { branch } = config;
const { telegram_token, telegram_chat_id } = config.telegram;
// Telegram
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(telegram_token, {polling: true});

module.exports = {
    gitEvent
};

async function gitEvent(resp) {
    await _isStarBranch(resp.ref)

    _sendTelegramMessage(resp.repository.name, head_commit.committer.username, head_commit.message)

    return resp;
}

function _isStarBranch(ref) {
    const base = "refs/heads/";
    if (ref != base + branch) {
        return {
            "status": true,
            "message": "is not Star Branch"
        }
    }
}

function _sendTelegramMessage({ repoName, committerUsername, commitMessage }) {
    const message = `${committerUsername} pushed new ${commitMessage} to ${repoName}`;

    bot.sendMessage(telegram_chat_id, message);
}
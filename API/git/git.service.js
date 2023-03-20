// Configuration
const config = require(process.env.NODE_ENV === 'PROD' ? '../../config/config.json' : '../../config/config.json');
const { branch } = config;
const { token, chat_id } = config.telegram;
// Telegram
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {polling: true});
// Terminal
const { exec } = require("child_process");

module.exports = {
    gitEvent
};

async function gitEvent(resp) {
    _isStarBranch(resp.ref)

    _sendTelegramMessage(resp.repository.name, resp.head_commit.committer.username, resp.head_commit.message)

    _updateStarBranch()

    return {
        "status": true
    };
}

function _isStarBranch(ref) {
    const base = "refs/heads/";
    if (ref != base + branch) {
        return {
            "status": true,
            "message": "is not Star Branch"
        };
    }
}

function _sendTelegramMessage(repoName, committerUsername, commitMessage) {
    const message = `${committerUsername} pushed new ${commitMessage} to ${repoName}`;

    bot.sendMessage(chat_id, message);
}

function _updateStarBranch() {
    exec("forever logs", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    exec("forever stopall", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    exec("~/PersonalGroupsSAPI git reset --hard HEAD", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    exec("~/PersonalGroupsSAPI git pull", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    exec("~/PersonalGroupsSAPI forever start server.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    exec("~/PersonalGroupsSAPI forever start smqttevents.js", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}
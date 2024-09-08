const { App } = require('@slack/bolt');
require('dotenv').config();
let eventUser;
const failure = {
    apiFailureKeyWords: ['api', 'failure'],
    readmemberApiFailureKeyWords: ['api', 'failure', 'readmember'],
    widgetFailure: ['widget', 'not', 'loading']
}

const priority = {
    apiFailureKeyWords: 1,
    readmemberApiFailureKeyWords: 2,
    widgetFailure: 3
}
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
    await app.start(process.env.PORT || 3000)
})()

const blockBuilders = (cases) => {
    const details = cases?.filter((item) => item !== undefined);
    if (details.length > 0) {
        const blocks = [];
        return blocks;
    }
    return [
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": `we cant identify you request can you please give some more details`,
                "emoji": true
            }
        }
    ]

}
app.event('message', ({ event, say, client }) => {
    if (event.channel === 'C07JM0KSM2T') {
        const userText = event.text;
        say(`hi <@${event.user}>, thanks for reaching War room chat`)
        const keys = Object.keys(failure);
        const failureCase = keys.map((scenario) => {
            if (failure[scenario].every(substring => userText.includes(substring))) {
                return scenario;
            }
        });
        const blocks = blockBuilders(failureCase);
        client.conversations.create();
        client.views.publish({
            user_id: event.user,
            view: {
                type: 'home',
                callback_id: 'home_view',
                blocks: blocks
            }
        })
    }
})



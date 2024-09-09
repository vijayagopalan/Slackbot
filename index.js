const { App } = require('@slack/bolt');
require('dotenv').config();
const failure = {
    apifailurekeywords: { name: 'API Failure', keywords: ['api', 'failure'] },
    e1apifailurekeywords: { name: 'E1 API Failure', keywords: ['api', 'failure', 'e1'] },
    e2apifailurekeywords: { name: 'E2 API Failure', keywords: ['api', 'failure', 'e2'] },
    readmemberapifailuree1keywords: { name: 'Read Member E1 API Failure', keywords: ['api', 'failure', 'readmember', 'e1'] },
    servicingexperiencecachee1apifailurekeywords: { name: 'Servicing Experiecne Cache E1 API Failure', keywords: ['api', 'failure', 'servicingexperiencecache', 'e1'] },
    userexperienceapie1failurekeywords: { name: 'User Experience Cache E1 API Failure', keywords: ['api', 'failure', 'userexperiencecache', 'e1'] },
    readmemberapifailuree2keywords: { name: 'Read Member E2 API Failure', keywords: ['api', 'failure', 'readmember', 'e2'] },
    servicingexperiencecachee2apifailurekeywords: { name: 'Servicing Experiecne Cache E2 API Failure', keywords: ['api', 'failure', 'servicingexperiencecache', 'e2'] },
    userexperienceapie2failurekeywords: { name: 'User Experience Cache E1 API Failure', keywords: ['api', 'failure', 'userexperiencecache', 'e2'] },
    widgetfailuree1: { name: 'Widget Failure', keywords: ['widget', 'not', 'loading', 'e1'] },
    widgetfailuree2: { name: 'Widget Failure', keywords: ['widget', 'not', 'loading', 'e2'] },
    widgetfailure: { name: 'Widget Failure', keywords: ['widget', 'not', 'loading'] }
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
        const options = [];
        details.map((item) => {
            options.push({
                "text": {
                    "type": "plain_text",
                    "text": failure[item]?.name,
                    "emoji": true
                },
                "value": item
            })
        });
        return [
            {
                block_id: 'black',
                type: "actions",
                elements: [
                    {
                        type: "radio_buttons",
                        options: options,
                        action_id: "some_action"
                    }
                ]
            }];
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
app.event('message', async ({ event, client }) => {
    const correlationIDRegex = `[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}`;
    const crID = event.text.match(correlationIDRegex) && event.text.match(correlationIDRegex)[0];
    if (event.channel === 'C07JM0KSM2T') {
        const userText = event.text;
        const keys = Object.keys(failure);
        const failureCase = keys.map((scenario) => {
            if (failure[scenario].keywords.every(substring => userText.includes(substring))) {
                return scenario;
            }
        });
        const blocks = blockBuilders(failureCase);
        //ack message
        await client.chat.postMessage({
            channel: event.channel,
            text: `hi <@${event.user}>, thanks for reaching War room chat`,
            thread_ts: event.event_ts
        });
        //issue if we have blocks

        const handledRespsone = await client.chat.postMessage({
            channel: event.channel,
            text: `something went wrong please try again later`,
            blocks: blocks,
            thread_ts: event.event_ts
        });

        // Function to handle the button click event
        // client.events.on('interactive_message', async (event) => {
        //     if (event.payload.action_id === 'click_me') {
        //         // Get the user who clicked the button
        //         const user = event.payload.user.id;

        //         // Send a response to the same channel using the response_url
        //         await client.chat.postMessage({
        //             channel: channelId,
        //             text: `Button clicked by <@${user}>!`,
        //             response_url: responseUrl
        //         });
        //     }
        // });


    }
});

const { App } = require('@slack/bolt');
require('dotenv').config();
let eventUser;
const app = new App({
    token: null,
    signingSecret: null
});

(async () => {
    await app.start(process.env.PORT || 3000)
    console.log('Hi')
})()


app.event('app_home_opened', ({ event, say, client }) => {
    eventUser = event.user;
    console.log(event)
    try {
        const result = client.views.publish({
            user_id: event.user,
            view: {
                type: 'home',
                callback_id: 'home_view',
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": `hi ${event.user} how can i help you?`,
                            "emoji": true
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "radio_buttons",
                                "options": [
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Api Failure",
                                            "emoji": true
                                        },
                                        "value": "value-0"
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Widget Failure",
                                            "emoji": true
                                        },
                                        "value": "value-1"
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Access Needed",
                                            "emoji": true
                                        },
                                        "value": "value-2"
                                    }
                                ],
                                "action_id": "actionId-0"
                            }
                        ]
                    }
                ]
            }
        })
    }
    catch (e) {
        console.log(e)
    }
});

app.action('actionId-0', ({ action, client }) => {
    console.log("hello", action.selected_option.text.text)
    try {
        const result = client.views.publish({
            user_id: eventUser,
            view: {
                type: 'home',
                callback_id: 'home_view',
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": "Selected option : " + action.selected_option.text.text,
                            "emoji": true
                        }
                    },
                    {
                        "type": "actions",
                        "elements": [
                            {
                                "type": "radio_buttons",
                                "options": [
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Update Servicing Experience Failure",
                                            "emoji": true
                                        },
                                        "value": "value-0"
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Read Servicing Experience Failure",
                                            "emoji": true
                                        },
                                        "value": "value-1"
                                    },
                                    {
                                        "text": {
                                            "type": "plain_text",
                                            "text": "Read Member Failure",
                                            "emoji": true
                                        },
                                        "value": "value-2"
                                    }
                                ],
                                "action_id": "api_Failure"
                            }
                        ]
                    }
                ]
            }
        })
    }
    catch (e) {
        console.log(e)
    }
})
app.action('api_Failure', ({ action, client }) => {
    console.log("hello", action.selected_option.text.text)
    try {
        const result = client.views.publish({
            user_id: eventUser,
            view: {
                type: 'home',
                callback_id: 'home_view',
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "plain_text",
                            "text": "Raising ticket and Assigning to team",
                            "emoji": true
                        }
                    }]
            }
        })
    }
    catch (e) {
        console.log(e)
    }
})
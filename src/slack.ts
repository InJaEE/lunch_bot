import {Block} from '@slack/types';
import { IncomingWebhook } from '@slack/webhook';
import dayjs from 'dayjs';
import { StoreInfo } from './types';


export default class Slack {
    url: string;
    webhook?: IncomingWebhook;

    constructor(url: string){
        this.url = url;
        this.incomingWebhook();        
    }

    incomingWebhook(){
        this.webhook = new IncomingWebhook(this.url);
        return this;
    }
    
    sendMessage(message: StoreInfo[]){
        const result = this.messageBuilder(message);

        this.webhook?.send({
            blocks: [
                { 
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: `*${dayjs().format('YYYY년 MM월 DD일')}의 점심!*`
                    }
                },
                { type: 'divider'},
                ...result,
            ]
        })
    }

    messageBuilder(message: StoreInfo[]){
        const result: Block[][] = message.map(value => ([
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: value.name,
                    emoji: true
                },
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*음식 종류*\n${value.type!.join(' ')}\n\n` + '*평점*\n' + Array(Math.round(value.rating)).fill(':star:').join(' ') + ` (${value.rating})` +`\n\n<${value.link}|자세히 보기>`,
                },
                accessory: {
                    type: "image",
                    image_url: value.thumbnail,
                    alt_text: value.name,             
                }
            },
        ]))
        return result.flat();
    }
}
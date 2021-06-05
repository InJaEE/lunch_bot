import { getLunchList, getRandom } from './util';
import Slack from './slack';

(() => {
    const LUNCH_NUMBER = 3; // 슬랙 채널에 표시될 수

    const lunchList = getLunchList();
    const randomLunch = getRandom(lunchList, LUNCH_NUMBER);

    const slack = new Slack('https://hooks.slack.com/services/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');
    slack.incomingWebhook().sendMessage(randomLunch);
})();
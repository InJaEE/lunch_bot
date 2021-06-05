import fs from 'fs';
import { StoreInfo } from './types';

export const getLunchList = () => {
    const info = fs.readFileSync('data/info.txt');
    return JSON.parse(info.toString());
}

export const getRandom = (lunchList: StoreInfo[], lunchCount: number) => {
    const randomIndexArray = [];

    for (let index = 0; index < lunchCount; index++) {
        const randomNum = Math.floor(Math.random() * lunchList.length)

        if (randomIndexArray.indexOf(randomNum) === -1) {
            randomIndexArray.push(randomNum)
        } else {
            index--;
        }
    }

    return randomIndexArray.map(index => lunchList[index]);
}

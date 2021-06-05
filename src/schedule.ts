import fs from 'fs';
import axios from 'axios';
import cheerio from 'cheerio';
import { StoreInfo } from './types';

const MANGO_PLATE = 'https://www.mangoplate.com/search?';

// 망고플레이트에서 한페이지의 음식점 리스트 가져오기
const getInfo = async (keyword: string, query: number) => {
        const url = `${MANGO_PLATE}keyword=${encodeURIComponent(keyword)}&page=${Number(query)}`
        const { data: html } = await axios({url});

        const $ = cheerio.load(html);
        const list: StoreInfo[] = [];

        $('.list-restaurant .list-restaurant-item').map((i, el) => {
            list.push({
                name: $(el).find('.title').text().replace(/\n/g, '').replace(/  /g, ''),
                type: $(el).find('.etc > span').html()?.split(" / ").map(value => `#${value}`),
                rating: Number($(el).find('.point.search_point').html()),
                link: 'https://www.mangoplate.com' + $(el).find('a.only-desktop_not').attr('href'),
                thumbnail: $(el).find('.thumb > img').attr('data-original')
            })
        });

        return Promise.resolve(list);
}

// 입력한 페이지의 수 만큼 음식점 리스트 가져오기
const getList = async (keyword: string, page: number) => {
    const promiseArr = [];

    for(let index = 1; index <= page; index++){
        promiseArr.push(getInfo(keyword, index));
    }

    const result = await Promise.all(promiseArr);
    return Promise.resolve(result.flat());
}

// 긁어온 데이터 .txt파일에 저장
const writeFile = async () => {
    const data = await getList('신사동', 20);

    fs.writeFile('data/info.txt', JSON.stringify(data), err => {
        console.log(err);
    })
}

writeFile();

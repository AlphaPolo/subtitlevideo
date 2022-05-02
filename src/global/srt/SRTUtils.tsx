import Moment from 'moment';
import DataIntervalTree from 'node-interval-tree';
import { Subtitle } from '../../pages/Video/components/SubtitleList';
const { default: srtParser2 } = require("srt-parser-2");
const parser = new srtParser2();

const dateFormat = "HH:mm:ss,SSS";

const parseToMiliseconds = (time: number) => {
    let ts = Moment(time, dateFormat);
    let tm = ts.milliseconds() + (ts.seconds() * 1000) + (ts.minutes() * 60000) + (ts.hours() * 3600000);
    // console.log("Moment", time, "totals miliseconds", tm, "hours", ts.hours(), "minutes", ts.minutes(), "seconds", ts.seconds(), "miliseconds", ts.milliseconds());
    return tm;
}

export const combineSRTtoIntervalTree = (SRT_CN: string, SRT_EN: string) => {
    let result_cn = parser.fromSrt(SRT_CN);
    let result_en = parser.fromSrt(SRT_EN);
    // console.log("Result", result);

    let array: Subtitle[] = [];
    let intervalTree = new DataIntervalTree<Subtitle>();
    result_cn.forEach((value: any, index: number) => {
        let subtitleEn = result_en[index];
        const subtitle: Subtitle = {
            id: value.id,
            native: value.text,
            foreign: (subtitleEn != null) ? subtitleEn.text: '',
            start: parseToMiliseconds(value.startTime),
            end: parseToMiliseconds(value.endTime),
        };
        
        array.push(subtitle);
        intervalTree.insert(subtitle.start, subtitle.end, subtitle);
    });
    return { tree: intervalTree, data: array } ;
}

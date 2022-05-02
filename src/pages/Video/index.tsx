import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import YouTube, { Options } from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';
import DataIntervalTree from 'node-interval-tree';


import SubtitleList, { Subtitle } from './components/SubtitleList';
import { combineSRTtoIntervalTree } from '../../global/srt/SRTUtils';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import firestorage from '../../global/firebase/FirebaseStorageUtil';
import { Helmet } from 'react-helmet';
import './index.css'

const opts: Options = {
    // height: '390',
    // width: '640',
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        modestbranding: 1,
        // loop: 1,
        // controls: 0,

    },
};

// const defaultProps: VideoProps = {
//     video_id: "3tJUflhYIpo",
//     title: "起風了",
//     description: "我曾難自拔於世界之大",
//     thumbnail: "",
//     subtitle_path: "3tJUflhYIpo",
// }

const srtStorageRef = storageRef(firestorage, 'SRT');

type VideoState = {
    videoId: string,
    pathSRT: string,
    data: Subtitle[];
    opts: Options;
    currentIndex: number;
    player?: YouTubePlayer;
    intervalTree?: DataIntervalTree<Subtitle>;
    repeatSubtitle?: Subtitle | null;
};

class VideoPage extends React.Component<any, VideoState> {
    // const [data, setData] = useState<Subtitle[]>([]);
    videoId?: string;
    timerId?: NodeJS.Timeout;
    currentSubtitle?: Subtitle;

    constructor(props: any) {
        super(props);
        this.state = {
            videoId: this.props.params?.videoId ?? "3tJUflhYIpo",
            pathSRT: this.props.params?.pathSRT ?? this.props.params?.videoId ?? "3tJUflhYIpo",
            data: [],
            opts: opts,
            currentIndex: 0,
            repeatSubtitle: null
        }
        console.log("params", this.props.params);
        this.setRepeatSubtitle = this.setRepeatSubtitle.bind(this);
        this.onPlayerReady = this.onPlayerReady.bind(this);
        this.sendPlayerStateChange = this.sendPlayerStateChange.bind(this);
        this.startSendCurrentTimeInterval = this.startSendCurrentTimeInterval.bind(this);
        this.getSRT = this.getSRT.bind(this);
        this.getPromiseSRT = this.getPromiseSRT.bind(this);
    }

    componentDidMount() {

        this.getSRT(this.state.pathSRT)
            .then((results) => {
                // console.log(results);
                if(results == null) return;
                this.setState({
                    intervalTree: results.tree,
                    data: results.data
                });
            });
    }

    componentWillUnmount() {
        if(this.timerId)
            clearTimeout(this.timerId);
    }
    
    setRepeatSubtitle(subtitle?: Subtitle | null) {
        console.log("SetReapeat");
        this.setState({
            repeatSubtitle: subtitle
        });
        if(subtitle != null)
        {
            this.state.player?.seekTo(subtitle.start / 1000, true);
        }
    }
        
    async getSRT(path: string) {
        // if(data.subtitle_path == null) return;
        let [SRT_CN, SRT_EN] = await Promise.all([this.getPromiseSRT(path, "SRT_CN"),
                                                this.getPromiseSRT(path, "SRT_EN")]);
        // console.log(SRT_CN, SRT_EN);
        return combineSRTtoIntervalTree(SRT_CN, SRT_EN);
    }

    async getPromiseSRT(path: string, file: string) {
        const input = await getDownloadURL(storageRef(srtStorageRef, `${path}/${file}`));
        const res = await fetch(input);
        return await res.text();
    }

    render() {
        
        return (
            <div className="app">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>起風了</title>
                    <meta name="description" content="我曾難自拔於世界之大" />

                    <meta property="og:title" content="起風了"/>
                    <meta property="og:type" content="video" />
                    <meta property="og:description" content="我曾難自拔於世界之大"/>
                    <meta property="og:image" content="https://img.youtube.com/vi/3tJUflhYIpo/hqdefault.jpg"/>
                </Helmet>

                <div className="youtube-container">
                    <YouTube containerClassName="video-container" videoId={this.state.videoId} opts={this.state.opts} onReady={this.onPlayerReady} onStateChange={this.sendPlayerStateChange} />
                </div>
                <SubtitleList list={this.state.data} currentIndex={this.state.currentIndex} player={this.state.player} reapeatingSubtitle={this.state.repeatSubtitle} setRepeat={this.setRepeatSubtitle}/>

            </div>
        );
    }

    // 4. The API will call this function when the video player is ready.
    onPlayerReady(event: any) {
        this.setState({player: event.target});
    }

    sendPlayerStateChange(event: any) {
        if(this.timerId)
            clearTimeout(this.timerId);
        
        // console.log("state data:", event.data);

        switch (event.data) {
            case YouTube.PlayerState.UNSTARTED:
                return;

            case YouTube.PlayerState.ENDED:
                return;

            case YouTube.PlayerState.PLAYING:
                this.startSendCurrentTimeInterval();
                return;

            case YouTube.PlayerState.PAUSED:
                return;

            case YouTube.PlayerState.BUFFERING:
                return;

            case YouTube.PlayerState.CUED:
                return;
        }
    }

    startSendCurrentTimeInterval() {
        this.timerId = setInterval(async () => {
            // console.log("TimerRunning");
            if(this.state.player == null) return;
            let currentTime = this.state.player.getCurrentTime();
            let result = Math.trunc(await currentTime * 1000);
            let current = this.state.intervalTree?.search(result, result);
            if(this.state.repeatSubtitle != null) {
                const check = this.state.repeatSubtitle;
                // if(current == null || current.length <= 0 || current[0] != this.state.repeatSubtitle)
                if((result < check.end) == false)
                {
                    this.state.player.seekTo(this.state.repeatSubtitle.start / 1000, true);
                    // console.log("TriggerReapeat");
                    return;
                }
            }
            if(current != null && current.length > 0 && this.currentSubtitle != current[0]) {
                // console.log("current", current);
                this.currentSubtitle = current[0];
                this.setState({currentIndex: this.currentSubtitle.id});
            }
        }, 100);
    }


    onPlayerStateChange(event: any) {

    }

    stopVideo() {

    }
}


// Decorator pattern
const withRouter = (WrappedComponent: any) => (props: any) => {
    // const [search] = useSearchParams();
    const params = useParams();
    // let params: {[key: string]: any} = {};
    // search.forEach((value, key) => {
    //     params[key] = value;
    // });
    // console.log(search.get("videoId"));
    return (
      <WrappedComponent
        {...props}
        params={params}
        // etc...
      />
    );
  };

export default withRouter(VideoPage);
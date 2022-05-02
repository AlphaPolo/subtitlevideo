import React from "react";

import { FirebaseApp } from "../../global/firebase/config";
import { getDatabase, ref as dataBaseRef, get as getData, DataSnapshot} from "firebase/database";
import GridView from "./components/GridView";
import { VideoItemView } from "./components/VideoItemView";


// Get a reference to the database service
const database = getDatabase(FirebaseApp);
const srtFolderRef = dataBaseRef(database, 'SRT');

export type VideoProps = {
    video_id: string,
    thumbnail: string,
    subtitle_path?: string,
    title?: string,
    description?: string
}

const thumbnailMax = "https://img.youtube.com/vi/<insert-youtube-video-id-here>/maxresdefault.jpg";
const thumbnailSd = "https://img.youtube.com/vi/<insert-youtube-video-id-here>/sddefault.jpg";
const thumbnailHq = "https://img.youtube.com/vi/<insert-youtube-video-id-here>/hqdefault.jpg";
const thumbnailMq = "https://img.youtube.com/vi/<insert-youtube-video-id-here>/mqdefault.jpg";
const thumbnailDf = "https://img.youtube.com/vi/<insert-youtube-video-id-here>/default.jpg";

const getThumbnail = (video_id: string, quality: number) => {
    switch(quality) {
        case 4: return thumbnailMax.replace("<insert-youtube-video-id-here>", video_id);
        case 3: return thumbnailSd.replace("<insert-youtube-video-id-here>", video_id);
        case 2: return thumbnailHq.replace("<insert-youtube-video-id-here>", video_id);
        case 1: return thumbnailMq.replace("<insert-youtube-video-id-here>", video_id);
        case 0: default: return thumbnailDf.replace("<insert-youtube-video-id-here>", video_id);
    }
}

const testThumbnail = () => {
    let thumbnail0 = getThumbnail("3tJUflhYIpo", 0);
    let thumbnail1 = getThumbnail("3tJUflhYIpo", 1);
    let thumbnail2 = getThumbnail("3tJUflhYIpo", 2);
    let thumbnail3 = getThumbnail("3tJUflhYIpo", 3);
    let thumbnail4 = getThumbnail("3tJUflhYIpo", 4);
    console.log(thumbnail0);
    console.log(thumbnail1);
    console.log(thumbnail2);
    console.log(thumbnail3);
    console.log(thumbnail4);
}

class Home extends React.Component<{changePage?: (parameter: any) => void}, {status?: string, data: VideoProps[] }> {

    constructor(props: any) {
        super(props);
        this.state = {
            status: "",
            data: []
        }
        this.getVideos = this.getVideos.bind(this);
    }

    getVideos() {

        getData(srtFolderRef)
            .then(this.handleDataSnapshot)
            .then(props => {
                // console.log("Props", props);
                this.setState({
                    data: props
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    private async handleDataSnapshot(snapshot: DataSnapshot) {
        let results: VideoProps[] = [];
        if (snapshot.exists()) {
            // console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
        snapshot.forEach(child => {
            let val = child.val();
            let to: VideoProps = {
                video_id: val.video_id,
                title: val.title_cn,
                description: val.content,
                thumbnail: getThumbnail(val.video_id, 2),
                subtitle_path: val.subtitle_path,
            };
            results.push(to);

        });

        return results;
    }

    componentDidMount() {
        this.getVideos();
    }

    render() {

        return (
            <GridView 
                items={this.state.data} 

                itemRenderer={(item: VideoProps, index) => {
                    return <VideoItemView key={index} videoProps={item} redirectAction={() => this.props.changePage?.(item)}/>;
                }}
            />
        )
    }

}


export default Home;


import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle as farPlayCircle} from "@fortawesome/free-regular-svg-icons";
import { faPlayCircle as fasPlayCircle, faRepeat} from "@fortawesome/free-solid-svg-icons";
import { YouTubePlayer } from "youtube-player/dist/types";
import ScrollView from "./ScrollView";


export type Subtitle = {
    id: number;
    native: string;
    foreign: string;
    start: number;
    end: number;
}

type Listener = {
    [id: string]: React.RefObject<any>
}

const refMap: Listener = {
    
}

const appendClassByBool = (originClass: string, appendClass: string, check: boolean) => {
    if(!check) return originClass;
    return `${originClass} ${appendClass}`;
}

const SubtitleItem: React.FC<{ subtitle: Subtitle, isActive: boolean, isReapeating: boolean, player?: YouTubePlayer, setRepeat?: (subtitle: Subtitle | null) => void}> = (props) => {

    
    const ref = React.useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = React.useState(false);
    refMap[props.subtitle.id] = ref;
    // ref.current?.scrollIntoView();
    return <div className={appendClassByBool("item", "isSelected", props.isActive)} ref={ref} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                <div className="itemIcon-container"  onClick={() => props.player?.seekTo((props.subtitle.start / 1000), true)}>
                    <FontAwesomeIcon className="itemIcon" icon={ props.isActive ? farPlayCircle : fasPlayCircle} />
                </div>
                <div className="content">
                    <p>{props.subtitle.native}</p>
                    <p>{props.subtitle.foreign}</p>
                </div>
                <div className="tools-container">
                    <FontAwesomeIcon 
                        className={appendClassByBool("toolIcon", "isActive", props.isReapeating) + appendClassByBool("", "isSelected", props.isActive) + appendClassByBool("", "isHover", isHover)} 
                        icon={faRepeat} 
                        onClick={()=>{
                            props.setRepeat?.(props.isReapeating ? null : props.subtitle);
                        }}
                    />
                </div>
                
            </div>
}

// userEffect version
// useEffect(() => {
//     console.log("effect trigger");
//     let item = props.list.find(subtitle => props.currentIndex == subtitle.id);
//     if(item) 
//         refMap[item.id]?.current?.scrollIntoView({behavior: 'smooth'});
// }, [props.currentIndex])

const SubTitleList: React.FC<{ list: Subtitle[], currentIndex: number, reapeatingSubtitle?: Subtitle | null, player?: YouTubePlayer, setRepeat?: (subtitle: Subtitle | null) => void}> = (props) => {
    const ref = React.useRef<ScrollView>(null);

    let item = props.list.find(subtitle => props.currentIndex == subtitle.id);
    if(item)
    {
        refMap[item.id]?.current?.scrollIntoView({behavior: 'smooth'});
    }
    
    // if(item) ref.current?.scrollTo(refMap[item.id])
    return (
        <div className="list">
            <ScrollView 
                ref={ref}
                items={props.list}
                itemRenderer={(item, index) => {
                    let isActive = (item.id == props.currentIndex);
                    return <SubtitleItem key={item.id} subtitle={item} isActive={isActive} player={props.player} isReapeating={props.reapeatingSubtitle==item} setRepeat={props.setRepeat} />
                }}
            />
        </div>
    )
}

// SubtitleItem.defaultProps = defaultProps;

export default SubTitleList;
import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { VideoProps } from "../index";
import { Link } from "react-router-dom";
import { VIDEO_PAGE } from "../../../global/const";

/* Use search params version
<Link to={
    { 
        pathname: `/${VIDEO_PAGE}`,
        search: new URLSearchParams({videoId: props.videoProps.video_id, pathSRT: props.videoProps.subtitle_path?? props.videoProps.video_id}).toString()
    }}>
*/
export const VideoItemView: React.FC<{ videoProps: VideoProps; redirectAction?: any; }> = (props) => {
    // console.log("Call View", props);
    // `?videoId=${props.videoProps.video_id}&pathSRT=${props.videoProps.subtitle_path}`
    return (
        
            <Card sx={{ display: 'flex', flexDirection: 'column'}} onClick={props.redirectAction ?? null}>
                <Link to={`/${VIDEO_PAGE}/${props.videoProps.video_id}`}>
                    <CardMedia
                        component="img"
                        image={props.videoProps.thumbnail} />
                </Link>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {props.videoProps.title ?? `Title`}
                    </Typography>
                    <Typography>
                        {props.videoProps.description ?? `This is a media card. You can use this section to describe the
                        content.`}
                    </Typography>
                </CardContent>
            </Card>
        
    );
};

import React, { CSSProperties } from "react";
import scrollIntoView from "scroll-into-view"
import { Itemrenderer } from "../../../global/utils/Itemrederer";

const scrollerStyle: CSSProperties = {
    // calc youtube iframe height   -10 -10 is margin and padding
    // height: window.innerHeight - (Math.min(window.innerWidth, 720) / 1.77) -10 -10,
    width: '100%',
    overflow: 'auto'
}

class ScrollView extends React.Component<{items: any[], itemRenderer?: Itemrenderer}> {

    constructor(props: any) {
        super(props);
    }

    // scrollTo = (ref: React.RefObject<any>) => {
    //     scrollIntoView(ref.current, {
    //         time: 300,
    //         align: {
    //             top: 0,
    //         },
    //     });
    // };

    render() {
        return <div style={scrollerStyle}>
                {this.props.items.map((item, index) => {
                    return this.props.itemRenderer?.(item, index) || null;
                })}
        </div>
    }
}

export default ScrollView;
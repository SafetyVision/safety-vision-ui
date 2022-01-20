import "./liveFeed.css";
import ReactHlsPlayer from 'react-hls-player';

export default function LiveFeed({url}) {
    if (url){
        return (
            <div id="playerContainer">
                <ReactHlsPlayer
                    src={url}
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="auto"
                    className='player'
                />
            </div>
        );
    } else {
        
    } 
    return (
        <div id="playerContainer">
            <p>{"Invalid URL:  " + url}</p>
        </div>
    );
}
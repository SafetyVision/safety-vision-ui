import ReactHlsPlayer from 'react-hls-player';

export default function LiveFeed({ url }) {
    if (url){
        return (
            <div>
                <ReactHlsPlayer
                    src={url}
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="auto"
                    className="player"
                />
            </div>
        );
    }

    return (
        <div>
            <p>{`Invalid URL: ${url}`}</p>
        </div>
    );
}

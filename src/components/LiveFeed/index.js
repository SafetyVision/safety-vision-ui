import ReactPlayer from 'react-player';

export default function LiveFeed({ url }) {
    if (url){
        return (
            <div>
                <ReactPlayer
                    url={url}
                    playing={true}
                    controls={true}
                    muted={true}
                    width="100%"
                    height="auto"
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

import {
    MediaPlayer,
    MediaProvider,
    Poster,
    Track
} from '@vidstack/react';
import {
    DefaultVideoLayout,
    defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

// Import Vidstack default theme and layout styles
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/audio.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// Import custom styles for additional customization
import "../../styles/video-player.css";

/**
 * VideoPlayer Component - Vidstack React HLS Player
 * 
 * @param {Object} props
 * @param {string} props.src - HLS stream URL (.m3u8)
 * @param {string} props.poster - Poster image URL (optional)
 * @param {string} props.title - Video title (optional)
 * @param {Array} props.textTracks - Text tracks for subtitles (optional)
 * @param {Object} props.hlsConfig - Custom hls.js configuration (optional)
 * @param {Function} props.onError - Error callback (optional)
 */
export default function VideoPlayer({
    src,
    poster = null,
    title = "",
    textTracks = [],
}) {
    // Don't render if no source
    if (!src) {
        return (
            <div className="video-player-wrapper">
                <div className="no-video-message">Select an episode to start watching</div>
            </div>
        );
    }

    return (
        <MediaPlayer
            src={src}
            viewType='video'
            streamType='on-demand'
            logLevel='warn'
            crossOrigin
            playsInline
            title={title}
            poster={poster}
        >
            <MediaProvider>
                <Poster className="vds-poster" />
                {textTracks.map(track => (
                    <Track {...track} key={track.src} />
                ))}
            </MediaProvider>
            <DefaultVideoLayout
                thumbnails='https://files.vidstack.io/sprite-fight/thumbnails.vtt'
                icons={defaultLayoutIcons}
            />
        </MediaPlayer>
    );
}
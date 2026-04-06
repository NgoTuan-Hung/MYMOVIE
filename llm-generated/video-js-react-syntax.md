'use client';

import '@videojs/react/video/skin.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin, Video } from '@videojs/react/video';

const Player = createPlayer({ features: videoFeatures });

interface MyPlayerProps {
  src: string;
}

export const MyPlayer = ({ src }: MyPlayerProps) => {
  return (
    <Player.Provider>
      <VideoSkin>
        <Video src={src} playsInline />
      </VideoSkin>
    </Player.Provider>
  );
};

----------------------------------------------------------
import { MyPlayer } from '../components/player';

export const HomePage = () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <MyPlayer src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4" />
    </div>
  );
};

CSP
If your application uses a Content Security Policy, you may need to allow additional sources for player features to work correctly.

Common requirements
media-src must allow your media URLs.
img-src must allow any poster or thumbnail image URLs.
connect-src must allow HLS manifests, playlists, captions, and segment requests when using HLS playback.
media-src blob: is required when using the HLS player variants, which use MSE-backed playback.
worker-src blob: is required when using the hls.js player variants.
style-src 'unsafe-inline' is currently required for some player UI and HTML player styling behavior.

Example

http

Content-Security-Policy:
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data: blob:;
  media-src 'self' https: blob:;
  connect-src 'self' https:;
  worker-src 'self' blob:;
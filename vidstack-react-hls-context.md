# Vidstack React + HLS — LLM Context Reference

> Source: https://vidstack.io/docs — scraped April 2026
> Package: `@vidstack/react` | Peer dep: `hls.js@^1.0`

---

## 1. Installation

```bash
npm install @vidstack/react hls.js
```

---

## 2. Import Styles

Pick ONE styling approach:

```tsx
// Option A — Default Layout (production-ready, recommended)
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// Option B — Plyr Layout (classic Plyr look)
import '@vidstack/react/player/styles/plyr/theme.css';

// Option C — Base/unstyled (build your own UI)
import '@vidstack/react/player/styles/base.css';
```

---

## 3. Basic Player with Default Layout (HLS)

```tsx
import {
  MediaPlayer,
  MediaProvider,
} from '@vidstack/react';
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from '@vidstack/react/player/layouts/default';

export function VideoPlayer() {
  return (
    <MediaPlayer
      title="My Movie"
      src="https://example.com/stream.m3u8"
      poster="https://example.com/poster.jpg"
      autoPlay={false}
      controls
      playsInline
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
```

> The `.m3u8` extension is auto-detected as HLS. If your URL has no extension, pass a type hint:
> ```tsx
> src={{ src: 'https://example.com/stream', type: 'application/x-mpegurl' }}
> ```

---

## 4. Plyr Layout Alternative

```tsx
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';

<MediaPlayer src="https://example.com/stream.m3u8">
  <MediaProvider />
  <PlyrLayout icons={plyrLayoutIcons} />
</MediaPlayer>
```

---

## 5. Custom hls.js Config

Use the `onHlsInstance` callback (fires after hls.js attaches) or configure via `MediaPlayer` props:

```tsx
import Hls from 'hls.js';

<MediaPlayer
  src="https://example.com/stream.m3u8"
  // Low-latency live streaming config example
  // Pass hls.js config via the provider
>
  <MediaProvider
    // Set hls.js library explicitly (optional — defaults to jsdelivr CDN)
    // @ts-expect-error
    library={Hls}
  />
</MediaPlayer>
```

To pass `hls.js` config options, use `onProviderChange`:

```tsx
import { useRef } from 'react';
import { MediaPlayer, MediaProvider, type MediaProviderAdapter } from '@vidstack/react';
import Hls from 'hls.js';

export function VideoPlayer() {
  function onProviderChange(provider: MediaProviderAdapter | null) {
    if (provider?.type === 'hls') {
      provider.config = {
        maxLoadingDelay: 4,
        lowLatencyMode: true,
        // any hls.js fine-tuning option
      };
    }
  }

  return (
    <MediaPlayer
      src="https://example.com/stream.m3u8"
      onProviderChange={onProviderChange}
    >
      <MediaProvider />
    </MediaPlayer>
  );
}
```

---

## 6. Access hls.js Instance

```tsx
import { isHLSProvider, type MediaProviderAdapter } from '@vidstack/react';
import type Hls from 'hls.js';

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (isHLSProvider(provider)) {
    provider.onInstance((hls: Hls) => {
      // full hls.js instance available here
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed');
      });
    });
  }
}
```

---

## 7. Custom Request Headers (Auth)

```tsx
function onProviderChange(provider: MediaProviderAdapter | null) {
  if (isHLSProvider(provider)) {
    provider.config = {
      xhrSetup(xhr: XMLHttpRequest) {
        xhr.setRequestHeader('Authorization', 'Bearer YOUR_TOKEN');
      },
    };
  }
}
```

---

## 8. Text Tracks / Subtitles

```tsx
import { Track } from '@vidstack/react';

<MediaPlayer src="https://example.com/stream.m3u8">
  <MediaProvider>
    <Track
      src="https://example.com/subs/en.vtt"
      kind="subtitles"
      label="English"
      lang="en-US"
      default
    />
    <Track
      src="https://example.com/chapters.vtt"
      kind="chapters"
      lang="en-US"
      default
    />
  </MediaProvider>
</MediaPlayer>
```

---

## 9. Poster / Thumbnail

```tsx
import { Poster } from '@vidstack/react';

<MediaPlayer src="...">
  <MediaProvider>
    <Poster
      src="https://example.com/poster.jpg"
      alt="Movie poster"
    />
  </MediaProvider>
</MediaPlayer>
```

---

## 10. State Management Hooks

### Reading state

```tsx
import { useMediaState, useMediaStore } from '@vidstack/react';

// Inside a child component of <MediaPlayer>
function PlayerStatus() {
  const paused = useMediaState('paused');
  const buffering = useMediaState('buffering');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const quality = useMediaState('quality');

  return <div>{paused ? 'Paused' : 'Playing'} — {currentTime.toFixed(0)}s</div>;
}
```

### Reading from outside (with ref)

```tsx
import { useRef } from 'react';
import { MediaPlayer, useMediaStore, type MediaPlayerInstance } from '@vidstack/react';

function App() {
  const player = useRef<MediaPlayerInstance>(null);
  const { paused, currentTime } = useMediaStore(player);

  return <MediaPlayer ref={player} src="..."><MediaProvider /></MediaPlayer>;
}
```

### Updating state (MediaRemoteControl)

```tsx
import { useMediaRemote } from '@vidstack/react';

function PlayButton() {
  const remote = useMediaRemote();

  return (
    <button onClick={(e) => remote.togglePaused(e)}>
      Toggle Play
    </button>
  );
}

// Other remote methods:
// remote.seek(seconds, event)
// remote.changeVolume(0.5, event)
// remote.toggleMuted(event)
// remote.toggleFullscreen('prefer-media', event)
// remote.changeQuality(index, event)
// remote.setPlaybackRate(1.5, event)
```

---

## 11. Video Quality (ABR)

Vidstack surfaces hls.js quality levels automatically:

```tsx
import { useVideoQualityOptions } from '@vidstack/react';

function QualitySelector() {
  const options = useVideoQualityOptions({ auto: true, sort: 'descending' });

  return (
    <select>
      {options.map(({ quality, label, select }) => (
        <option key={label} onClick={select}>{label}</option>
      ))}
    </select>
  );
}
```

---

## 12. Events

```tsx
<MediaPlayer
  src="https://example.com/stream.m3u8"
  onPlay={() => console.log('play')}
  onPause={() => console.log('pause')}
  onEnded={() => console.log('ended')}
  onTimeUpdate={({ currentTime }) => console.log(currentTime)}
  onError={(error) => console.error(error)}
  // hls.js specific events (prefixed with onHls):
  onHlsManifestParsed={(data, nativeEvent) => console.log(data)}
  onHlsError={(data, nativeEvent) => console.warn(data)}
  onHlsLevelSwitched={(data) => console.log('quality switched', data)}
/>
```

---

## 13. Player Ref (Imperative API)

```tsx
import { useRef } from 'react';
import { type MediaPlayerInstance } from '@vidstack/react';

const player = useRef<MediaPlayerInstance>(null);

// Access the underlying <video> element
player.current?.el;           // HTMLVideoElement | null

// Methods
player.current?.play();
player.current?.pause();
player.current?.enterFullscreen();
player.current?.exitFullscreen();
player.current?.startLoading();

<MediaPlayer ref={player} src="..." />
```

---

## 14. Next.js / SSR Notes

- `@vidstack/react` is RSC-compatible and works in the Next.js `app/` directory.
- If using the Default Layout with icons, the icons import should be in a **client component** (`'use client'`).
- No special dynamic import or `ssr: false` is needed for the player itself.

```tsx
// app/player.tsx
'use client';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export function Player({ src }: { src: string }) {
  return (
    <MediaPlayer src={src} playsInline>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
}
```

---

## 15. Tailwind CSS Integration (Optional)

```bash
npm install -D vidstack
```

```js
// tailwind.config.js
import { vidstackPlugin } from 'vidstack/tailwind.cjs';

export default {
  plugins: [vidstackPlugin()],
};
```

Enables media variants in Tailwind:
```html
<div class="media-paused:opacity-0 media-buffering:animate-spin" />
```

---

## 16. Key MediaPlayer Props Reference

| Prop | Type | Description |
|---|---|---|
| `src` | `string \| { src, type }` | HLS `.m3u8` URL or object with type hint |
| `title` | `string` | Accessible title |
| `poster` | `string` | Poster image URL |
| `autoPlay` | `boolean` | Auto-play on load |
| `playsInline` | `boolean` | Inline play on mobile |
| `loop` | `boolean` | Loop playback |
| `muted` | `boolean` | Start muted |
| `volume` | `number` | Initial volume (0–1) |
| `currentTime` | `number` | Seek to initial time |
| `playbackRate` | `number` | Initial playback speed |
| `streamType` | `'on-demand' \| 'live' \| 'live:dvr'` | Stream type hint |
| `logLevel` | `'warn' \| 'error' \| 'debug' \| 'silent'` | hls.js log level |
| `crossOrigin` | `string` | CORS attribute |
| `load` | `'eager' \| 'idle' \| 'visible' \| 'custom'` | When to start loading |

---

## 17. Useful Links

- Docs: https://vidstack.io/docs/player
- React examples: https://github.com/vidstack/examples/tree/main/player/react
- hls.js fine tuning: https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning
- Media icons catalog: https://vidstack.io/media-icons
- Discord: https://discord.gg/QAjfh2gZE4

```jsx
<VideoDisplay />
```

We can also apply effects to the displayed video:

```jsx
const { VideoDisplay } = require('@cassette/components');
<VideoDisplay
  aspectRatio="4:3"
  imageResolutionX={480}
  style={{ width: 600 }}
  processFrame={frameData => {
    for (let i = 0; i < frameData.data.length; i += 4) {
      const r = frameData.data[i + 0];
      const g = frameData.data[i + 1];
      const b = frameData.data[i + 2];

      // convert to simple grayscale
      const average = (r + g + b) / 3;
      frameData.data[i + 0] = average;
      frameData.data[i + 1] = average;
      frameData.data[i + 2] = average;
    }
    return frameData;
  }}
/>;
```

```jsx
const { VideoDisplay } = require('@cassette/components');
<VideoDisplay
  imageResolutionX={480}
  style={{ width: 600 }}
  processFrame={frameData => {
    for (let i = 0; i < frameData.data.length; i += 4) {
      // weight toward green
      const g = frameData.data[i + 1];
      frameData.data[i + 1] = g * 1.5;

      const r = frameData.data[i + 0];
      frameData.data[i + 0] = r * 0.75;
      const b = frameData.data[i + 2];
      frameData.data[i + 2] = b * 0.75;
    }
    return frameData;
  }}
/>;
```

Note that in the examples above the effects are only applied to actual videos, and not to placeholder images for audio tracks. If you set `shouldProcessPlaceholderImages` to `true`, the effect can apply to placeholder images as well. Be warned that if you do this, you may need to override `getPlaceholderImageForTrack` to set the `crossOrigin` attribute on your images, which will need to have appropriate CORS headers set. Otherwise it's best to leave `shouldProcessPlaceholderImages` set to `false`.

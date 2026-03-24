---
name: node-generate-media
description: Native integration with AI media generation providers (images, video, audio).
---

# node-generate-media

## Purpose
The `generate_media` node interacts directly with modal providers for image synthesis, video rendering, and voice TTS. It orchestrates the generation APIs directly without requiring a separate agent container.

## Schema: `GenerateMediaNodeData`

```json
{
  "id": "node_gen_media",
  "type": "generate_media",
  "data": {
    "label": "Render Intro Video",
    "config": {
      "mediaType": "video",
      "prompt": "Cinematic shot of a futuristic city: {{start.cityName}}",
      "imageCondition": {
        "imageMode": "first_last",
        "firstFrameImageUrl": "{{node_db_images.output.primary}}",
        "lastFrameImageUrl": "{{node_db_images.output.secondary}}"
      },
      "options": {
        "duration": 5,
        "fps": 30,
        "resolution": "1080p",
        "aspectRatio": "16:9"
      }
    }
  }
}
```

## Fields
- **config.mediaType**: `"image"`, `"video"`, or `"audio"`.
- **config.prompt**: Natural language text instruction (supports `{{variable}}` substitution).
- **config.imageCondition**: Used to constrain video generation or edit images.
  - Requires `imageMode` (`"first_last"` or `"reference"`) and the URLs.
- **config.options**: Media-specific tweaks.
  - **Image**: `imageSize`, `numberOfImages`, `seed`.
  - **Audio**: `format`, `voiceId`, `ttsLanguage`.

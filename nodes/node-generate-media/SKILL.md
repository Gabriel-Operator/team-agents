---
name: node-generate-media
description: Generate image, video, or audio assets directly from workflow variables.
---

# node-generate-media

## Purpose
The `generate_media` node calls media generation providers directly. It supports image generation, video generation with frame/reference conditioning, and audio/music/voice generation options without requiring a separate connector agent.

## Schema: `GenerateMediaNodeData`

```json
{
  "id": "node_gen_media",
  "type": "generate_media",
  "position": { "x": 500, "y": 300 },
  "data": {
    "label": "Render Intro Video",
    "description": "Generate image, video, or audio",
    "config": {
      "mediaType": "video",
      "prompt": "Cinematic shot of a futuristic city: {{start.input.cityName}}",
      "provider": "auto",
      "imageCondition": {
        "imageMode": "first_last",
        "firstFrameImageUrl": "{{node_image.response.url}}",
        "lastFrameImageUrl": "{{node_final_frame.response.url}}",
        "referenceImageUrls": [
          "{{start.input.referenceImage}}"
        ]
      },
      "options": {
        "duration": 5,
        "fps": 30,
        "resolution": "1080p",
        "aspectRatio": "16:9",
        "seed": 123,
        "negativePrompt": "low quality, blurry"
      }
    }
  }
}
```

## Fields
- **config.mediaType**: `"image"`, `"video"`, or `"audio"`.
- **config.prompt**: Natural language instruction. Supports `{{variable}}` substitution.
- **config.provider**: Optional provider ID. The editor defaults to `"auto"`.
- **config.imageCondition**: Optional image/video conditioning.
  - **imageMode**: `"first_last"` or `"reference"`.
  - **firstFrameImageUrl / lastFrameImageUrl**: Frame URLs or variable refs for video generation.
  - **referenceImageUrls**: Up to three reference image URLs or variable refs.
- **config.options**: Media-specific settings.
  - **Image**: `aspectRatio`, `imageSize`, `numberOfImages`, `seed`, `negativePrompt`.
  - **Video**: `duration`, `fps`, `resolution`, `aspectRatio`, `seed`, `negativePrompt`.
  - **Audio**: `audioDuration`, `format`, `audioModel`, `voiceId`, `language`, `model`, `customMode`, `instrumental`, `style`, `title`, `personaId`, `personaModel`, `negativeTags`, `vocalGender`, `styleWeight`, `weirdnessConstraint`, `audioWeight`, `callBackUrl`, `seed`, `negativePrompt`.

## Variable References
- Generated media output: `{{node_gen_media.response}}`
- URL-like fields can use Start inputs, prior node responses, or image refs from `node-start` image mappings.

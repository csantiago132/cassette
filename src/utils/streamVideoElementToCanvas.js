function streamVideoElementToCanvas(videoElement, canvas, callback) {
  const ctx = canvas.getContext('2d');
  let requestId = null;
  let widthSet = null;
  let heightSet = null;
  let placeholderImage = null;

  requestId = requestAnimationFrame(streamToCanvas);

  return {
    endStream() {
      cancelAnimationFrame(requestId);
    },
    setCanvasSize(width, height) {
      widthSet = width || null;
      heightSet = height || null;
    },
    setPlaceholderImage(img) {
      placeholderImage = img || null;
    }
  };

  function streamToCanvas() {
    const { videoWidth, videoHeight } = videoElement;

    // we want to draw the current frame image from the video element
    let imageElement = videoElement;
    let imageWidth = videoWidth;
    let imageHeight = videoHeight;
    let targetWidth = videoWidth;
    let targetHeight = videoHeight;

    // however if there's no video to display (usually means we're playing
    // audio) then we want to display a placeholder image, if available
    if (!(targetWidth && targetHeight) && placeholderImage) {
      imageElement = placeholderImage;
      imageWidth = placeholderImage.width;
      imageHeight = placeholderImage.height;
      targetWidth = placeholderImage.width;
      targetHeight = placeholderImage.height;
    }

    // figure out what resolution the drawn image should be
    if (widthSet && heightSet) {
      targetWidth = widthSet;
      targetHeight = heightSet;
    } else if (widthSet) {
      targetWidth = widthSet;
      targetHeight = (widthSet / imageWidth) * imageHeight;
    } else if (heightSet) {
      targetHeight = heightSet;
      targetWidth = (heightSet / imageHeight) * imageWidth;
    }

    // resize the canvas to the draw resolution if it doesn't already match
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    // draw
    ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);

    // let the callback handle any post-processing
    if (callback) {
      callback(ctx);
    }

    requestId = requestAnimationFrame(streamToCanvas);
  }
}

export default streamVideoElementToCanvas;

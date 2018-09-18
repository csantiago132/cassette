function streamVideoElementToCanvas(videoElement, canvas, callback) {
  const ctx = canvas.getContext('2d');
  let requestId = null;
  let widthSet = null;
  let heightSet = null;

  requestId = requestAnimationFrame(streamToCanvas);

  return {
    endStream() {
      cancelAnimationFrame(requestId);
    },
    setCanvasSize(width, height) {
      widthSet = width || null;
      heightSet = height || null;
    }
  };

  function streamToCanvas() {
    const { videoWidth, videoHeight } = videoElement;
    let targetWidth = videoWidth;
    let targetHeight = videoHeight;
    if (widthSet && heightSet) {
      targetWidth = widthSet;
      targetHeight = heightSet;
    } else if (widthSet) {
      targetWidth = widthSet;
      targetHeight = (widthSet / videoWidth) * videoHeight;
    } else if (heightSet) {
      targetHeight = heightSet;
      targetWidth = (heightSet / videoHeight) * videoWidth;
    }
    // Get rid of any NaNs (probably means there's no video)
    targetWidth = targetWidth || 0;
    targetHeight = targetHeight || 0;
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    if (targetWidth && targetHeight) {
      ctx.drawImage(videoElement, 0, 0, targetWidth, targetHeight);
    }
    if (callback) {
      callback(ctx);
    }
    requestId = requestAnimationFrame(streamToCanvas);
  }
}

export default streamVideoElementToCanvas;

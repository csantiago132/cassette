function streamVideoElementToCanvas (videoElement, canvas, callback) {
  const ctx = canvas.getContext('2d');
  let requestId = null;
  let widthSet = null;
  let heightSet = null;
  const streamToCanvas = () => {
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
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    ctx.drawImage(videoElement, 0, 0, targetWidth, targetHeight);
    if (callback) {
      callback(ctx);
    }
    requestId = requestAnimationFrame(streamToCanvas);
  }
  requestId = requestAnimationFrame(streamToCanvas);
  return {
    endStream () {
      cancelAnimationFrame(requestId);
    },
    setCanvasSize (width, height) {
      widthSet = width || null;
      heightSet = height || null;
    }
  };
}

export default streamVideoElementToCanvas;

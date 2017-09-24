let canvas = document.querySelector('canvas');
let context = canvas.getContext('webgl', {
  antialias: false,
  depth: true,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  alpha: true
});
if(context == null) {
  console.error('Unable to create WebGL 2.0 context');
}
window.gl = context;

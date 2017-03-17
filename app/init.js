let canvas = document.querySelector('canvas');
let context = canvas.getContext('webgl', {
  antialias: true
});
if(context == null) {
  console.error('Unable to create WebGL 2.0 context');
}
window.gl = context;

let canvas = document.querySelector('canvas');
let context = canvas.getContext('webgl2');
if(context == null) {
  console.error('Unable to create WebGL 2.0 context');
}
window.gl = context;

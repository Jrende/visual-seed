import Renderer from './gfx/Renderer';

let renderer = new Renderer();
/*
let stem = new LineStrip(getStem([0, 0], [0, 150], 4), 4);
let petalLines = [
  [0, 0, 0],
  [50, 50, 0],
  [-50, 50, 0],
  [0, 0, 0],
  [50, 50, 0]];
let petal = new LineStrip(petalLines.map(line => [line[0], line[1] + 150, line[2]]), 4);
renderer.add(stem);
renderer.add(petal);
*/

function render() {
  window.requestAnimationFrame(render);
  renderer.render();
  //renderer.renderQuad(shaders.gradient);
}

render();

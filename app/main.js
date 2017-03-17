import LineStrip from './gfx/LineStrip';
import Renderer from './gfx/Renderer';
import shaders from './gfx/shader';

let renderer = new Renderer();
let lineStrip = new LineStrip(
  [
    [0, 0],
    [150, 170],
    [150, 250],
    [0, 100],
    [50, -50],
    [-100, -126]
  ], 10
);
renderer.add(lineStrip);

function render() {
  window.requestAnimationFrame(render);
  renderer.render();
  //renderer.renderQuad(shaders.gradient);
}

render();

import * as glm from 'gl-matrix';
import Line from './gfx/Line';
import LineStrip from './gfx/LineStrip';
import Renderer from './gfx/Renderer.js';

let renderer = new Renderer();
let a = [0, 0];
let b = [50, 50];
let c = [50, -50];
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
/*
renderer.add(new Line(a, b, 5));
renderer.add(new Line(b, c, 5));
renderer.add(new Line(c, a, 5));
*/

let dots = lineStrip.getJoins();

function render() {
  window.requestAnimationFrame(render);
  renderer.render();
  for(let i = 0; i < dots.length; i++) {
    renderer.drawPoint(dots[i], 2);
  }
}

render();

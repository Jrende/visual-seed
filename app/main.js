import 'babel-polyfill';
import Renderer from './gfx/Renderer';
import Line from './gfx/geometry/Line';
import Quad from './gfx/geometry/Quad';
import Triangles from './gfx/geometry/Triangles';
import World from './gfx/World';
import tinycolor2 from 'tinycolor2';
import SolidMaterial from './gfx/material/SolidMaterial';

function toArray(col) {
  let c = col.toRgb();
  return [c.r, c.g, c.b].map(i => i / 255.0);
}

let world = new World();
let w = gl.canvas.width;
let h = gl.canvas.height;
let tri = new Triangles([
  [-1, 0, 0],
  [0, 1.5, 0],
  [1, 0, 0],
]);
let color = tinycolor2("red")
  .spin(Math.random() * 360)
  .desaturate(50);

let p = 5;

let tris = world.createChild()
  .scale([50, 50, 1]);

tris.createChild(tri, new SolidMaterial([1, 1, 1, 1.0]))
  .translate([0, -0.575, 1])
  .scale([2, 2, 1]);

tris.createChild(tri, new SolidMaterial([0, 1, 0, 0.8]))
  .translate([0.5, 0, 5]);

tris.createChild(tri, new SolidMaterial([0, 0, 1, 0.8]))
  .translate([0, -0.5, 10]);

tris.createChild(tri, new SolidMaterial([1, 0, 0, 0.8]))
  .translate([-0.5, 0, 15]);

let renderer = new Renderer();
renderer.setWorld(world);
function render() {
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

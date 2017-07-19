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

let bgTris = world.createChild();
bgTris.translate([-200, -200, 0]);
console.log("here");
for(let i = 0; i < p; i++) {
  for(let j = 0; j < p; j++) {
    let iStep = i*512/p;
    let jStep = j*512/p;
    let c = color.clone()
      .spin((jStep + iStep / 800.0) / Math.PI * 180)
      .darken(25)
      .desaturate(10);
    bgTris.createChild(tri, new SolidMaterial(toArray(c)))
      .translate([iStep, jStep, 0])
      .scale([50, 50, 1]);
    bgTris.createChild(tri, new SolidMaterial(toArray(c)))
      .translate([iStep, jStep, -1])
      .scale([100, 100, 1])
      .rotate(Math.PI, [0, 0, 1]);
  }
}

let tris = world.createChild();
tris.translate([-200, -200, 0]);
for(let i = 0; i < p; i++) {
  for(let j = 0; j < p; j++) {
    let iStep = i*512/p;
    let jStep = j*512/p;
    let c = color.clone()
      .spin((jStep + iStep / 800.0) / Math.PI * 180);
    let rot = (i % 2) == 0 ? Math.PI : 0;
    tris.createChild(tri, new SolidMaterial([...toArray(c), 0.2]))
      .translate([iStep, jStep, 0])
      .scale([50, 50, 1])
      .rotate(rot, [0, 0, 1]);
  }
}

let renderer = new Renderer();
renderer.setWorld(world);
function render() {
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

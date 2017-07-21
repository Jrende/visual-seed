import 'babel-polyfill';
import Renderer from './gfx/Renderer';
import Line from './gfx/geometry/Line';
import Quad from './gfx/geometry/Quad';
import Triangles from './gfx/geometry/Triangles';
import Ring from './gfx/geometry/Ring';
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
  [-1, -0.5, 0],
  [0, 1.0, 0],
  [1, -0.5, 0],
]);

function rnd2() {
  return ((Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random()) - 3) / 3;
}

function createStar(node, color) {
  for(let i = 0; i < 50; i++) {
    node.createChild(tri, new SolidMaterial([...toArray(color), 0.2]))
      .translate([rnd2() * 3, rnd2() * 3, i])
      .rotate(Math.PI * Math.random(), [0, 0, 1])
      .rotate(Math.PI * Math.random(), [0, 1, 0])
      .rotate(Math.PI * Math.random(), [1, 0, 0]);
  }
}

let p = 5;

let tris = world.createChild()
  .scale([50, 50, 1]);

/*
for(let i1 = 0; i1 < 5; i1++) {
  for(let j1 = 0; j1 < 5; j1++) {

    for(let i = 0; i < 50; i++) {
      tris.createChild(tri, new SolidMaterial([...toArray(color2), 0.2]))
        .translate([rnd2() * 2 + i1 * 10 + 1, rnd2() * 2 + j1, i - 50])
        .rotate(2*Math.PI * Math.random(), [0, 0, 1])
        .rotate(2*Math.PI * Math.random(), [0, 1, 0])
        .rotate(2*Math.PI * Math.random(), [1, 0, 0]);
    }
  }
}
*/
let color = tinycolor2("red")
  .spin(Math.random() * 360)
  .desaturate(50);
createStar(tris, color.spin(60));
createStar(tris, color.spin(60));
createStar(tris, color.spin(60));
let ring = world.createChild(new Ring(64, 0.9), new SolidMaterial([...toArray(color.spin(Math.random() * 360)), 1]))
  .scale([150, 150, 1]);
let ring2 = world.createChild(new Ring(64, 0.9), new SolidMaterial([...toArray(color.spin(Math.random() * 360)), 1]))
  .scale([100, 100, 1]);
let ring3 = world.createChild(new Ring(64, 0.9), new SolidMaterial([...toArray(color.spin(Math.random() * 360)), 1]))
  .rotate(Math.PI/2.0, [1, 0, 0])
  .scale([120, 120, 1]);


let renderer = new Renderer();
renderer.setWorld(world);
let i = 0;
function render() {
  window.requestAnimationFrame(render);
  tris.rotate(-0.01, [0, 0, 1]);
  ring.rotate(-0.01, [1, 0, 0]);
  ring2.rotate(-0.01, [0, 1, 0]);
  ring3.rotate(-0.01, [1, 1, 0]);
  renderer.render();
}

render();

import 'babel-polyfill';
import tinycolor2 from 'tinycolor2';
import Renderer from './gfx/Renderer';
import Triangles from './gfx/geometry/Triangles';
import Ring from './gfx/geometry/Ring';
import World from './gfx/World';
import SolidMaterial from './gfx/material/SolidMaterial';

/* global window */

function toArray(col) {
  let c = col.toRgb();
  return [c.r, c.g, c.b].map(i => i / 255.0);
}

let world = new World();
let tri = new Triangles([
  [-1, -0.5, 0],
  [0, 1.0, 0],
  [1, -0.5, 0],
]);

function rnd2() {
  return ((Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random() +
    Math.random()) - 3) / 3;
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
/*
function createGradient(node, color) {
  for(let i = 0; i < 200; i++) {
    node.createChild(tri, new SolidMaterial([...toArray(color.spin((360/200) * i)), 0.2]))
      .translate([Math.random(), Math.random() * i, 0])
      .translate([0, -50, 0])
      .rotate(Math.PI * Math.random(), [1, 0, 0])
      .rotate(Math.PI * Math.random(), [0, 1, 0])
      .rotate(Math.PI * Math.random(), [0, 0, 1]);
  }
}
*/

function createGradient(node, color, size=200, rad=10) {
  for(let i = 0; i < size; i++) {
    let step = i/size;
    node.createChild()
      .rotate(step * (Math.PI * 2), [1, 0, 0])
      .createChild(tri, new SolidMaterial([...toArray(color.spin((360/size) * i)), 0.2]))
      .rotate(Math.PI * Math.random(), [1, 0, 0])
      .rotate(Math.PI * Math.random(), [0, 1, 0])
      .rotate(Math.PI * Math.random(), [0, 0, 1])
      .translate([Math.random() * 4 - 2, rad, Math.random()]);
  }
}

let tris = world.createChild()
  .translate([0, 0, 600])
  .scale([50, 50, 50]);
let color = tinycolor2('red')
  .spin(Math.random() * 360);
let tris1 = tris.createChild();
let tris2 = tris.createChild();
createGradient(tris1, color, 100);
createGradient(tris2, color, 100, 2);
/*
createStar(tris, color.spin(60));
createStar(tris, color.spin(60));
createStar(tris, color.spin(60));
*/

/*
tris.createChild(tri, new SolidMaterial([1.0, 1.0, 1.0, 0.5]))
  .translate([0, 0, -25])
  .scale([2, 2, 1]);
tris.createChild(tri, new SolidMaterial([1.0, 1.0, 1.0, 0.5]))
  .rotate(Math.PI/6.0, [0, 0, 1])
  .translate([0, 0, 25])
  .scale([2, 2, 1]);
let ring3 = world.createChild(new Ring(64, 0.9),
  new SolidMaterial([...toArray(color.spin(Math.random() * 360)), 1]))
  .translate([0, 0, -2])
  .scale([60, 60, 1]);
world.createChild(tri, new SolidMaterial([1.0, 1.0, 1.0, 1.0]));
*/

let renderer = new Renderer();
renderer.setWorld(world);
function render() {
  window.requestAnimationFrame(render);
  //tris.translate([0, 1, 0]);
  tris1.rotate(-0.0025, [1, 0, 0]);
  tris2.rotate(-0.0040, [1, 0, 0]);
  /*
  ring.rotate(-0.01, [1, 0, 0]);
  ring2.rotate(-0.01, [0, 1, 0]);
  */
  renderer.render();
}

render();

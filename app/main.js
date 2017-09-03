import tinycolor2 from 'tinycolor2';
import Renderer from './gfx/Renderer';
import Triangles from './gfx/geometry/Triangles';
import Ring from './gfx/geometry/Ring';
import Line from './gfx/geometry/Line';
import Circle from './gfx/geometry/Circle';
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
let renderer = new Renderer();
Renderer.setBackgroundColor([1, 1, 1]);

//world.translate([0, -100, 0]);
let lines = world.createChild();
for(let i = 0; i < 5; i++) {
  lines.createChild()
    .rotate(30 * i, [0, 0, 1])
    .createChild(new Line([0, 0, 0], [0, 100, 0], 5), new SolidMaterial([0, 0, 0]))
    .translate([25, 50, 0]);
}

let crescent = world.createChild()
  .scale([50, 50, 50])
  .createChild(new Circle(64), new SolidMaterial([0, 0, 0]));
  crescent.createChild(new Circle(64), new SolidMaterial([1, 1, 1]))
  .scale([0.75, 0.75, 0.75])
  .translate([0.2, 0.2, 1]);

renderer.setWorld(world);
function render() {
  crescent.rotate(1, [0, 0, 1]);
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

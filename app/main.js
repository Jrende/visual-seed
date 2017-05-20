import 'babel-polyfill';
import Renderer from './gfx/Renderer';
import Line from './gfx/geometry/Line';
import World from './gfx/World';

let w = new World();
let line = w.createChild();
let lineChild = line.createChild(new Line([100, 100], [150, 200]));
let lineChild2 = line.createChild(new Line([200, 100], [250, 200]));
line.translate([0, -1, 0]);
//line.rotate(45, [0, 0, 1]);
//let list = [...w.iterator()];
//console.log('list: ', list);
let renderer = new Renderer();
renderer.setWorld(w);
function render() {
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

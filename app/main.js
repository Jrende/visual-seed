import Renderer from './gfx/Renderer';
import Line from './gfx/geometry/Line';

let renderer = new Renderer();
renderer.add(new Line([0, 0], [100, 100]));

function render() {
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

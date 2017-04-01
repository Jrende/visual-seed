import LineStrip from './gfx/LineStrip';
import Renderer from './gfx/Renderer';

function getStem(from, to, segments) {
  let list = [];
  for(let i = 0; i < segments; i++) {
    let y = (to[1] - from[1])/segments * i;
    list.push([Math.random() * 50 + from[0], y + from[1], from[2]]);
  }
  list.push(to);
  return list;
}

function generateField(num = 20, radius = 1000) {
  let field = [];
  for(let i = 0; i < num; i++) {
    let pos = [Math.random() * radius, 0, -Math.random() * radius];

    let stemHeight = Math.random() * 150;
    let stem = new LineStrip(getStem(
      [pos[0], pos[1] + 0, pos[2]],
      [pos[0], pos[1] + stemHeight, pos[2]], 4), 4);
    let petalLines = [
      [0, 0, 0],
      [50, 50, 0],
      [-50, 50, 0],
      [0, 0, 0],
      [50, 50, 0]];
    let petal = new LineStrip(petalLines.map(line => [
      line[0] + pos[0],
      line[1] + stemHeight + pos[1],
      line[2] + pos[2]
    ]), 4);
    field.push(stem, petal);
  }
  return field;
}

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

let items = generateField(20, 800);
items.forEach(item => renderer.add(item));
function render() {
  window.requestAnimationFrame(render);
  renderer.render();
  //renderer.renderQuad(shaders.gradient);
}

render();

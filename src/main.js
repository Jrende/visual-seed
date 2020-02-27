/* eslint-disable no-unused-vars */
import tinycolor from 'tinycolor2';

import Renderer from './gfx/Renderer';
import Triangles from './gfx/geometry/Triangles';
import Quad from './gfx/geometry/Quad';
import Ring from './gfx/geometry/Ring';
import LineStrip from './gfx/geometry/LineStrip';
import Line from './gfx/geometry/Line';
import Circle from './gfx/geometry/Circle';
import Rectangle from './gfx/geometry/Rectangle';
import World from './gfx/World';
import SolidMaterial from './gfx/material/SolidMaterial';
import TextureMaterial from './gfx/material/TextureMaterial';
import Bezier from './gfx/geometry/Bezier';
import tex1 from './assets/tex1.png';
import tex2 from './assets/tex2.png';
import tex1Alpha from './assets/tex1_alpha.png';

/* global window */
let world = new World();
let renderer = new Renderer();
let c = tinycolor('#f00').spin(360 * Math.random()).darken().desaturate(80);
Renderer.setBackgroundColor(c);

console.log('tex1: ', tex1);
console.log('tex2: ', tex2);

let crescent = world.createChild()
  .scale(1)
  .createChild(
    new Rectangle([0, 0, -1], 64, 64),
    new TextureMaterial(tex2))
  .createChild(
    new Rectangle([0, 0, 0], 64, 64),
    new TextureMaterial(tex1Alpha));

renderer.setWorld(world);
function render() {
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

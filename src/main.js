/* eslint-disable no-unused-vars */
import tinycolor from 'tinycolor2';

import Renderer from './gfx/Renderer';
import World from './gfx/World';

import Triangles from './gfx/geometry/Triangles';
import Quad from './gfx/geometry/Quad';
import Ring from './gfx/geometry/Ring';
import LineStrip from './gfx/geometry/LineStrip';
import Line from './gfx/geometry/Line';
import Circle from './gfx/geometry/Circle';
import Rectangle from './gfx/geometry/Rectangle';
import Bezier from './gfx/geometry/Bezier';

import SolidMaterial from './gfx/material/SolidMaterial';
import TextureMaterial from './gfx/material/TextureMaterial';
import CloudMaterial from './gfx/material/CloudMaterial';
import CheckerMaterial from './gfx/material/CheckerMaterial';

import tex1 from './assets/tex1.png';
import tex2 from './assets/tex2.png';
import checkers from './assets/checkers.png';
import tex1Alpha from './assets/tex1_alpha.png';

/* global window */
let world = new World();
let renderer = new Renderer();
let c = tinycolor('#f00').spin(360 * Math.random()).darken().desaturate(80);
Renderer.setBackgroundColor(c);

console.log('tex1: ', tex1);
console.log('tex2: ', tex2);

world.createChild(
  new Circle(64),
  new CloudMaterial([0.2, 0.3, 0.5]))
  .translate([0, 0, 2])
  .scale(100);

world.createChild()
  .createChild(
    new Rectangle([0, 0, -1], 60, 60),
    new CheckerMaterial([0, 0, 0], [1, 1, 1, 0.5]))
  .scale(1000);

/*

world.createChild()
  .scale(1)
  .createChild(
    new Rectangle([0, 0, -1], 64, 64),
    new SolidMaterial([0.2, 0.3, 0.5]))
  .createChild(
    new Rectangle([0, 0, 0], 64, 64),
    new TextureMaterial(tex1Alpha));

let circle = world.createChild()
  .scale(100)
  .createChild(
    new Circle(64),
    new TextureMaterial(tex1Alpha))
  .translate([0, 0, 1]);
*/

function render() {
  window.requestAnimationFrame(render);
  renderer.render(world);
}

render(world);

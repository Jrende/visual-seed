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
import GradientMaterial from './gfx/material/GradientMaterial';

import { Blur } from './gfx/postprocessors/Blur';
import { RemoveRed } from './gfx/postprocessors/RemoveRed';
import { RemoveGreen } from './gfx/postprocessors/RemoveGreen';
import { RemoveBlue } from './gfx/postprocessors/RemoveBlue';

import { random } from './Random';

import tex1 from './assets/tex1.png';
import tex2 from './assets/tex2.png';
import tex1Alpha from './assets/tex1_alpha.png';
function createRingThing(child, color, pos, size) {
  let outerRing = child.createChild(
    new Ring(64, 0.95),
    new SolidMaterial(color))
    .translate(pos)
    .scale(size);

  let num = 16;
  for(let i = 0; i < num; i++) {
    let rot = i / num * Math.PI * 2 + random.nextFloat();
    let outerCircle = outerRing.createChild(
      new Circle(16),
      new SolidMaterial(color))
      .translate([
        Math.sin(rot),
        Math.cos(rot),
        0
      ])
      .scale(0.1)
      .rotate(-rot, [0, 0, 1]);
    outerCircle.createChild(
      new Line([0, 0, 0], [0, 1000, 0], 0.1),
      new SolidMaterial(color))
    .translate([0, 0, -1.0]);
  }
}

function createWorld(foreground, background) {
  let c = tinycolor('#f00').spin(360 * random.nextFloat()).darken(20).desaturate(20);
  background.createChild(
    new Quad(),
    new GradientMaterial([
      {
        color: '#9aa36f',
        position: 0.0
      },
      {
        color: c,
        position: 1.0
      }
    ]))
    .scale([256, 256, 1])
    .rotateDeg(random.nextFloat() * 360)
    .translate([0, 0, 0.2]);
  let fgChild = foreground.createChild().translate([0, 0, 1.5])
  let bgChild = background.createChild().translate([0, 0, 1.5])
  createRingThing(fgChild,
    1.0,
    [
      (random.nextFloat() - 0.5) * 50,
      (random.nextFloat() - 0.5) * 50,
      2.6
    ],
    100);
  createRingThing(bgChild,
    0.7,
    [
      (random.nextFloat() - 0.5) * 200,
      (random.nextFloat() - 0.5) * 200,
      0.0
    ],
    25);

  background.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#fff'))
  .translate([-400, -200, 2.0])
  .scale(300);
  background.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#fff'))
  .translate([200, 100, 2.0])
  .scale(300);

  for(let i = 0; i < 100; i++) {
    let dot = background.createChild(
      new Circle(),
      new SolidMaterial('#fff')
    )
    .scale((random.nextFloat() + 0.5))
      .translate([
        (random.nextFloat() - 0.5) * 500,
        (random.nextFloat() - 0.5) * 500,
        10
      ]);
    if(random.nextFloat() < 0.1) {
      let lines = dot
        .createChild(
        new Line(
          [-1000, 0, 0],
          [1000, 0, 0],
          0.1
        ),
        new SolidMaterial('#fff')
        ).rotateDeg(360 * random.nextFloat())
        .createChild(
          new Line(
            [0, -1000, 0],
            [0, 1000, 0],
            0.1
          ),
          new SolidMaterial('#fff')
        );
    }
  }
}

/* global window */
let renderer = new Renderer();
renderer.setBackgroundColor('#000');

/*
renderer.addPostProcessing(new RemoveRed());
renderer.addPostProcessing(new RemoveBlue());
renderer.addPostProcessing(new RemoveGreen());
*/

let foregroundPostprocessing = [new Blur(1.75)];
let backgroundPostprocessing = [new Blur(0.75)];
//let backgroundPostprocessing = [];
//let pp = [];

let foreground = new World();
let background = new World();
createWorld(foreground, background);
render();
document.querySelector('canvas').addEventListener('click', () => {
  random.setSeed(Math.random());
  foreground = new World();
  background = new World();
  createWorld(foreground, background);
  render();
});

function render() {
  renderer.render(background, foregroundPostprocessing);
  renderer.render(foreground, backgroundPostprocessing);
  renderer.present();
}
/*
function render() {
  window.requestAnimationFrame(render);
  renderer.render(world, pp);
}

render(world);
*/

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

import tex1 from './assets/tex1.png';
import tex2 from './assets/tex2.png';
import tex1Alpha from './assets/tex1_alpha.png';

class RNG {
  // LCG using GCC's constants
  constructor(seed) {
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;

    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }
  nextInt() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  nextFloat() {
    // returns in range [0,1]
    return this.nextInt() / (this.m - 1);
  }
  nextRange(start, end) {
    // returns in range [start, end): including start, excluding end
    // can't modulu nextInt because of weak randomness in lower bits
    var rangeSize = end - start;
    var randomUnder1 = this.nextInt() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  choice(array) {
    return array[this.nextRange(0, array.length)];
  }
}
let rng = new RNG(Math.random());
function random() {
  return rng.nextFloat();
}

function createRingThing(child, color, pos, size) {
  let outerRing = child.createChild(
    new Ring(64, 0.95),
    new SolidMaterial(color))
    .translate(pos)
    .scale(size);

  let num = 16;
  for(let i = 0; i < num; i++) {
    let rot = i / num * Math.PI * 2 + random();
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

function createWorld() {
  let c = tinycolor('#f00').spin(360 * random()).darken(20).desaturate(20);
  world.createChild(
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
    .rotateDeg(random() * 360)
    .translate([0, 0, 0.2]);
  let child = world.createChild().translate([0, 0, 1.5])
  createRingThing(child,
    1.0,
    [
      (random() - 0.5) * 50,
      (random() - 0.5) * 50,
      2.6
    ],
    100);
  createRingThing(child,
    0.7,
    [
      (random() - 0.5) * 200,
      (random() - 0.5) * 200,
      0.0
    ],
    25);

  world.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#fff'))
  .translate([-400, -200, 2.0])
  .scale(300);
  world.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#fff'))
  .translate([200, 100, 2.0])
  .scale(300);

  for(let i = 0; i < 100; i++) {
    let dot = world.createChild(
      new Circle(),
      new SolidMaterial('#fff')
    )
    .scale((random() + 0.5))
      .translate([
        (random() - 0.5) * 500,
        (random() - 0.5) * 500,
        10
      ]);
    if(random() < 0.1) {
      let lines = dot
        .createChild(
        new Line(
          [-1000, 0, 0],
          [1000, 0, 0],
          0.1
        ),
        new SolidMaterial('#fff')
        ).rotateDeg(360 * random())
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
Renderer.setBackgroundColor('#fff');

/*
renderer.addPostProcessing(new RemoveRed());
renderer.addPostProcessing(new RemoveBlue());
renderer.addPostProcessing(new RemoveGreen());
*/

let pp = [new Blur(0.75)];

let world = new World();
createWorld();

//renderer.render(world);

document.querySelector('canvas').addEventListener('click', () => {
  rng = new RNG(Math.random());
  world = new World();
  createWorld();
  renderer.render(world, pp);
});

function render() {
  window.requestAnimationFrame(render);
  renderer.render(world, pp);
}

render(world);

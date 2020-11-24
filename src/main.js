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
    let rot = i / num * Math.PI * 2 + Math.random();
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
  let c = tinycolor('#f00').spin(360 * Math.random()).darken().desaturate(20);
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
    .rotateDeg(Math.random() * 360)
    .translate([0, 0, 0.2]);

  let child = world.createChild().translate([0, 0, 1.5])
  createRingThing(child,
    0.0,
    [
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      2.6
    ],
    100);
  createRingThing(child,
    0.3,
    [
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      0.0
    ],
    25);

  world.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#000'))
  .translate([-400, -200, 2.0])
  .scale(300);
  world.createChild(
    new Ring(64, 0.997),
    new SolidMaterial('#000'))
  .translate([200, 100, 2.0])
  .scale(300);

  for(let i = 0; i < 100; i++) {
    let dot = world.createChild(
      new Circle(),
      new SolidMaterial('#000')
    )
    .scale((Math.random() + 0.5))
      .translate([
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 500,
        10
      ]);
    if(Math.random() < 0.1) {
      let lines = dot
        .createChild(
        new Line(
          [-1000, 0, 0],
          [1000, 0, 0],
          0.1
        ),
        new SolidMaterial('#000')
        ).rotateDeg(360 * Math.random())
        .createChild(
          new Line(
            [0, -1000, 0],
            [0, 1000, 0],
            0.1
          ),
          new SolidMaterial('#000')
        );
    }
  }
}

/* global window */
let renderer = new Renderer();
Renderer.setBackgroundColor('#fff');

/*
let a = world.createChild()
  .scale([gl.canvas.width, gl.canvas.height, 1])
  .translate([0, 0, 0.1]);

let b = a.createChild(
  new Quad(),
  //new SolidMaterial('#000'))
  new GradientMaterial([
    {
      color: '#000000ff',
      position: 0.0
    },
    {
      color: '#00000000',
      position: 1.0
    }
  ]))
  .scale([0.09, 0.09, 1.0])
  .translate([0, 0, 1.1]);
*/

renderer.addPostProcessing(new Blur(10));

let world = new World();
createWorld();

renderer.render(world);

document.querySelector('canvas').addEventListener('click', () => {
  world = new World();
  createWorld();
  renderer.render(world);
});
console.log('tex1: ', tex1);
console.log('tex2: ', tex2);
/*

function render() {
  window.requestAnimationFrame(render);
  renderer.render(world);
}
*/

//render(world);

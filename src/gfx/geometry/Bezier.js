import * as Bezierjs from 'bezier-js';
import LineStrip from './LineStrip';

export default class Bezier {
  constructor(coords, steps = 100, width = 5) {
    this.coords = coords;
    this.steps = steps;
    this.width = width;
    console.log('here');

    let bez = new Bezierjs(...coords);
    let points = bez.getLUT(steps);
    let lines = points.map(p => [p.x, p.y]);
    this.lineStrip = new LineStrip(lines, width);
  }

  addToWorld(world, material) {
    world.createChild(this.lineStrip, material);
  }
}

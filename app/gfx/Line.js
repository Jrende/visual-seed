import * as glm from 'gl-matrix';
import {degToRad} from './Utils.js';

function calculateModelMatrix(line) {
  let midpoint = [
    (line.to[0]+line.from[0]),
    (line.to[1]+line.from[1]),
    (line.to[2]+line.from[2])
  ].map(i => i/2.0);
  let p = [
    line.to[0] - line.from[0],
    line.to[1] - line.from[1],
    line.to[2] - line.from[2]
  ]
  let len = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
  let angle = -Math.atan(p[1]/p[0]);

  glm.mat4.identity(line.mat);
  glm.mat4.translate(line.mat, line.mat, midpoint);
  glm.mat4.rotateZ(line.mat, line.mat, angle);
  glm.mat4.scale(line.mat, line.mat, [line.width, len/2.0, 1]);
}

export default class Line {
  constructor(from, to, width = 50) {
    this.from = from;
    this.to = to;
    this.width = width;
    this.mat = glm.mat4.create();
    if(from.length === 2) {
      from[2] = 0.0;
    }
    if(to.length === 2) {
      to[2] = 0.0;
    }
    calculateModelMatrix(this);
  }

  getModelMatrix() {
    return this.mat
  }
}

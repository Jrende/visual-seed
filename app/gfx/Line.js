import * as glm from 'gl-matrix';
import {degToRad} from './Utils.js';

export default class Line {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.mat = glm.mat4.create();
    /*
    glm.mat4.fromScaling(this.mat, [100, 100, 100]);
    glm.mat4.translate(this.mat, this.mat, [500, 500, 0]);
    glm.mat4.rotateZ(this.mat, this.mat, degToRad(45));
    */
  }

  getModelMatrix() {
    return this.mat;
  }
}

import * as glm from 'gl-matrix';
import {Instance} from './Mesh.js';
import {degToRad} from './Utils.js';

/*
function calculateModelMatrix(transform) {
  glm.mat4.identity(transform.mat);

  glm.mat4.translate(transform.mat, transform.mat, transform.pos);

  let rotMat = glm.mat4.create();
  glm.mat4.fromQuad(rotMat, transform.rotation);
  glm.mat4.mul(transform.mat, transform.mat, angle);

  glm.mat4.scale(transform.mat, transform.mat, transform.scaleValue);
}
*/

export default class Transform {
  constructor() {
    this.mat = glm.mat4.create();
  }

  setPosition(v) {
    this.mat[12] = v[0];
    this.mat[13] = v[1];
    this.mat[14] = v[2];
  }

  identity() {
    this.mat = glm.mat4.create();
  }


  translate(vec3) {
    glm.mat4.translate(this.mat, this.mat, vec3);
  }

  scale(vec3) {
    glm.mat4.scale(this.mat, this.mat, vec3);
  }

  rotateQuat(quat) {
  }

  setRotation(angle, axis) {
    let quat = glm.quat.create();
    glm.quat.setAxisAngle(quat, axis, angle);
    let rotMat = glm.mat4.create();
    glm.mat4.fromQuat(rotMat, quat);
    glm.mat4.mul(this.mat, this.mat, rotMat);
  }

  getModelMatrix() {
    return this.mat;
  }
}

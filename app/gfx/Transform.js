import * as glm from 'gl-matrix';

function calculateModelMatrix(transform) {
  glm.mat4.identity(transform.mat);

  glm.mat4.translate(transform.mat, transform.mat, transform.pos);

  let rotMat = glm.mat4.create();
  glm.mat4.fromQuat(rotMat, transform.rot);
  glm.mat4.mul(transform.mat, transform.mat, rotMat);

  glm.mat4.scale(transform.mat, transform.mat, transform.scaleValue);
}

export default class Transform {
  constructor() {
    this.mat = glm.mat4.create();
    this.pos = [0, 0, 0];
    this.scaleValue = [1, 1, 1];
    this.rot = glm.quat.create();
  }

  setPosition(pos) {
    this.pos = pos;
    calculateModelMatrix(this); 
  }

  setScale(scale) {
    this.scaleValue = scale;
    calculateModelMatrix(this); 
  }

  identity() {
    this.mat = glm.mat4.create();
  }

  translate(vec3) {
    this.pos[0] += vec3[0];
    this.pos[1] += vec3[1];
    this.pos[2] += vec3[2];
    calculateModelMatrix(this); 
  }

  scale(vec3) {
    this.scaleValue[0] *= vec3[0];
    this.scaleValue[1] *= vec3[1];
    this.scaleValue[2] *= vec3[2];
    calculateModelMatrix(this); 
  }

  setRotation(angle, axis) {
    glm.quat.setAxisAngle(this.rot, axis, angle);
    calculateModelMatrix(this); 
  }

  getModelMatrix() {
    return this.mat;
  }
}

import shader from './gfx/shader';
import VertexArray from './gfx/VertexArray';
import * as glm from 'gl-matrix';
import Line from './gfx/Line';
import {degToRad} from './gfx/Utils.js';

let [width, height] = [gl.canvas.width, gl.canvas.height];
console.log('shader', shader);
const quad = new VertexArray(
[1, 1, 1,
-1, 1, 1,
-1, -1, 1,
1, -1, 1],
[0, 1, 2,
 0, 2, 3],
[3]);

gl.clearColor(0, 0, 0, 1);
let viewMatrix = glm.mat4.create();
let projectionMatrix = glm.mat4.create();
//glm.mat4.ortho(projectionMatrix, 0, width, 0, height, 0.1, 100);
//glm.mat4.ortho(projectionMatrix, 1, -1, -1, 1, 0.1, 100);
glm.mat4.ortho(projectionMatrix, width/2, -width/2, -height/2, height/2, 0.1, 100);
//glm.mat4.perspective(projectionMatrix, 90, width/height, 0.1, 100);

let line = new Line([0, 0], [1, 2]);

let modelMatrix = glm.mat4.create();
//glm.mat4.rotateX(modelMatrix, modelMatrix, degToRad(180));
glm.mat4.scale(modelMatrix, modelMatrix, [100, 100, 1]);
glm.mat4.translate(viewMatrix, viewMatrix, [0, 0, -10]);

  //glm.mat4.rotateY(modelMatrix, modelMatrix, 0.01);
gl.disable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  let mvp = glm.mat4.create();
  glm.mat4.multiply(mvp, mvp, projectionMatrix);
  glm.mat4.multiply(mvp, mvp, viewMatrix);
  //glm.mat4.rotateZ(modelMatrix, modelMatrix, 0.1);
  //glm.mat4.rotateX(modelMatrix, modelMatrix, degToRad(2));
  glm.mat4.multiply(mvp, mvp, modelMatrix);

  shader.solid.bind(gl);
  shader.solid.uniforms.r = 0.5;
  shader.solid.uniforms.g = 0.5;
  shader.solid.uniforms.b = 1.5;
  shader.solid.uniforms.alpha = 1.0;
  shader.solid.uniforms.mvp = mvp;
  quad.bind();
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(render);
}
render();
window.requestAnimationFrame(render);


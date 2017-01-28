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
window.to = [50, 50]
let line = new Line([0, 0], window.to, 5);

let modelMatrix = glm.mat4.create();
//glm.mat4.rotateX(modelMatrix, modelMatrix, degToRad(180));
glm.mat4.scale(modelMatrix, modelMatrix, [100, 100, 1]);
glm.mat4.translate(viewMatrix, viewMatrix, [0, 0, -10]);

  //glm.mat4.rotateY(modelMatrix, modelMatrix, 0.01);
gl.disable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
function drawPoint(x, y) {
  let mvp2 = glm.mat4.create();
  glm.mat4.multiply(mvp2, mvp2, projectionMatrix);
  glm.mat4.multiply(mvp2, mvp2, viewMatrix);
  let scale = glm.mat4.create();
  glm.mat4.translate(scale, scale, [x, y, 0]);
  glm.mat4.multiply(mvp2, mvp2, scale);

  shader.solid.bind(gl);
  shader.solid.uniforms.r = 1.0;
  shader.solid.uniforms.g = 1.0;
  shader.solid.uniforms.b = 1.0;
  shader.solid.uniforms.alpha = 1.0;
  shader.solid.uniforms.mvp = mvp2;
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  quad.bind();

  let mvp = glm.mat4.create();
  glm.mat4.multiply(mvp, mvp, projectionMatrix);
  glm.mat4.multiply(mvp, mvp, viewMatrix);
  glm.mat4.multiply(mvp, mvp, line.getModelMatrix());

  shader.solid.bind(gl);
  shader.solid.uniforms.r = 0.5;
  shader.solid.uniforms.g = 0.5;
  shader.solid.uniforms.b = 1.5;
  shader.solid.uniforms.alpha = 1.0;
  shader.solid.uniforms.mvp = mvp;
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

  drawPoint(window.to[0], window.to[1])
  drawPoint(0, 0)
  window.requestAnimationFrame(render);
}
render();
window.requestAnimationFrame(render);


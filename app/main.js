import VertexArray from './gfx/VertexArray';
import * as glm from 'gl-matrix';
import Line from './gfx/Line';
import {degToRad} from './gfx/Utils.js';
import Renderer from './gfx/Renderer.js';
import {Mesh} from './gfx/Mesh.js';

let renderer = new Renderer();
let a = [0, 0];
let b = [50, 50];
let c = [50, -50];
renderer.add(new Line(a, b, 5));
renderer.add(new Line(b, c, 5));
renderer.add(new Line(c, a, 5));
/*
renderer.add(new LineSegment(
  [
    [0, 0],
    [50, 150],
    [200, 50],
    [70, 345]
  ]
));
*/

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
  window.requestAnimationFrame(render);
  renderer.render();
}

render();

import shader from './shader';
import VertexArray from './VertexArray.js';

console.log('shader', shader);
const quad = new VertexArray(
[1, 1,
-1, 1,
-1, -1,
1, -1],
[0, 1, 2],
[2]);

gl.clearColor(0, 0, 0, 1);
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  shader.solid.bind(gl);
  shader.solid.uniforms.r = 1.0;
  shader.solid.uniforms.g = 0.0;
  shader.solid.uniforms.b = 1.0;
  shader.solid.uniforms.alpha = 1.0;
  quad.bind();
  gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);


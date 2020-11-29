import VertexArray from '../VertexArray';
import getShader from '../shader';

let quad = new VertexArray(
  [
     1, 1, 1, 1,
    -1, 1, 0, 1,
    -1, -1,0, 0,
     1, -1, 1, 0
  ],
  [1, 0, 2,
    2, 0, 3],
  [2, 2]);
export class PostProcessor {
  constructor(shader) {
    this.shader = shader;
    this.quad = quad;
    this.textureShader = getShader('texture');
  }

  show(texture) {
    /*
    this.textureShader.bind();
    this.quad.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.textureShader.setSampler2D('sampler', 0);
    this.textureShader.setFloat('opacity', 1.0);
    this.quad.draw();
    this.quad.unbind();
    this.textureShader.unbind();
    */
  }
}

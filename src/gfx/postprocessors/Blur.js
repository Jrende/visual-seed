import { PostProcessor } from './PostProcessor';

import getShader from '../shader';

export class Blur extends PostProcessor{
  constructor(amount) {
    super(getShader('blur'));
    this.amount = amount;
  }

  apply(buffer) {

    this.shader.bind();
    this.quad.bind();
    buffer.bind()
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, buffer.back.texture);
    this.shader.setSampler2D('texture', 0);
    this.shader.setFloat('resolution', 1024);
    this.shader.setFloat('radius', this.amount);
    this.shader.setVec2('dir', [0, 1]);
    this.shader.setVec3('color', [1.0, 1.0, 1.0]);
    this.quad.draw();
    buffer.unbind();
    this.quad.unbind();
    this.shader.unbind();

    this.shader.bind();
    this.quad.bind();
    buffer.bind()
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, buffer.back.texture);
    this.shader.setSampler2D('texture', 0);
    this.shader.setFloat('resolution', 1024);
    this.shader.setFloat('radius', this.amount);
    this.shader.setVec2('dir', [1, 0]);
    this.shader.setVec3('color', [1.0, 1.0, 1.0]);
    this.quad.draw();
    buffer.unbind();
    this.quad.unbind();
    this.shader.unbind();

  }
}


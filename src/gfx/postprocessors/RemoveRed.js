import { PostProcessor } from './PostProcessor';

import getShader from '../shader';

export class RemoveRed extends PostProcessor{
  constructor(amount) {
    super(getShader('removeRed'));
  }

  apply(buffer) {
    this.shader.bind();
    this.quad.bind();
    buffer.bind()
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, buffer.back.texture);
    this.shader.setSampler2D('sampler', 0);
    this.quad.draw();
    buffer.unbind();
    this.quad.unbind();
    this.shader.unbind();
  }
}


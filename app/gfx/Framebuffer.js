/* global gl */

export default class Framebuffer {
  constructor(width, height) {
    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffer = framebuffer;
    this.texture = texture;
    this.width = width;
    this.height = height;
  }

  bind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

/* global gl */

function initTexture(width, height, format, attachment) {
  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, format, gl.UNSIGNED_BYTE, null);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, gl.TEXTURE_2D, texture, 0);

  return texture;
}

function initRenderBuffer(width, height, component, attachment) {
  const renderBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
  gl.renderbufferStorage(gl.RENDERBUFFER, component, width, height);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBuffer);
  return renderBuffer;
}

//gl.DEPTH_COMPONENT16
//gl.DEPTH_ATTACHMENT
export class Framebuffer {
  constructor(width, height, withStencil = false, withDepth = false) {
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

    this.texture = initTexture(width, height, gl.RGBA, gl.COLOR_ATTACHMENT0);

    if(withDepth) {
      this.depth = initRenderBuffer(width, height, gl.DEPTH_COMPONENT16, gl.DEPTH_ATTACHMENT);
    }

    if (withStencil) {
      this.stencilBuffer = initRenderBuffer(
        width,
        height,
        gl.STENCIL_INDEX8,
        gl.STENCIL_ATTACHMENT);
    }
    gl.viewport(0, 0, width, height);
    let status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error("Error creating framebuffer, got status", status);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.framebuffer = framebuffer;
    this.width = width;
    this.height = height;
  }

  bind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.framebuffer.texture,
      0);
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  renderTo(renderCmd) {
    this.bind();
    renderCmd();
    this.unbind();
    return this;
  }
}

export class Doublebuffer {
  constructor(width, height, withStencil = false, withDepth = false) {
    this.state = false;
    this.front = new Framebuffer(width, height, withStencil, withDepth);
    this.back = new Framebuffer(width, height, withStencil, withDepth);
    this.clearBits = gl.COLOR_BUFFER_BIT
    if(withDepth) {
      this.clearBits |= gl.DEPTH_BUFFER_BIT;
    }
  }


  bind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.front.framebuffer);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      this.front.texture,
      0);
  }

  unbind() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    this.flip();
  }

  flip() {
    let temp = this.front;
    this.front = this.back;
    this.back = temp;
    this.state = !this.state;
  }

  getTexture() {
    return this.back.texture;
  }

  renderTo(renderCmd) {
    this.bind();
    renderCmd();
    this.unbind();
    return this;
  }

  clear() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.front.framebuffer);
    gl.clear(this.clearBits);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.back.framebuffer);
    gl.clear(this.clearBits);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
}

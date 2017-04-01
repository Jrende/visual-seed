import VertexArray from './VertexArray';
import * as glm from 'gl-matrix';
import shader from './shader';
import Framebuffer from './Framebuffer';
import { degToRad } from './Utils';


/* global gl */
class Renderer {
  constructor() {
    gl.enable(gl.BLEND);
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();
    this.drawMap = new Map();
    let [width, height] = [gl.canvas.width, gl.canvas.height];
    gl.clearColor(0, 0, 0, 1);
    glm.mat4.rotate(this.viewMatrix, this.viewMatrix, degToRad(45), [1, 0, 0]);
    glm.mat4.translate(this.viewMatrix, this.viewMatrix, [-512, -200, -200]);
    //glm.mat4.ortho(this.projectionMatrix, width/2, -width/2, -height/2, height/2, 0.1, 100);
    glm.mat4.perspective(this.projectionMatrix, 90, width/height, 0.1, 1000);

    this.width = width;
    this.height = height;
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this.buffers = [new Framebuffer(width, height, true), new Framebuffer(width, height, true)];
    this.bloomBuffers = [new Framebuffer(width, height), new Framebuffer(width, height)];
    this.stencilBuffer = new Framebuffer(width, height);
    this.testBuffer = [
      new Framebuffer(width, height),
      new Framebuffer(width, height),
      new Framebuffer(width, height)
    ];
    this.quad = new VertexArray(
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [0, 1, 2,
        0, 2, 3],
      [3]);
    this.uvVertArray = new VertexArray([
      1.0, 1.0, 1.0, 1.0,
      -1.0, 1.0, 0.0, 1.0,
      -1.0, -1.0, 0.0, 0.0,
      1.0, -1.0, 1.0, 0.0
    ], [0, 1, 2, 0, 2, 3], [2, 2]);
    this.drawMap.set(this.quad, []);

    this.generateClipBuffer();
  }

  add(item) {
    switch(item.constructor.name) {
      case 'Line':
        this.addLine(item);
        break;
      case 'LineStrip':
        item.lines.forEach(line => {
          this.addLine(line);
        });
        item.getJoins().forEach(join => {
          this.addJoin(join);
        });
        break;
      default:
    }
  }

  addJoin(join) {
    let arr = join.reduce((acc, val) => {
      val.forEach((v) => acc.push(v));
      return acc;
    }, []);
    this.drawMap.set(new VertexArray(arr, [0, 1, 2], [3]), [{
      getModelMatrix: glm.mat4.create
    }]);
  }

  addLine(item) {
    this.drawMap.get(this.quad).push(item);
  }

  drawPoint(vec, scale=2) {
    this.quad.bind();
    let vp = glm.mat4.create();
    glm.mat4.multiply(vp, vp, this.projectionMatrix);
    glm.mat4.multiply(vp, vp, this.viewMatrix);

    let modelMat = glm.mat4.create();
    glm.mat4.translate(modelMat, modelMat, vec);
    glm.mat4.scale(modelMat, modelMat, [scale, scale, 1]);

    glm.mat4.multiply(vp, vp, modelMat);

    shader.solid.bind();
    shader.solid.uniforms.r = 1.0;
    shader.solid.uniforms.g = 1.0;
    shader.solid.uniforms.b = 1.0;
    shader.solid.uniforms.alpha = 1.0;
    shader.solid.uniforms.mvp = vp;
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  renderQuad(quadShader) {
    quadShader.bind();
    this.quad.bind();
    quadShader.uniforms.resolution = [this.width, this.height];
    quadShader.uniforms.size = 1.0;
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    quadShader.unbind();
  }

  render() {
    this.buffers[0].renderTo(() => this.renderScene());
    this.buffers[1].renderTo(() => this.renderReflection());
    this.generateBloomBuffers(4.0, [1.0, 1.0, 1.0]);
    this.present();
  }

  renderReflection() {
    gl.enable(gl.STENCIL_TEST);
    gl.colorMask(false, false, false, false);
    gl.stencilFunc(gl.NEVER, 1, 0xFF);
    gl.stencilOp(gl.REPLACE, gl.KEEP, gl.KEEP);

    gl.stencilMask(0xFF);
    gl.clear(gl.STENCIL_BUFFER_BIT);

    shader.discard.bind();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.stencilBuffer.texture);
    shader.discard.uniforms.texture = 0;
    shader.discard.limit = 0.8;

    this.uvVertArray.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.uvVertArray.unbind();

    shader.discard.unbind();

    gl.colorMask(true, true, true, true);
    gl.stencilMask(0x00);
    gl.stencilFunc(gl.EQUAL, 1, 0xFF);
    let invMat = glm.mat4.create();
    invMat[5] = -1;
    glm.mat4.mul(this.viewMatrix, this.viewMatrix, invMat);
    this.renderScene();
    glm.mat4.mul(this.viewMatrix, this.viewMatrix, invMat);
    gl.disable(gl.STENCIL_TEST);
  }

  generateBloomBuffers(blurAmount = 2.0, color = [1.0, 1.0, 1.0]) {
    this.bloomBuffers[1].renderTo(() => {
      this.blur([0.0, 1.0], blurAmount, color, this.buffers[0].texture);
    });
    this.bloomBuffers[0].renderTo(() => {
      this.blur([1.0, 0.0], blurAmount, color, this.bloomBuffers[1].texture);
    });
  }

  generateClipBuffer() {
    this.testBuffer[0].renderTo(() => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      let s = shader.cloud;
      s.bind();
      s.uniforms.res = [this.width, this.height];
      s.uniforms.seed = Math.random();
      s.uniforms.size = 100.0;
      s.uniforms.depth = 1.0;
      s.uniforms.nabla = 1.0;
      s.uniforms.alpha = 1.0;

      s.uniforms.r = 1.0;
      s.uniforms.g = 1.0;
      s.uniforms.b = 1.0;

      this.uvVertArray.bind();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      this.uvVertArray.unbind();
      s.unbind();
    });

    this.testBuffer[1].renderTo(() => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      let g = shader.gradient;
      g.bind();
      g.uniforms.resolution = [this.width, this.height];
      g.uniforms.size = 0.5;

      this.uvVertArray.bind();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      this.uvVertArray.unbind();
      g.unbind();
    });
    this.testBuffer[2].renderTo(() => {
      this.blend(this.testBuffer[0].texture, this.testBuffer[1].texture);
    });

    this.stencilBuffer.renderTo(() => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      let clamp = shader.clamp;
      clamp.bind();
      clamp.uniforms.limit = 0.4;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.testBuffer[2].texture);
      clamp.uniforms.sampler = 0;

      this.uvVertArray.bind();
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      this.uvVertArray.unbind();
      clamp.unbind();
    });
  }

  renderScene() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.solid.bind();
    this.drawMap.forEach((instances, vertexArray) => {
      vertexArray.bind();

      let vp = glm.mat4.create();
      let len = vertexArray.indexData.length;
      glm.mat4.multiply(vp, vp, this.projectionMatrix);
      glm.mat4.multiply(vp, vp, this.viewMatrix);
      instances.forEach(instance => {
        let mvp = glm.mat4.create();
        glm.mat4.multiply(mvp, vp, instance.getModelMatrix());

        shader.solid.uniforms.r = 0.2;
        shader.solid.uniforms.g = 0.5;
        shader.solid.uniforms.b = 0.1;
        shader.solid.uniforms.alpha = 0.1;
        shader.solid.uniforms.mvp = mvp;
        gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
      });
      vertexArray.unbind();
    });
    shader.solid.unbind();
  }

  blur(dir, radius, color, texture) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    let blur = shader.blur;
    blur.bind();
    this.quad.bind();
    blur.uniforms.resolution = this.width;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    blur.uniforms.texture = texture;
    blur.uniforms.radius = radius;
    blur.uniforms.dir = dir;
    blur.uniforms.color = color;

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    blur.unbind();
  }

  present() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    //this.drawTexture(this.stencilBuffer.texture);
    gl.blendFunc(gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_DST_COLOR);
    this.blend(this.buffers[0].texture, this.bloomBuffers[0].texture);
    this.blend(this.buffers[1].texture, this.bloomBuffers[1].texture);
  }

  blend(left, right) {
    shader.blend.bind();

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, left);
    shader.blend.uniforms.left = 0;

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, right);
    shader.blend.uniforms.right = 1;

    this.uvVertArray.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.uvVertArray.unbind();

    shader.blend.unbind();
  }

  drawTexture(texture, opacity=1.0) {
    shader.texture.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    shader.texture.uniforms.sampler = 0;
    shader.texture.uniforms.opacity = opacity;
    this.uvVertArray.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.uvVertArray.unbind();
    shader.texture.unbind();
  }

}
export default Renderer;

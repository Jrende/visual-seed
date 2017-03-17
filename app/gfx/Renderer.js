import VertexArray from './VertexArray';
import * as glm from 'gl-matrix';
import shader from './shader';
import Framebuffer from './Framebuffer';
import { debugDrawTexture } from './Utils';

/* global gl */
class Renderer {
  constructor() {
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();
    this.drawMap = new Map();

    let [width, height] = [gl.canvas.width, gl.canvas.height];
    gl.clearColor(0, 0, 0, 1);
    glm.mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -10]);
    glm.mat4.ortho(this.projectionMatrix, width/2, -width/2, -height/2, height/2, 0.1, 100);
    //glm.mat4.perspective(this.projectionMatrix, 90, width/height, 0.1, 100);
    this.width = width;
    this.height = height;
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this.framebuffer = new Framebuffer(width, height);
    this.quad = new VertexArray(
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [0, 1, 2,
        0, 2, 3],
      [3]);
    this.drawMap.set(this.quad, []);
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

    shader.solid.bind(gl);
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
    this.framebuffer.bind();
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

        shader.solid.uniforms.r = 0.5;
        shader.solid.uniforms.g = 0.5;
        shader.solid.uniforms.b = 1.0;
        shader.solid.uniforms.alpha = 1.0;
        shader.solid.uniforms.mvp = mvp;
        gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
      });
      vertexArray.unbind();
    });
    shader.solid.unbind();
    this.framebuffer.unbind();
    this.present();
  }

  present() {
    debugDrawTexture(this.framebuffer.texture);
  }
}
export default Renderer;

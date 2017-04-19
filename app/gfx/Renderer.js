import VertexArray from './VertexArray';
import * as glm from 'gl-matrix';
import shader from './shader';
import Line from './geometry/Line.js';
import LineStrip from './geometry/LineStrip.js';
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
    //glm.mat4.perspective(this.projectionMatrix, 90, width/height, 0.1, 1000);

    this.width = width;
    this.height = height;
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this.quad = new VertexArray(
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [0, 1, 2,
        0, 2, 3],
      [3]);
    this.drawMap.set(this.quad, []);

    this.init();
  }

  init() {
  }

  add(item) {
    if(item instanceof Line) {
      this.addLine(item);
    } else if(item instanceof LineStrip) {
      item.lines.forEach(line => {
        line.id = item.id;
        this.addLine(line);
      });
      item.getJoins().forEach(join => {
        join.id = item.id;
        this.addJoin(join);
      });
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

  render() {
    this.renderScene();
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
        let modelMat = instance.getModelMatrix();
        glm.mat4.multiply(mvp, vp, modelMat);

        shader.solid.setUniforms({
          r: 0.2,
          g: 0.5,
          b: 0.1,
          alpha: 0.1,
          mvp,
          modelMat
        });
        gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
      });
      vertexArray.unbind();
    });
    shader.solid.unbind();
  }

  drawTexture(texture, opacity=1.0) {
    shader.texture.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    shader.texture.uniforms.sampler = 0;
    shader.texture.uniforms.opacity = opacity;
    this.quad.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    shader.texture.unbind();
  }

}
export default Renderer;

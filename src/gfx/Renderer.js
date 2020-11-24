import * as glm from 'gl-matrix';
import getShader from './shader';
import { Doublebuffer } from './Framebuffer';
import VertexArray from './VertexArray';
import { getColor } from './Utils.js';
/* global gl, window */
class Renderer {
  constructor() {
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();

    let [w, h, cw, ch] = [
      gl.canvas.width,
      gl.canvas.height,
      gl.canvas.clientWidth,
      gl.canvas.clientHeight
    ];
    this.width = w;
    this.height = h;
    this.viewMatrix = glm.mat4.create();

    this.projectionMatrix = glm.mat4.create();
    glm.mat4.perspective(
      this.projectionMatrix,
      100,
      h / w,
      0.1,
      1000
    );
    glm.mat4.lookAt(this.viewMatrix, [0, 0, 600], [0, 0, 0], [0, 1, 0]);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.presentationBuffer = new Doublebuffer(gl.canvas.width, gl.canvas.height, false, true);

    this.postProcessors = [];

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.aspectRatio = cw / ch;
    window.addEventListener('resize', () => {
      this.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
    });

    this.quad = new VertexArray(
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [1, 0, 2,
        2, 0, 3],
      [3]);

    this.textureShader = getShader('texture');
  }

  render(world) {
    let viewPos = [
      this.viewMatrix[12],
      this.viewMatrix[13],
      this.viewMatrix[14]
    ];

    let c = world.renderList;
    let nodes = c.opaque;
    if(c.transparent.length !== 0) {
      c.opaque.sort((a, b) => {
        return a.transform.getPosition()[2] - b.transform.getPosition()[2];
      });

      c.transparent.sort((a, b) => {
        return a.transform.getPosition()[2] - b.transform.getPosition()[2];
      });

      nodes = [...c.opaque, ...c.transparent];
    }

    this.presentationBuffer.renderTo(() => {
      this.renderScene(nodes);
    });
    if(this.postProcessors.length > 0) {
      this.presentationBuffer.flip();
      this.postProcessors.forEach(postProcessor => {
        this.presentationBuffer.renderTo(() => {
          postProcessor.render(this.presentationBuffer.back);
        });
      });
    }
    this.present();
  }

  present() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawTexture(this.presentationBuffer.getTexture());
  }

  drawTexture(texture) {
    this.textureShader.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.textureShader.setSampler2D('sampler', 0);
    this.textureShader.setFloat('opacity', 1.0);
    this.quad.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    this.textureShader.unbind();
  }

  renderScene(renderlist) {
    let prevVertexArray = null;
    let prevShader = null;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for(let i = 0; i < renderlist.length; i++) {
      let node = renderlist[i];
      if(prevShader !== node.material.shader) {
        if(prevShader !== null) {
          prevShader.unbind();
        }
        prevShader = node.material.shader;
        prevShader.bind();
      }

      if(prevVertexArray !== node.vertexArray) {
        if(prevVertexArray !== null) {
          prevVertexArray.unbind();
        }
        prevVertexArray = node.vertexArray;
        node.vertexArray.bind();
      }

      let vp = glm.mat4.create();
      glm.mat4.multiply(vp, vp, this.projectionMatrix);

      glm.mat4.multiply(vp, vp, this.viewMatrix);
      let modelMat = node.transform.getMatrix();
      let mvp = glm.mat4.multiply(glm.mat4.create(), vp, modelMat);
      node.material.apply();

      node.material.shader.setMat4('mvp', mvp);
      node.material.shader.setMat4('modelMat', modelMat);
      node.material.shader.setFloat('aspectRatio', this.aspectRatio);
      node.vertexArray.draw();
    }
    prevVertexArray.unbind();
    prevShader.unbind();
  }

  addPostProcessing(postProcessor) {
    this.postProcessors.push(postProcessor);
  }

  static setBackgroundColor(col) {
    let color = getColor(col);
    gl.clearColor(color[0], color[1], color[2], 1);
  }
}
export default Renderer;

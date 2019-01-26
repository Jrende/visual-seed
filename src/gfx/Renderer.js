import * as glm from 'gl-matrix';
import shader from './shader';
import { Doublebuffer } from './Framebuffer';
import VertexArray from './VertexArray';
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
      1000);
    glm.mat4.lookAt(this.viewMatrix, [0, 0, 600], [0, 0, 0], [0, 1, 0]);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.presentationBuffer = new Doublebuffer(gl.canvas.width, gl.canvas.height, false, true);

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
  }

  setWorld(world) {
    this.world = world;
  }

  render() {
    let viewPos = [
      this.viewMatrix[12],
      this.viewMatrix[13],
      this.viewMatrix[14]
    ];

    let c = this.world.renderList;
    c.opaque.sort((a, b) => {
      let d1 = glm.vec3.dist(viewPos, a.transform.getPosition());
      let d2 = glm.vec3.dist(viewPos, b.transform.getPosition());
      return d2 - d1;
    });

    c.transparent.sort((a, b) => {
      let d1 = glm.vec3.dist(viewPos, a.transform.getPosition());
      let d2 = glm.vec3.dist(viewPos, b.transform.getPosition());
      return d1 - d2;
    });

    let nodes = [...c.opaque, ...c.transparent];

    let blurAmount = 0.0;
    this.presentationBuffer.renderTo(() => {
      this.renderScene(nodes);
    });
    this.present();
  }

  present() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.drawTexture(this.presentationBuffer.getTexture());
  }

  blur(texture, dir, radius, color = [1, 1, 1]) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.blur.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    shader.blur.setUniforms({
      texture: 0,
      resolution: this.width,
      radius,
      dir,
      color
    });

    this.quad.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    shader.blur.unbind();
  }

  drawTexture(texture) {
    shader.texture.bind();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    shader.texture.setUniforms({ sampler: 0, opacity: 1.0 });
    this.quad.bind();
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    this.quad.unbind();
    shader.texture.unbind();
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

      shader.solid.setUniforms({
        mvp,
        modelMat,
        aspectRatio: this.aspectRatio
      });
      node.material.apply();

      node.vertexArray.draw();
    }
    prevVertexArray.unbind();
    prevShader.unbind();
  }

  static setBackgroundColor(color) {
    gl.clearColor(color[0], color[1], color[2], 1);
  }
}
export default Renderer;

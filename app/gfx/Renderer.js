import VertexArray from './VertexArray';
import * as glm from 'gl-matrix';
import shader from './shader';
/* global gl */
class Renderer {
  constructor() {
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();

    let [width, height] = [gl.canvas.width, gl.canvas.height];
    gl.clearColor(0, 0, 0, 1);

    glm.mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -10]);
    glm.mat4.ortho(this.projectionMatrix, width/2, -width/2, -height/2, height/2, 0.1, 100);
    //glm.mat4.perspective(this.projectionMatrix, 90, width/height, 0.1, 1000);

    this.width = width;
    this.height = height;
    gl.disable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  setWorld(world) {
    this.world = world;
  }

  render() {
    this.renderScene();
  }

  renderScene() {
    let prevVertexArray = null;
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.solid.bind();
    let i = 0;
    for(let mesh of this.world.iterator()) {
      if(prevVertexArray !== mesh.vertexArray) {
        if(prevVertexArray !== null) {
          prevVertexArray.unbind();
        }
        prevVertexArray = mesh.vertexArray;
        mesh.vertexArray.bind();
      }

      let vp = glm.mat4.create();
      let len = mesh.vertexArray.indexData.length;
      glm.mat4.multiply(vp, vp, this.projectionMatrix);

      glm.mat4.multiply(vp, vp, this.viewMatrix);
      let mvp = glm.mat4.create();
      let modelMat = mesh.modelMatrix;
      glm.mat4.multiply(mvp, vp, modelMat);

      shader.solid.setUniforms({ alpha: 1.0, mvp, modelMat });
      if(i % 2 === 0) {
        shader.solid.setUniforms({
          r: 0.0,
          g: 1.0,
          b: 0.0
        });
      } else {
        shader.solid.setUniforms({
          r: 1.0,
          g: 0.0,
          b: 0.0
        });
      }
      gl.drawElements(gl.TRIANGLES, len, gl.UNSIGNED_SHORT, 0);
      i++;
    }
    prevVertexArray.unbind();
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

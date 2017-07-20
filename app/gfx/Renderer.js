import * as glm from 'gl-matrix';
import shader from './shader';
/* global gl */
class Renderer {
  constructor() {
    this.viewMatrix = glm.mat4.create();
    this.projectionMatrix = glm.mat4.create();

    let [width, height] = [gl.canvas.width, gl.canvas.height];
    gl.clearColor(0, 0, 0, 1);

    glm.mat4.translate(this.viewMatrix, this.viewMatrix, [0, 0, -100]);
    glm.mat4.ortho(this.projectionMatrix, width/2, -width/2, -height/2, height/2, 0.1, 100);
    /*
    glm.mat4.perspective(this.projectionMatrix, 90, width/height, 0.1, 100);
    glm.mat4.lookAt(this.viewMatrix, [20, -90, 0], [0, 0, 0], [0, 1, 0]);
    */

    this.width = width;
    this.height = height;
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
    let prevShader = null;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    let c = this.world.renderList;
    let nodes = [...c.transparent, ...c.opaque];
    for(let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
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
      let modelMat = node.modelMatrix.getMatrix();
      let mvp = glm.mat4.multiply(glm.mat4.create(), vp, modelMat);

      shader.solid.setUniforms({ mvp, modelMat });
      node.material.apply();

      node.vertexArray.draw();
    }
    prevVertexArray.unbind();
    prevShader.unbind();
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

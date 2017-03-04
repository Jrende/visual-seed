import Line from "./Line";
import VertexArray from "./VertexArray";
import * as glm from 'gl-matrix';
import shader from './shader';

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
    this.drawMap.set("Line", {
      vertexArray: this.quad,
      instances: []
    });
  }

  add(item) {
    switch(item.constructor.name) {
      case "Line":
        this.addLine(item);
        break;
      case "LineStrip":
        item.lines.forEach(line => {
          this.addLine(line);
        });
        break;
      default:
    }
    
  }

  addLine(item) {
    this.drawMap.get("Line").instances.push(item);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    shader.solid.bind();
    this.drawMap.forEach(mesh => {
      mesh.vertexArray.bind();

      let vp = glm.mat4.create();
      glm.mat4.multiply(vp, vp, this.projectionMatrix);
      glm.mat4.multiply(vp, vp, this.viewMatrix);
      mesh.instances.forEach(instance => {
        let mvp = glm.mat4.create();
        glm.mat4.multiply(mvp, vp, instance.getModelMatrix());

        shader.solid.uniforms.r = 0.5;
        shader.solid.uniforms.g = 0.5;
        shader.solid.uniforms.b = 1.0;
        shader.solid.uniforms.alpha = 1.0;
        shader.solid.uniforms.mvp = mvp;
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      });
      mesh.vertexArray.unbind();
    });
    shader.solid.unbind();
  }
}
export default Renderer;

import VertexArray from '../VertexArray';
import getShader from '../shader';

let quad = new VertexArray(
  [
     1, 1, 1, 1,
    -1, 1, 0, 1,
    -1, -1,0, 0,
     1, -1, 1, 0
  ],
  [1, 0, 2,
    2, 0, 3],
  [2, 2]);
export class PostProcessor {
  constructor(shader) {
    this.shader = shader;
    this.quad = quad;
  }
}

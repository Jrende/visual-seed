import VertexArray from '../VertexArray';
/* global gl */
export default class Line {
  constructor(pos, radius = 5, points = 6) {
    this.pos = pos;
    this.radius = radius;
    this.points = points;

    this.generateGeometry();
  }

  generateGeometry() {
    let points = [0, 0, 0];
    let indices = [];
    for(let i = 0; i < this.points + 1; i++) {
      points.push(Math.sin((2 * Math.PI / this.points) * i) * this.radius);
      points.push(Math.cos((2 * Math.PI / this.points) * i) * this.radius);
      points.push(0);
      indices.push(i);
    }
    indices.push(1);
    this.vertexArray = new VertexArray(points, indices, [3], gl.TRIANGLE_FAN);
  }

  addToWorld(world, material) {
    let child = world.createChild();
    child.material = material;
    child.geometry = this.vertexArray;
    child.translate(this.pos);
  }
}

import VertexArray from '../VertexArray';
class Quad {
  constructor() {
    this.geometry = new VertexArray(
      [1, 1, 1,
        -1, 1, 1,
        -1, -1, 1,
        1, -1, 1],
      [0, 1, 2,
        0, 2, 3],
      [3]);
  }

  addToWorld(world) {
    world.geometry = this.geometry;
  }
}

export default new Quad();

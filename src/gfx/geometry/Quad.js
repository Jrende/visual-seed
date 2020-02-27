import VertexArray from '../VertexArray';
class Quad {
  constructor() {
    this.geometry = new VertexArray(
      [
        1, 1, 1, 1, 1,
        -1, 1, 1, 0, 1,
        -1, -1, 1, 0, 0,
        1, -1, 1, 1, 0
      ],
      [1, 0, 2,
        2, 0, 3],
      [3, 2]);
  }

  addToWorld(world, material) {
    world.material = material;
    world.geometry = this.geometry;
  }
}

export default new Quad();

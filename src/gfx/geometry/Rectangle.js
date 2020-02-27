import Quad from './Quad';

export default class Rectangle {
  constructor(pos, width, height) {
    this.pos = pos;
    this.width = width;
    this.height = height;
  }

  addToWorld(world, material) {
    let child = world.createChild();
    child.material = material;
    child.geometry = Quad.geometry;
    child
      .scale([this.width, this.height, 1])
      .translate([
        this.pos[0],
        this.pos[1],
        this.pos[2]
      ]);
  }
}

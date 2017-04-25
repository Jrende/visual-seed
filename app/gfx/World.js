import Transform from './Transform';

updateChildren(world) {

}

export default class World {
  constructor(geometry) {
    this.transform = new Transform();
    this.geometry = geometry;
    this.children = [];
  }

  createChild(geometry) {
    let newWorld = new World(geometry);
    this.children.push(newWorld);
    return newWorld;
  }

  //Maybe autocreate these functions?
  setPosition(pos) {
    transform.setPosition(pos);
    updateChildren(this);
  }

  setScale(scale) {
    transform.setScale(scale);
    updateChildren(this);
  }

  translate(vec3) {
    transform.translate(pos);
    updateChildren(this);
  }

  scale(vec3) {
    transform.setPosition(pos);
    updateChildren(this);
  }

  setRotation(angle, axis) {
    transform.setPosition(pos);
    updateChildren(this);
  }
}

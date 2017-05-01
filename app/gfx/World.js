import Transform from './Transform';

export default class World {
  constructor(geometry) {
    this.transformValue = new Transform();
    this.geometry = geometry;
    this.children = [];
  }

  createChild(geometry) {
    let newWorld = new World();
    geometry.addToWorld(newWorld);
    this.children.push(newWorld);
    return newWorld;
  }

  //Maybe autocreate these functions?

  identity() {
    this.transformValue.identity();
  }

  translate(vec3) {
    this.transformValue.translate(vec3);
    this.children.forEach(child => child.transform(this.transformValue.mat));
  }

  scale(vec3) {
    this.transformValue.scale(vec3);
    this.children.forEach(child => child.transform(this.transformValue.mat));
  }

  rotate(angle, axis) {
    this.transformValue.rotate(angle, axis);
    this.children.forEach(child => child.transform(this.transformValue.mat));
  }

  transform(mat) {
    this.transformValue.transform(mat);
    this.children.forEach(child => child.transform(this.transformValue.mat));
  }

  iterator() {
    let node = this;
    return {
      [Symbol.iterator]: function* () {
        for(let child of node.children) {
          yield* child.iterator();
        }
        if(node.geometry != null) {
          yield {
            vertexArray: node.geometry,
            modelMatrix: node.transformValue.getMatrix()
          };
        }
      }
    };
  }

}

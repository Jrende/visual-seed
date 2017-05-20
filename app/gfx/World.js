import Transform from './Transform';
import * as glm from 'gl-matrix';
import SolidMaterial from './material/SolidMaterial.js';

export default class World {
  constructor(geometry) {
    this.transformValue = new Transform();
    this.effectiveTransform = new Transform();
    this.geometry = geometry;
    this.children = [];
    this.parent = null;
  }

  createChild(geometry, material = new SolidMaterial([1.0, 1.0, 1.0])) {
    let newWorld = new World();
    newWorld.parent = this;
    if(geometry !== undefined) {
      geometry.addToWorld(newWorld, material);
    }
    this.children.push(newWorld);
    return newWorld;
  }

  //Maybe autocreate these functions?

  identity() {
    this.transformValue.identity();
    this.update();
  }

  translate(vec3) {
    this.transformValue.translate(vec3);
    this.update();
  }

  scale(vec3) {
    this.transformValue.scale(vec3);
    this.update();
  }

  rotate(angle, axis) {
    this.transformValue.rotate(angle, axis);
    this.update();
  }

  transform(mat) {
    this.transformValue.transform(mat);
    this.update();
  }

  update() {
    let parentTransform = null;
    if(this.parent == null) {
      parentTransform = glm.mat4.create();
    } else {
      parentTransform = this.parent.effectiveTransform;
    }

    glm.mat4.mul(this.effectiveTransform.mat, parentTransform.mat, this.transformValue.mat);
    this.children.forEach(child => {
      child.update(this.effectiveTransform);
    });
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
            material: node.material,
            modelMatrix: node.effectiveTransform.getMatrix()
          };
        }
      }
    };
  }

  /*
  standardIterator() {
    let node = this;
    let index = 0;
    let children = this.children.map(child => child.standardIterator());
    return {
      next: () => {
        if(index < node.children.length) {
          return children[index++].next();
        }
        if(node.geometry != null) {
          return {
            value: {
              vertexArray: node.geometry,
              modelMatrix: node.effectiveTransform.getMatrix()
            },
            done: true
          };
        }

        return { done: true };
      }
    };
  }
  */
}

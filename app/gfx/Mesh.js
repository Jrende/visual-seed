export class Instance {
  getModelMatrix() {}
}

export default class Mesh {
  Mesh(vertexArray) {
    this.vertexArray = vertexArray;
    this.instances = [];
  }
  bind() {
    vertexArray.bind();
  }
  unbind() {
    vertexArray.unbind();
  }
  addInstance(instance) {
    instances.push(instance);
  }
}

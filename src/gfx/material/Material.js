export class Material {
  constructor(shader, name) {
    this.shader = shader;
    this.name = name;
  }
  isTransparent() {
    return false;
  }
}


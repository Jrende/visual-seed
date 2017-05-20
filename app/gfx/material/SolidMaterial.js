import shaders from '../shader';

export default class SolidMaterial {
  constructor(color) {
    this.shader = shaders.solid;
    this.color = color;
  }

  apply() {
    this.shader.setUniforms({
      color: this.color
    });
  }
}


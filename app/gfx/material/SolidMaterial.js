import shaders from '../shader';

export default class SolidMaterial {
  constructor(color) {
    this.shader = shaders.solid;
    this.color = color;
    if(color[3] === undefined) {
      color[3] = 1.0;
    }
  }

  apply() {
    this.shader.setUniforms({
      color: this.color
    });
  }
}


import shaders from '../shader';
import Material from './Material';

export default class SolidMaterial extends Material {
  constructor(color) {
    super();
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

  isTransparent() {
    return this.color[3] < 1.0;
  }
}


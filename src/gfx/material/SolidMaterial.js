import getShader from '../shader';
import { Material } from './Material';
import { getColor } from '../Utils';

export default class SolidMaterial extends Material {
  constructor(color) {
    super(getShader('solid'), 'SolidMaterial');
    this.color = getColor(color);
  }

  apply() {
    this.shader.setVec4('color', this.color);
  }

  isTransparent() {
    return this.color[3] < 1.0;
  }
}


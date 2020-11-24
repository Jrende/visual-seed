import getShader from '../shader';
import { getColor } from '../Utils';
import { Material } from './Material';

export default class CheckerMaterial extends Material{
  constructor(color1, color2, width=16, height=16) {
    super(getShader('checker'), 'CheckerMaterial');

    this.color1 = getColor(color1);

    this.color2 = getColor(color2);

    this.transparent = this.color1[3] < 1.0 || this.color2[3] < 1.0;
    this.width = width;
    this.height = height;
  }

  apply() {
    this.shader.setVec4('color1', this.color1);
    this.shader.setVec4('color2', this.color2);
    this.shader.setFloat('width', this.width);
    this.shader.setFloat('height', this.height);
  }

  isTransparent() {
    return this.transparent;
  }
}


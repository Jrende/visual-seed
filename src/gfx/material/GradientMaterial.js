import getShader from '../shader';
import Texture from '../Texture';
import { getColor } from '../Utils';
import { Material } from './Material';

export default class GradientMaterial extends Material {
  constructor(gradient, from = [0, 0], to = [1, 0], repeatType = "Repeat") {
    super(getShader('gradient'), 'GradientMaterial');
    this.gradient = gradient;
    this.gradient.forEach(g => g.color = getColor(g.color));
    this.from = from;
    this.to = to;
    this.repeatType = repeatType;
    this.transparent = this.gradient.find(a => a.color[3] < 1.0);
  }

  apply() {
    this.shader.bind(0);
    this.shader.setVec2('from', this.from);
    this.shader.setVec2('to', this.to);
    this.shader.setInt('size', this.gradient.length);
    this.shader.setInt('repeatType', this.repeatType);

    for(let i = 0; i < this.gradient.length; i++) {
      let g = this.gradient[i];
      this.shader.setFloat(`gradient[${i}].position`, g.position);
      this.shader.setVec4(`gradient[${i}].color`, g.color);
    }
  }

  isTransparent() {
    return this.transparent;
  }
}


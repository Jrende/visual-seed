import getShader from '../shader';

export default class CheckerMaterial {
  constructor(color1, color2, width=16, height=16) {
    this.shader = getShader('checker');

    this.color1 = color1;
    if(this.color1.length === 3) {
      this.color1[3] = 1.0;
    }

    this.color2 = color2;
    if(this.color2.length === 3) {
      this.color2[3] = 1.0;
    }

    this.transparent = this.color1[3] < 1.0 || this.color2[3] < 1.0;
    this.width = width;
    this.height = height;
  }

  apply() {
    this.shader.setUniforms({
      color1: this.color1,
      color2: this.color2,
      width: this.width,
      height: this.height
    });
  }

  isTransparent() {
    return this.transparent;
  }
}


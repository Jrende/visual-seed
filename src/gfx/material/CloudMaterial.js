import getShader from '../shader';

export default class CloudMaterial {
  constructor(color) {
    this.shader = getShader('cloud');
    this.color = color;
    this.seed = Math.random();
  }

  apply() {
    this.shader.setUniforms({
      seed: this.seed,
      r: this.color[0],
      g: this.color[1],
      b: this.color[2],
      size: 10,
      density: 1,
      left: 0,
      up: 0,
      res: [2048, 2048]
    });
  }

  isTransparent() {
    return true;
  }
}


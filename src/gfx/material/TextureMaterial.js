import getShader from '../shader';
import Texture from '../Texture';

export default class TextureMaterial {
  constructor(texturePath) {
    this.shader = getShader('textureMaterial');
    //TODO: Global texture lookup
    this.texture = new Texture(texturePath);
    this.texture.compile();
  }

  apply() {
    this.texture.bind(0);
    this.shader.setUniforms({
      sampler: 0
    });
  }

  isTransparent() {
    return true;
  }
}


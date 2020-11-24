import getShader from '../shader';
import Texture from '../Texture';
import { Material } from './Material';

export default class TextureMaterial extends Material {
  constructor(texturePath) {
    super(getShader('textureMaterial'), 'TextureMaterial');

    //TODO: Global texture lookup
    this.texture = new Texture(texturePath);
    this.texture.compile();
  }

  apply() {
    this.texture.bind(0);
    this.shader.setSampler2D('sampler', 0);
  }

  isTransparent() {
    return true;
  }
}


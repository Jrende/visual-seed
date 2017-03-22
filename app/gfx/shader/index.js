import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import gradientFrag from './glsl/gradient.frag';
import gradientVert from './glsl/gradient.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import Shader from '../Shader';

export default {
  solid: new Shader({
    frag: solidFrag,
    vert: solidVert
  }),

  gradient: new Shader({
    frag: gradientFrag,
    vert: gradientVert
  }),

  blur: new Shader({
    frag: blurFrag,
    vert: blurVert
  }),

  texture: new Shader({
    frag: textureFrag,
    vert: textureVert
  })
};

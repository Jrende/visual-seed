import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import gradientFrag from './glsl/gradient.frag';
import gradientVert from './glsl/gradient.vert';
import blendFrag from './glsl/combine.frag';
import blendVert from './glsl/combine.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import cloudFrag from './glsl/cloud.frag';
import cloudVert from './glsl/cloud.vert';
import discardFrag from './glsl/discard.frag';
import discardVert from './glsl/discard.vert';
import clampFrag from './glsl/clamp.frag';
import clampVert from './glsl/clamp.vert';
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

  blend: new Shader({
    frag: blendFrag,
    vert: blendVert
  }),

  texture: new Shader({
    frag: textureFrag,
    vert: textureVert
  }),

  cloud: new Shader({
    frag: cloudFrag,
    vert: cloudVert
  }),

  clamp: new Shader({
    frag: clampFrag,
    vert: clampVert
  }),

  discard: new Shader({
    frag: discardFrag,
    vert: discardVert
  })
};

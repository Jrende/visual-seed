import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
/*
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
import colorMapFrag from './glsl/colorMap.frag';
import colorMapVert from './glsl/colorMap.vert';
*/
import Shader from '../Shader';

let solid = new Shader({
  frag: solidFrag,
  vert: solidVert
});

export default {
  solid
};

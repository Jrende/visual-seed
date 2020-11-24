import solidFrag from './glsl/solid.frag';
import textureMaterialShaderFrag from './glsl/textureMaterialShader.frag';
import textureShaderFrag from './glsl/textureShader.frag';
import blurFrag from './glsl/blur.frag';
import cloudFrag from './glsl/cloud.frag';
import checkerFrag from './glsl/checkers.frag';
import gradientFrag from './glsl/megaGradient.frag';

import genUv2D from './glsl/genUv2D.vert';
import postprocess from './glsl/postprocess.vert';
import material from './glsl/material.vert';

import Shader from './Shader';

const shaders = {
  solid: new Shader({
    frag: solidFrag,
    vert: material
  }),
  textureMaterial: new Shader({
    frag: textureMaterialShaderFrag,
    vert: material
  }),
  cloud: new Shader({
    frag: cloudFrag,
    vert: material
  }),
  checker: new Shader({
    frag: checkerFrag,
    vert: material
  }),
  gradient: new Shader({
    frag: gradientFrag,
    vert: material
  }),

  blur: new Shader({
    frag: blurFrag,
    vert: postprocess
  }),

  texture: new Shader({
    frag: textureShaderFrag,
    vert: genUv2D
  }),
};

function getShader(name) {
  const shader = shaders[name];
  if(!shader.isCompiled()) {
    shader.compile(gl);
  }
  if(shader === undefined) {
    throw new Error(`Unable to get shader ${name}`);
  }
  return shader;
}

export default getShader;

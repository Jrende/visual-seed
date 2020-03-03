import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import textureMaterialShaderFrag from './glsl/textureMaterialShader.frag';
import textureMaterialShaderVert from './glsl/textureMaterialShader.vert';
import textureShaderFrag from './glsl/textureShader.frag';
import textureShaderVert from './glsl/textureShader.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import cloudFrag from './glsl/cloud.frag';
import cloudVert from './glsl/cloud.vert';
import checkerFrag from './glsl/checkers.frag';
import checkerVert from './glsl/checkers.vert';
import Shader from './Shader';

const shaders = {
  solid: new Shader({
    frag: solidFrag,
    vert: solidVert
  }),
  textureMaterial: new Shader({
    frag: textureMaterialShaderFrag,
    vert: textureMaterialShaderVert
  }),
  texture: new Shader({
    frag: textureShaderFrag,
    vert: textureShaderVert
  }),
  blur: new Shader({
    frag: blurFrag,
    vert: blurVert
  }),
  cloud: new Shader({
    frag: cloudFrag,
    vert: cloudVert
  }),
  checker: new Shader({
    frag: checkerFrag,
    vert: checkerVert
  }),
};
function getShader(name) {
  const shader = shaders[name];
  if(shader === undefined) {
    throw new Error(`Unable to get shader ${name}`);
  }
  return shader;
}

export default getShader;

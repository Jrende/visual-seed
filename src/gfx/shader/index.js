import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import textureMaterialShaderFrag from './glsl/textureMaterialShader.frag';
import textureMaterialShaderVert from './glsl/textureMaterialShader.vert';
import textureShaderFrag from './glsl/textureShader.frag';
import textureShaderVert from './glsl/textureShader.vert';
import blurFrag from './glsl/blur.frag';
import blurVert from './glsl/blur.vert';
import Shader from './Shader';

let solid = new Shader({
  frag: solidFrag,
  vert: solidVert
});

let textureMaterial = new Shader({
  frag: textureMaterialShaderFrag,
  vert: textureMaterialShaderVert
});

let texture = new Shader({
  frag: textureShaderFrag,
  vert: textureShaderVert
});

let blur = new Shader({
  frag: blurFrag,
  vert: blurVert
});

export default {
  solid,
  texture,
  blur,
  textureMaterial
};

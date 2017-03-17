import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import gradientFrag from './glsl/gradient.frag';
import gradientVert from './glsl/gradient.vert';
import textureFrag from './glsl/textureShader.frag';
import textureVert from './glsl/textureShader.vert';
import Shader from '../Shader';

let solid = new Shader({
  frag: solidFrag,
  vert: solidVert
});

let gradient = new Shader({
  frag: gradientFrag,
  vert: gradientVert
});

let texture = new Shader({
  frag: textureFrag,
  vert: textureVert
});

export default { solid, gradient, texture };

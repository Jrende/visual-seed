import solidFrag from './glsl/solid.frag';
import solidVert from './glsl/solid.vert';
import Shader from '../Shader';
let solidShader = new Shader({
    frag: solidFrag,
    vert: solidVert
});
export default {
  solid: solidShader
};

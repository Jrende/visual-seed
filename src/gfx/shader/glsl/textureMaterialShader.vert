attribute vec3 aVertexPosition;
attribute vec2 TexCoord;

varying vec2 TexCoord0;

uniform mat4 mvp;
uniform mat4 modelMat;
uniform float aspectRatio;
void main(void) {
  TexCoord0 = TexCoord;
  vec4 pos = mvp * vec4(aVertexPosition, 1.0);
  pos.x /= aspectRatio;
  gl_Position = pos;
}

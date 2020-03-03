attribute vec3 aVertexPosition;
attribute vec2 TexCoord;
varying vec3 worldPos;
uniform mat4 mvp;
uniform mat4 modelMat;
uniform float aspectRatio;
void main(void) {
  worldPos = (modelMat * vec4(aVertexPosition, 1.0)).xyz;
  vec4 pos = mvp * vec4(aVertexPosition, 1.0);
  pos.x /= aspectRatio;
  gl_Position = pos;
}

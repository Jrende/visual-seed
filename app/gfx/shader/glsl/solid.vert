attribute vec3 aVertexPosition;
varying vec3 worldPos;
uniform mat4 mvp;
uniform mat4 modelMat;
void main(void) {
  float f = 1.0;
  worldPos = (modelMat * vec4(aVertexPosition, 1.0)).xyz;
  gl_Position = mvp * vec4(aVertexPosition, 1.0);
}

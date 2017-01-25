attribute vec3 aVertexPosition;
uniform mat4 mvp;
void main(void) {
  gl_Position = mvp * vec4(aVertexPosition, 1.0);
}

attribute vec2 aVertexPosition;
void main(void) {
  gl_Position = vec4(vec3(aVertexPosition, 0.0), 1.0);
}

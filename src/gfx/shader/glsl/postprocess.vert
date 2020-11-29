attribute vec2 aVertexPosition;
attribute vec2 uv_atr;
varying vec2 uv;

void main(void) {
  //uv = uv_atr;
  uv = vec2(
    clamp(aVertexPosition.x, 0.0, 1.0),
    clamp(aVertexPosition.y, 0.0, 1.0)
  );
  gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);
}

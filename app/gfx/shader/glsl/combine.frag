precision highp float;
uniform sampler2D left;
uniform sampler2D right;
varying vec2 uv;

void main(void) {
  gl_FragColor = texture2D(left, uv) / (1.4 - texture2D(right, uv) * 1.0);
}

precision highp float;

uniform sampler2D sampler;
varying vec2 uv;

void main(void) {
  vec4 c = texture2D(sampler, uv);
  gl_FragColor = vec4(c.r, 0.0, c.b, c.a);
}

precision highp float;

uniform sampler2D sampler;
varying vec2 uv;

void main(void) {
  vec4 c = texture2D(sampler, uv);
  gl_FragColor = vec4(0.0, c.g, c.b, c.a);
}

precision highp float;

uniform sampler2D sampler;
varying vec2 TexCoord0;

void main(void) {
  vec4 c = texture2D(sampler, TexCoord0).rgba;
  float a = c.a;
  gl_FragColor = vec4(c.r/a, c.g/a, c.b/a, a);
  //gl_FragColor = vec4(a, a, a, a);
}

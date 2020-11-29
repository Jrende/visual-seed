precision highp float;

uniform sampler2D sampler;
uniform float opacity;
varying vec2 uv;

void main(void) {
  gl_FragColor = vec4(texture2D(sampler, uv).rgb, opacity);
  //gl_FragColor = vec4(1.0, 1.0, 0.0, opacity);
}

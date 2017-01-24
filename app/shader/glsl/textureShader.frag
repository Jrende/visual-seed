precision highp float;

uniform sampler2D sampler;
varying vec2 uv;

void main(void) {
  gl_FragColor = vec4(texture2D(sampler, uv).rgb, 1.0);
}

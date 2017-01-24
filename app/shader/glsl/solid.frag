precision highp float;
uniform float alpha;
uniform float r;
uniform float g;
uniform float b;
void main(void) {
  gl_FragColor = vec4(r, g, b, alpha);
}

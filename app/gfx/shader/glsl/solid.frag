precision highp float;
uniform float alpha;
uniform float r;
uniform float g;
uniform float b;
varying vec3 worldPos;

void main(void) {
  vec4 color = vec4(r, g, b, alpha); 
  gl_FragColor = color;
}

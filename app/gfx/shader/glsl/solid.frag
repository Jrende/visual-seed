precision highp float;
uniform float alpha;
uniform float r;
uniform float g;
uniform float b;

// uniform float asdasd;
/*
uniform vec3 afvjiefjio;
*/

void main(void) {
  vec4 color = vec4(r, g, b, alpha); 
  gl_FragColor = color;
}

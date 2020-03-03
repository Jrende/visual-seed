precision highp float;
varying vec3 worldPos;

uniform vec4 color1;
uniform vec4 color2;
uniform float width;
uniform float height;
uniform float ratio;


void main(void) {
  vec2 pos = worldPos.xy;
  float result = mod(
      floor(pos.x / width) + 
      floor(pos.y / height), 2.0);
  vec4 color = result == 0.0 ? color1 : color2;

  gl_FragColor = color;
}

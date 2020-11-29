precision highp float;
varying vec2 uv;

struct Gradient {
  vec4 color;
  float position;
};

uniform vec2 from;
uniform vec2 to;
uniform int size;
uniform int repeatType;

uniform Gradient gradient[15];
const int MAX_STEPS = 16;

const int REPEAT = 0;
const int MIRRORED_REPEAT = 1;
const int CLAMP_TO_EDGE = 2;

vec4 getColorAtPos(float p) {
  if(p < gradient[0].position) {
    return gradient[0].color;
  } else {
    for(int i = 1; i < MAX_STEPS; i++) {
      if(i >= size) {
        break;
      }
      Gradient before = gradient[i - 1];
      Gradient after = gradient[i];
      if(before.position < p && after.position > p) {
        float pp = p - before.position;
        float ap = after.position - before.position;
        float mp = pp / ap;
        return mix(before.color, after.color, mp);
      }
      if(i == size - 1) {
        return after.color;
      }
    }
  }
  return vec4(1.0, 0.0, 1.0, 1.0);
}

float gradientClamp(float pos, float gradDist) {
  if(repeatType == REPEAT) {
    return (pos - gradDist * floor(pos / gradDist)) / gradDist;
  } else if(repeatType == CLAMP_TO_EDGE) {
    return clamp(pos, 0.0, 1.0) / gradDist;
  } else if(repeatType == MIRRORED_REPEAT) {
    float intPart = floor(pos / gradDist);
    float result = (pos - gradDist * floor(pos / gradDist)) / gradDist;
    if(mod(intPart, 2.0) == 0.0) {
      return result;
    } else {
      return 1.0 - result;
    }
  }

  return pos;
}

void main(void) {
  vec2 s = to - from;
  vec2 v = s - uv.st - from;
  vec2 proj = (dot(v, s) / dot(s, s)) * s;
  float gradientDistance = length(s);
  float pos = gradientClamp(distance(proj, s), gradientDistance);
  vec4 c = getColorAtPos(pos);
  gl_FragColor = c * c.a;
  //gl_FragColor = vec4(pos, pos, pos, 1.0);
}

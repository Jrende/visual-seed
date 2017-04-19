import * as glm from 'gl-matrix';
import Line from './Line';

export default class LineStrip {
  constructor(lines, width = 5) {
    this.lines = [];
    for(let i = 0; i < lines.length - 1; i++) {
      this.lines.push(new Line(lines[i], lines[i + 1], width));
    }
  }

  getJoins() {
    let joins = [];
    for(let i = 0; i < this.lines.length - 1; i++) {
      let joinTriangle = [];
      let line1 = this.lines[i];
      let line2 = this.lines[i + 1];
      let v1 = glm.vec3.create();
      glm.vec3.subtract(v1, line1.to, line1.from);
      let v2 = glm.vec3.create();
      glm.vec3.subtract(v2, line2.from, line2.to);
      let cross = glm.vec3.create();
      glm.vec3.cross(cross, v1, v2);
      glm.vec3.normalize(cross, cross);

      {
        let vec = glm.vec3.clone(line1.to);
        let normal = glm.vec3.cross(glm.vec3.create(), line1.getDirection(), [0, 0, -cross[2]]);
        glm.vec3.normalize(normal, normal);
        glm.vec3.scale(normal, normal, line1.width);
        glm.vec3.add(vec, vec, normal);
        joinTriangle.push(vec);
      }
      {
        let vec = glm.vec3.clone(line2.from);
        let normal = glm.vec3.cross(glm.vec3.create(), line2.getDirection(), [0, 0, -cross[2]]);
        glm.vec3.normalize(normal, normal);
        glm.vec3.scale(normal, normal, line1.width);
        glm.vec3.add(vec, vec, normal);
        joinTriangle.push(vec);
      }

      joinTriangle.push(line1.to);
      joins.push(joinTriangle);
    }
    return joins;
  }
}

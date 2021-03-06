import VertexArray from '../VertexArray';
/* global gl */

let circleGeometries = {};
function generateGeometry(numPoints) {
  if(circleGeometries[numPoints] !== undefined) {
    return circleGeometries[numPoints];
  }

  let points = [0, 0, 0, 0, 0];
  let indices = [];
  for(let i = 0; i < numPoints + 1; i++) {
    points.push(Math.sin((2 * Math.PI / numPoints) * i));
    points.push(Math.cos((2 * Math.PI / numPoints) * i));
    points.push(0);
    points.push((Math.sin((2 * Math.PI / numPoints) * i) + 1.1) / 2);
    points.push((Math.cos((2 * Math.PI / numPoints) * i) + 1.1) / 2);
    indices.push(i);
  }
  indices.push(1);
  let circle = new VertexArray(points, indices, [3, 2], gl.TRIANGLE_FAN);
  circleGeometries[numPoints] = circle;
  return circle;
}

let circleCache = {};
function getCircle(numPoints) {
  let key = numPoints + "" + innerRadius;
  if(circleCache[key] === undefined) {
    let circleGeo = generateGeometry(numPoints);
    circleCache[key] = circleGeo;
  }
  return circleCache[key];
}

export default class Circle {
  constructor(points = 6) {
    this.points = points;

    this.vertexArray = generateGeometry(points);
  }

  addToWorld(world, material) {
    let child = world.createChild();
    child.material = material;
    child.geometry = this.vertexArray;
  }
}

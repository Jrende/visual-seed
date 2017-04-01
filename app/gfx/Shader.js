/* globals gl */
function compileShader(src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(`Error when compiling shader: ${gl.getShaderInfoLog(shader)}`);
    console.groupCollapsed('Shader source');
    console.log(src);
    console.groupEnd();
    return null;
  }
  return shader;
}
function createShaderProgram(vertexShader, fragmentShader) {
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    var info = gl.getProgramInfoLog(shaderProgram);
    console.error(`Error compiling shader: \n\n${info}`);
  }
  gl.useProgram(shaderProgram);
  const loc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(loc);
  return shaderProgram;
}
function getUniformGetter(uniformHandle, shader) {
  return () => gl.getActiveUniform(shader.program, uniformHandle);
}
function getUniformSetter(uniformHandle, type) {
  switch (type) {
    case 'float': return (value) => gl.uniform1f(uniformHandle, value);
    case 'vec2': return (value) => gl.uniform2fv(uniformHandle, value);
    case 'vec3': return (value) => gl.uniform3fv(uniformHandle, value);
    case 'vec4': return (value) => gl.uniform4fv(uniformHandle, value);
    case 'mat3': return (value) => gl.uniformMatrix3fv(uniformHandle, false, value);
    case 'mat4': return (value) => gl.uniformMatrix4fv(uniformHandle, false, value);
    case 'sampler2D': return (value) => gl.uniform1i(uniformHandle, value);
    default: {
      console.error('Unable to create uniform setter for type', type);
      return undefined;
    }
  }
}
function getUniforms(sources) {
  const uniforms = {};
  sources.forEach(source => {
    const matches = source.match(/uniform.*/g);
    if (matches) {
      matches
        .map(u => u.substring(8, u.length - 1))
        .map(u => u.split(' '))
        .forEach((u) => {
          uniforms[u[1]] = u[0];
        });
    }
  });
  return uniforms;
}
function createUniformFunction(name, type, shader) {
  const uniformHandle = gl.getUniformLocation(shader.program, name);
  Object.defineProperty(shader.uniforms, name, {
    enumerable: true,
    configurable: false,
    get: getUniformGetter(uniformHandle, shader),
    set: getUniformSetter(uniformHandle, type)
  });
}
function createUniforms(shader) {
  const uniforms = getUniforms([shader.vert, shader.frag]);
  Object.entries(uniforms).forEach((u) => createUniformFunction(u[0], u[1], shader));
}
class Shader {
  constructor(src) {
    this.vert = src.vert;
    this.frag = src.frag;
    this.uniforms = Object.create(null);
    this.compile();
  }
  bind() {
    gl.useProgram(this.program);
  }

  compile() {
    if (!this.compiled) {
      const vertProgram = compileShader(this.vert, gl.VERTEX_SHADER);
      const fragProgram = compileShader(this.frag, gl.FRAGMENT_SHADER);
      this.program = createShaderProgram(vertProgram, fragProgram);
      createUniforms(this);
    }
  }

  unbind() {
    gl.useProgram(null);
  }
}

export default Shader;

export default class Shader {
  constructor(src) {
    this.vert = src.vert;
    this.frag = src.frag;
    this.attributes = this.getAttributes(src.vert);
  }

  getAttributes(source) {
    return this.vert
      .split('\n')
      .filter(row => row.includes('attribute'))
      .map(a => a.substring(a.lastIndexOf(' ') + 1, a.length - 1));
  }

  bind() {
    if(!this.compiled) {
      throw new Error("Can't bind uncompiled shader");
    }
    this.gl.useProgram(this.program);
  }

  compile(gl) {
    this.gl = gl;
    if (!this.compiled) {
      this.uniforms = {};
      const vertProgram = this.compileShader(this.gl, this.vert, gl.VERTEX_SHADER);
      const fragProgram = this.compileShader(this.gl, this.frag, gl.FRAGMENT_SHADER);
      this.program = this.createShaderProgram(this.gl, vertProgram, fragProgram);
      this.compiled = true;
    }
  }

  isCompiled() {
    return this.compiled;
  }

  compileShader(gl, src, type) {
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

  createShaderProgram(gl, vertexShader, fragmentShader) {
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    for(let i = 0; i < this.attributes.length; i++) {
      gl.bindAttribLocation(shaderProgram, i, this.attributes[i]);
    }

    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      let info = gl.getProgramInfoLog(shaderProgram);
      console.error(`Error compiling shader: \n\n${info}`);
    }
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }


  getUniformHandle(uniformName) {
    if(this.uniforms[uniformName] === undefined) {
      let handle = this.gl.getUniformLocation(this.program, uniformName);
      this.uniforms[uniformName] = handle;
    }
    return this.uniforms[uniformName];
  }

  setBool(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value?1:0);
  }

  setInt(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1i(uniformHandle, value);
  }
  
  setFloat(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform1f(uniformHandle, value);
  }

  setVec2(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform2fv(uniformHandle, value);
  }

  setVec3(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform3fv(uniformHandle, value);
  }

  setVec4(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniform4fv(uniformHandle, value);
  }

  setMat3(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix3fv(uniformHandle, false, value);
  }

  setMat4(uniformName, value) {
    let uniformHandle = this.getUniformHandle(uniformName);
    this.gl.uniformMatrix4fv(uniformHandle, false, value);
  }

  setSampler2D(uniformName, value) {
    this.setInt(uniformName, value);
  }

  unbind() {
    this.gl.useProgram(null);
  }
}


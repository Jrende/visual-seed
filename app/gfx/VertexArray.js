/* globals gl */
export default class VertexArray {
  constructor(vertexData, indexData, attrs) {
    let shouldInitialize = true;
    if(Number.isInteger(vertexData) || Number.isInteger(indexData)) {
      shouldInitialize = false;
    } else if (vertexData instanceof Float32Array) {
      this.vertexData = vertexData;
    } else {
      this.vertexData = new Float32Array(vertexData);
    }

    if (indexData instanceof Uint16Array) {
      this.indexData = indexData;
    } else {
      this.indexData = new Uint16Array(indexData);
    }

    this.attrs = attrs;
    this.isInitialized = false;
    this.vertIndex = 0;
    this.indexIndex = 0;
    if (shouldInitialize) {
      this.initialize();
    }
  }
  initialize() {
    if (!this.isInitialized) {
      this.vertBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
      gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
      if (this.indexData !== undefined) {
        this.indexBuf = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indexData, gl.STATIC_DRAW);
      }
      this.isInitialized = true;
    }
  }
  pushVertices(vert) {
    if (this.vertIndex + vert.length > this.vertexData.length) {
      console.warn('Vertex array vertex push overflow!');
      return;
    }
    for (let i = 0; i < vert.length; i++) {
      this.vertexData[this.vertIndex++] = vert[i];
    }
  }
  pushIndex(index) {
    if (this.indexIndex + index.length > this.indexData.length) {
      console.warn('Vertex array index push overflow!');
      return;
    }
    for (let i = 0; i < index.length; i++) {
      this.indexData[this.indexIndex++] = index[i];
    }
  }
  bind() {
    if (this.isInitialized !== true) {
      console.error('Tried to use uninitialized VertexArray!');
      return;
    }
    const attrSum = this.attrs.reduce((a, b) => a + b);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuf);
    if (this.indexData !== undefined) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
    }
    let pointer = 0;
    for (let i = 0; i < this.attrs.length; i++) {
      gl.vertexAttribPointer(i, this.attrs[i], gl.FLOAT, false, attrSum * 4, pointer * 4);
      gl.enableVertexAttribArray(i);
      pointer += this.attrs[i];
    }
  }
  unbind() {
    for (let i = 0; i < this.attrs.length; i++) {
      gl.disableVertexAttribArray(i);
    }
    if (this.indexData !== undefined) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  free() {
    gl.deleteBuffer(this.vertBuf);
    if(this.indexBuf) {
      gl.deleteBuffer(this.indexBuf);
    }
  }
}

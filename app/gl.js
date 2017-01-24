class GlError {
    constructor(message) {
        this.message = message;
    }
    toString() {
        return this.message;
    }
    valueOf() {
        return this.message;
    }
}
export function throwOnGLError(err, funcName, args) {
    throw new GlError(`${err} was caused by call to: ${funcName}(${JSON.stringify(args)})`);
}
export function logGLCalls(functionName, args) {
    console.log(`gl.${functionName}(${functionName}, ${JSON.stringify(args)})})`);
}
export function validateNoneOfTheArgsAreUndefined(functionName, args) {
    for (let ii = 0; ii < args.length; ++ii) {
        if (args[ii] === undefined) {
            console.error(`undefined passed to gl.${functionName} (${functionName}, ${args})`);
        }
    }
}
export function logAndValidate(functionName, args) {
    logGLCalls(functionName, args);
    validateNoneOfTheArgsAreUndefined(functionName, args);
}

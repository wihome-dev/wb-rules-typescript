exports.default = function ({ orig }) {
    return orig.replace(/\.\.\/wb-rules-modules\/(.+)\.js/g, "$1");
}

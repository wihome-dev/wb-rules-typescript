exports.default = function moduleReplacer({ orig }) {
    return orig.replace('../wb-rules-modules/', '');
}

exports.default = function moduleReplacer({ orig }) {
  return orig
    // Случай импорта в правилах
    .replace('../wb-rules-modules/', '')
    // Случай импорта в модулях правил
    .replace('\'./', '\'')
    // Удаление расширения, появляющегося в процессе работы Rollup
    .replace('.js\'', '\'');
}

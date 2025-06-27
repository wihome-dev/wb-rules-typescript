exports.default = function moduleReplacer({ orig }) {
  return orig
    // Случай импорта в правилах
    .replace('../wb-rules-modules/', '')
    // Случай импорта во вложенных папках
    .replace('../', '')
    // Случай импорта в модулях правил
    .replace('\'./', '\'')
    // Расширение, появляющееся в процессе работы Rollup
    .replace('.js\'', '\'');
}

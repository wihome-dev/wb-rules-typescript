const path = require('path')

const requirePattern = /require\(['"]([^'"]+)'\)/
const modulesDir = path.join(process.cwd(), 'dist', 'wb-rules-modules')

// --------------------------------------------------------------
// Заменяет путь импорта относительно текущего расположения
// на путь импорта относительно каталога wb-rules-modules.
// 
// Это необходимо для корректной перелинковки модулей
// внутри подкаталогов - такой формат распознаётся контроллером.
// --------------------------------------------------------------

exports.default = function moduleReplacer({ orig, file }) {

  // Ищет соответствие шаблону.
  const match = requirePattern.exec(orig)

  // Если соответствия не обнаружено, конструкция
  // возвращается без изменений.
  if (!match)
    return orig

  const currentDir = path.dirname(file)
  const requireFullPath = path.resolve(currentDir, match[1])

  // Если полный путь не принадлежит каталогу модулей - пропускаем.
  if (!requireFullPath.startsWith(modulesDir))
    return orig

  const rebasedRelative = path
    // Перебазирование пути относительно каталога с модулями.
    .relative(modulesDir, requireFullPath)
    // Нормализация символа-разделителя.
    .replaceAll(path.sep, path.posix.sep)
    // Расширение, появляющееся в процессе работы Rollup.
    .replace('.js', '')

  return orig.replace(match[1], rebasedRelative)
}

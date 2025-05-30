# Шаблон проекта wb-rules 2.0 для VS Code

Готовый шаблон по материалам статей на Дзене, настроенный на работу с TypeScript. Используется для программирования правил контроллера компании Wiren Board. Снимает ограничения на разработку, накладываемые ECMAScript 5.

## Текущее состояние

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wihome-dev/wb-rules-typescript/build.yml?branch=latest&logo=github&style=flat-square)

## Начало работы

Потребуется предварительно установить nodejs в варианте LTS и менеджер пакетов yarn.

Запустить сборку можно нажав сочетание клавиш <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> и выбрав из выпадающего меню опцию `yarn: build`.

Перед использованием команды `deploy` в файле `package.json`, потребуется настроить её на подключение к Вашему контроллеру Wirenboard.

Скачайте ZIP-архив и распакуйте его в целевую директорию, после чего откройте проект при помощи Visual Studio Code.

<b>Примечание:</b><br/>
в статьях о разработке правил целевой директорией в системе Windows является `D:\repos\wirenboard`.

## Полезные ссылки

Движок правил wb-rules 2.0:<br/>
https://github.com/wirenboard/wb-rules

### Серия руководств

О программировании контроллера Wirenboard с помощью Visual Studio Code:

- перед началом<br/>
  https://dzen.ru/a/aCLjKbtWvw8Xgyhy
- пишем на TypeScript без ограничений<br/>
  https://dzen.ru/a/aCg1B5ghH0M-pFXY
- статический анализ кода при помощи ESLint и Prettier<br/>
  https://dzen.ru/a/aCuMffKDJV1jgzaY
- создаём юнит-тесты с применением Jest<br/>
  https://dzen.ru/a/aC1B4K3VQRsD4pYB
- удаляем лишний код при помощи Rollup и Tree-Shaking<br/>
  https://dzen.ru/a/aDk_iti4dG6GEDS3

Вторая статья в подробностях рассказывает о структуре проекта, которая легла в основу данного шаблона.

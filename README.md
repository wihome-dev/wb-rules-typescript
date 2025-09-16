# Шаблон проекта wb-rules 2.0 для VS Code

Готовый шаблон по материалам статей на Дзене, настроенный на работу с TypeScript. Используется для программирования правил контроллера компании Wiren Board. Снимает ограничения на разработку, накладываемые ECMAScript 5.

## Текущее состояние

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wihome-dev/wb-rules-typescript/build.yml?branch=latest&logo=github&style=flat-square)
[![GitHub Repo Stars](https://img.shields.io/github/stars/wihome-dev/wb-rules-typescript?color=594ae2&style=flat-square&logo=github)](https://github.com/wihome-dev/wb-rules-typescript/stargazers)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/wihome-dev/wb-rules-typescript?color=594ae2&style=flat-square&logo=github)](https://github.com/wihome-dev/wb-rules-typescript)

## Фреймворк «Мирта»
Дальнейшее развитие идеи привело к появлению модулей правил, которые расширяют подходы к разработке:
- событийная модель - обеспечивает реакцию на изменения,
- хранилище состояний - надстройка над `module.static`,
- имитатор запуска на контроллере - для юнит-тестов,
- контролы устройств в виде плагинов - для передачи функционала без дублирования кода.

Чтобы не перегружать излагаемые в начальных статьях принципы, было решено создать [отдельный репозиторий](https://github.com/wb-mirta/core#readme). Там вспомогательный код вынесен в npm-пакеты с поддержкой версионирования - больше не требуется вникать в абсолютно все правки, достаточно в `package.json` обновить номер версии соответствующего пакета. Имеется мастер начальной настройки, доступный к вызову из командной строки - задаёт ряд вопросов и настраивает проект по вашим предпочтениям. С версии `0.2.3` реализована полноценная работа с JavaScript. Доступен современный синтаксис, подсветка конструкций wb-rules, переменные окружения, tree-shaking и т.п.

## Начало работы с шаблоном

Потребуется предварительно установить nodejs в варианте LTS и менеджер пакетов yarn.

Запустить сборку можно нажав сочетание клавиш <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> и выбрав из выпадающего меню опцию `yarn: build`.

Перед использованием команды `deploy` в файле `package.json`, потребуется настроить её на подключение к Вашему контроллеру Wirenboard.

Скачайте ZIP-архив и распакуйте его в целевую директорию, после чего откройте проект при помощи Visual Studio Code.

<b>Примечание:</b><br/>
в статьях о разработке правил целевой директорией в системе Windows является `D:\repos\wirenboard`.

Ветка [latest](https://github.com/wihome-dev/wb-rules-typescript/tree/latest) является экспериментальной и может опережать ход повествования.

## Полезные ссылки

Движок правил wb-rules 2.0:<br/>
https://github.com/wirenboard/wb-rules

Канал про автоматизации на основе оборудования Wirenboard на Дзене:<br/>
https://dzen.ru/wihome

### Серия руководств

О программировании контроллера Wirenboard с помощью Visual Studio Code:

- [Перед началом](https://dzen.ru/a/aCLjKbtWvw8Xgyhy)
- [Пишем на TypeScript без ограничений](https://dzen.ru/a/aCg1B5ghH0M-pFXY)
- [Статический анализ кода при помощи ESLint и Prettier](https://dzen.ru/a/aCuMffKDJV1jgzaY)
- [Создаём юнит-тесты с применением Jest](https://dzen.ru/a/aC1B4K3VQRsD4pYB)
- [Удаляем лишний код при помощи Rollup и Tree-Shaking](https://dzen.ru/a/aDk_iti4dG6GEDS3)  
- [Переменные окружения](https://dzen.ru/a/aD32tRnTm0PW3nJe)

Вторая статья в подробностях рассказывает о структуре проекта, которая легла в основу данного шаблона.

Подборка статей [о тонкостях настройки контроллера по SSH](https://dzen.ru/suite/7646a2f0-8e73-45ae-b8f1-a097412ab38c):<br/>
от терминала Windows до запрета root-доступа на контроллер.

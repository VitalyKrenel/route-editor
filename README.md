### :pencil2: Route Editor

Тестовое задание от компании [FunBox](https://funbox.ru/) на должность JS-разработчика.

Условие задания можно прочесть [здесь](https://dl.funbox.ru/qt-js.pdf).

Ответы на вопросы части Level I расположены в отдельном [PDF документе](https://github.com/VitalyKrenel/route-editor/blob/master/Test_assignment_Level-1.pdf).

Запуск:
```
 npm install
 npm start
```

#### Unit-тесты

Запустить все unit-тесты с --verbose флагом и без watch-режима:

```
npm run test:unit
```

#### Integration-тесты

> В данном случае я отношу к интеграционным тесты, которые пытаются охватить несколько компонентов или их взаимодействие. Тесты данного типа находятся в папке `src/__tests__`.

Запустить все integration-тесты с --verbose флагом, без watch режима:

```
npm run test:integration
```

#### Библиотеки

- Проект построен при помощи [Create React App](https://facebook.github.io/create-react-app/) (2.0.x)
- Тесты написаны с использование [Jest](https://jestjs.io/), [Sinon](https://sinonjs.org/) и [Enzyme](https://airbnb.io/enzyme/) (тестирование React-компонентов).
- В основе UI - [React](https://facebook.github.io/create-react-app/)

#### CSS Методология
Для написания CSS использовался BEM подход (с React [соглашением по именованию](https://en.bem.info/methodology/naming-convention/#react-style))


#### Notes:

*Настройка тестов:* В `src/setupTests.js` происходит патч Jest функции `it`, чтобы она не падала, если тело теста пропущено (для написания спецификации достаточно только описания теста).

В 24 версии Jest появится (уже смержили в alpha) `it.todo` для этих же целей - после релиза стабильной версии можно будет удалить monkey patching.

*Переменные окружения:* В `.env` указывается NODE_PATH переменная, чтобы при сборке модули (относительные пути, начинающиеся не `./`, `../`, etc) корректно разрешались и добавлялись в bundle.

*Деплой:* Деплой осуществляется на Github Pages, в ветку `gh-pages` при помощи одноименного npm пакета. Create-react-app учитывает поле `homepage` файла package.json, поэтому сборка происходит с учетом относительного пути расположения. 

# Project 1 React-Chess

Это мой первый проект на Github.

***

### Описание:
Простые шахматы

### Используемые технологии:
* Typescript
* React
* Bootstrap
* Webpack
* Git

### Цели проекта:
Попробовать на практике:
*  React.
*  Typescript.
*  Git.
*  Научиться использовать пакеты eslint, husky в связке с Git.
*  Ознакомительное использование пакета для тестирования jest.

### Описание структуры классов:
Основная идея заключается в отделении фигур от логики взаимодействия с ними.

Есть шахматная доска. В ней есть клетки доски. В клетке фигуры.
Классы не знают о других классах, находящихся выше в иерархии вложенности.

Далее идет управляющий класс(ChessboardManager), о котором шахматная доска также ничего не знает.

Все остальные классы являются вспомогательными.

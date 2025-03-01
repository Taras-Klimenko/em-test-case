# Система работы с обращениями

Данный проект - это система работы с обращениями, созданная в рамках выполнения тестового задания.

При выполнении использовался стек технологий:

- TypeScript, Node.js, Express, Prisma, PostgreSQL для бэкенда
- TypeScript, React, Vite для фронтенда

В этом описании содержится руководство по настройке и запуску проекта в локальном окружении после клонирования репозитория.

## Table of Contents

- [Перед началом](#перед-началом)
- [Структура](#структура)
- [Инструкции по установке](#инструкции-по-установке)
  - [1. Склонировать репозиторий](#1-склонировать-репозиторий)
  - [2. Настроить серверную часть](#2-настроить-серверную-часть)
  - [3. Настроить клиентскую часть](#3-настроить-клиентскую-часть)
- [Запуск проекта](#запуск-проекта)
- [Документация API](#документация-API)
- [Устранение проблем](#устранение-проблем)

## Перед началом

Перед началом необходимо убедиться в наличии установленных:

- **Node.js (v14 или более новая) и npm**
- **PostgreSQL**
- **Git**

## Структура

```
/em-test-case
  ├── client/ # Клиентская часть на TypeScript, React
  ├── server/ # Серверная часть на TypeScript, Node.js, Express, Prisma
  └── README.md # Данная инструкция
```

## Инструкции по установке

### 1. Склонировать репозиторий

```bash
git clone https://github.com/Taras-Klimenko/em-test-case.git
cd em-test-case
```

### 2. Настроить серверную часть

2.1 Перейти в директорию сервера, установить зависимости:

```bash
cd server
npm install
```

2.2 Создать и сконфигурировать файл с переменными окружения (пример можно найти в файле `.env_example`):

```env
PORT=3000
DATABASE_URL="postgresql://postgres_username:password@localhost:5432/database_name?schema=public"
```

2.3 Настроить ORM, подключение к базе данных Postgres и провести миграцию:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

2.4 _Опционально_ - можно запустить `seed` (заполнить базу тестовыми данными):

```bash
npm run seed
```

2.5 Запустить сервер:

```bash
npm run dev
```

### 3. Настроить клиентскую часть

3.1 Создать новый терминал и перейти в директорию клиентской части:

```bash
cd client
```

3.2 Установить зависимости:

```bash
npm install
```

3.3 Создать и сконфигурировать файл с переменными окружения (пример можно найти в файле `.env_example`):

```env
VITE_API_URL=http://localhost:3000
```

3.4 Запустить клиентскую часть:

```bash
npm run dev
```

## Запуск проекта

1. Запустить серверную часть - в директории `server` выполнить:

```bash
npm run dev
```

2. Запустить клиентскую часть: в директории `client` выполнить:

```bash
npm run dev
```

3. Открыть приложение в браузере (адрес по умолчанию: http://localhost:5173).

## Документация API

Для документирования API используется Swagger/OpenAPI. После запуска сервера перейдите по ссылке:

```bash
http://localhost:3000/api-docs
```

где можно увидеть все доступные эндпоинты, схемы запросов и ответов и даже протестировать эндпоинты прямо из браузера.

## Устранение проблем

**Не удается подключиться к базе данных:**

Убедитесь, что сервер PostgreSQL работает и строка доступа в файле `.env` на сервере содержит правильную информацию.

**Конфликтующие порты:**

Убедитесь, что другие запущенные приложения не используют порт 3000 (или тот, который выбран для сервера) и 5173 (порт для клиентской части по умолчанию).

**Не настроены переменные окружения:**

Убедитесь, что файлы `.env` находятся в корректных директориях и названия переменных окружения точно совпадают с предоставленными примерами.

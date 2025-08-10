Chart Analysis Tool — PWA
========================

Файлы:
  - index.html
  - style.css
  - app.js
  - manifest.json
  - service-worker.js
  - icons/icon-192.png
  - icons/icon-512.png

Быстрая инструкция для деплоя на GitHub + Vercel:

1) Инициализируй git-репозиторий:
   git init
   git add .
   git commit -m "Initial PWA commit"

2) Создай репозиторий на GitHub и запушь:
   git remote add origin https://github.com/USERNAME/REPO.git
   git branch -M main
   git push -u origin main

3) Перейди в Vercel, импортируй репозиторий и задеплой.
   По умолчанию Vercel сам развернёт статический сайт.

4) После деплоя проверь:
   - Открой сайт в Chrome на телефоне.
   - Нажми в меню "Добавить на главный экран".
   - Отключи интернет — приложение должно открываться (кэш).

Примечание:
- Для реального AI-анализа нужно прикрутить бэкенд (API).
- Если иконки выглядят слишком простыми — замени icons/*.png на свои.

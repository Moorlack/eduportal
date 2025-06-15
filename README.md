# Освітній портал `eduportal`

Веб-додаток для сертифікаційної програми "Технології аналізу та обробки даних (Data Science) в комп’ютерних системах".

## Встановлення

### Бекенд
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
### Фронтенд
```bash
cd frontend
npm install
npm start
```

## API
•	Список курсів: GET /api/courses/  
•	Реєстрація: POST /api/register/  
•	Документація: /swagger/

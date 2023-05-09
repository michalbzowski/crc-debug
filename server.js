import express from "express";
import cors from "cors";
import session from 'express-session';
import pgPromise from 'pg-promise';
const pgp = pgPromise({/* Initialization Options */ });
const db = pgp('postgres://postgres:postgres@localhost:5432/postgres')
import bcrypt from 'bcrypt'

import { InMemoryUsersRepository } from "./users-repository.js";
import { InMemoryTrainingsRepository } from "./trainings-repository.js";


const app = express();
const PORT = 8080;
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));

// app.use(function(req, res, next) {
//   console.log("Preprocessing")
//   next();
//   console.log("Postprocessing")
// });

app.get("/", (req, res) => {
  res.send("OK");
});

let users = new InMemoryUsersRepository();
let trainings = new InMemoryTrainingsRepository();

// Rejestracja nowego użytkownika

// curl -c c.txt -X POST http://localhost:8080/register -H "Content-Type: application/json" -d '{"username":"puzon","password":"Kotek123"}'
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Nazwa użytkownika i hasło są wymagane\n');
  }

  const existingUser = users.find(username);
  if (existingUser) {
    return res.status(409).send('Nazwa użytkownika jest już zajęta\n');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username, password: hashedPassword };
  users.push(user);

  req.session.userId = user.username;
  res.status(201).send('Użytkownik został zarejestrowany\n');
});

// Zmiana hasła użytkownika
// curl -b c.txt -X POST http://localhost:8080/change-password -H "Content-Type: application/json" -d '{"oldPassword":"Kotek123","newPassword":"Kotek"}'
app.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = users.find(req.session.userId);
  if (!user) {
    return res.status(401).send('Użytkownik niezalogowany\n');
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    return res.status(401).send('Nieprawidłowe hasło\n');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  res.status(200).send('Hasło zostało zmienione\n');
});

// Logowanie użytkownika
// curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d '{"username":"puzon","password":"Kotek123"}'
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(username);
  if (!user) {
    return res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło\n');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło\n');
  }

  req.session.userId = user.username;
  res.status(200).send('Zalogowano\n');
});

// Endpoint do odczytu wszystkich szkoleń
//curl -X GET http://localhost:8080/trainings -H "Content-Type: application/json"
app.get('/trainings', (req, res) => {
  res.json(trainings.findAll());
});

// Endpoint do odczytu pojedynczego szkolenia
//curl -X GET http://localhost:8080/trainings/:id -H "Content-Type: application/json"

app.get('/trainings/:id', (req, res) => {
  const id = req.params.id;
  const training = trainings.find(id);

  if (!training) {
    res.status(404).json({ message: 'Szkolenie o podanym ID nie zostało znalezione.' });
  } else {
    res.json(training);
  }
});

// Endpoint do dodawania nowego szkolenia
//curl -X POST http://localhost:8080/trainings -H "Content-Type: application/json" -d '{"name":"puzon","date":"2023-05-09", "instructor":"Johny Piedro", "level":"basic"}'
app.post('/trainings', (req, res) => {
  const { name, date, instructor, level } = req.body;

  const newTraining = {
    id: Date.now(),
    name,
    date,
    instructor,
    level
  };

  trainings.push(newTraining);
  res.status(201).json(newTraining);
});

// Endpoint do aktualizacji istniejącego szkolenia
//curl -X PUT  http://localhost:8080/trainings/1683631704815 -H "Content-Type: application/json" -d '{"name":"puzon","date":"2023-05-09", "instructor":"Johny Piedro", "level":"advanced"}'
app.put('/trainings/:id', (req, res) => {
  const id = req.params.id;
  const { name, date, instructor, level } = req.body;

  const updatedTraining = trainings.find(training => training.id === id);

  if (!updatedTraining) {
    res.status(404).json({ message: 'Szkolenie o podanym ID nie zostało znalezione.' });
  } else {
    trainings.update(id, name, date, instructor, level);
    res.json(updatedTraining);
  }
});

// Endpoint do usuwania szkolenia
//curl -X DELETE  http://localhost:8080/trainings/1683631704815
app.delete('/trainings/:id', (req, res) => {
  const id = req.params.id;
  const index = trainings.delete(id);
  if (index = -1) {
    res.status(404).json({ message: 'Szkolenie o podanym ID nie zostało znalezione.\n' });
  } else {
    res.status(204).json({ message: 'Usunięto pomyślnie.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

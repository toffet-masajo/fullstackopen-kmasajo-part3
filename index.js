const express = require('express');

const app = express();

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(persons)
});

app.get('/api/info', (req, res) => {
  const data = 
    `<p>Phonebook has ${persons.length} entries</p>
     <p>${new Date()}</p>`
  res.send(data)
});

app.get('/api/person/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = persons.find(person => person.id === id);
  if(item) res.json(item);
  else res.status(404).end();
});

app.delete('/api/person/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
    
  res.status(204).end();
});

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

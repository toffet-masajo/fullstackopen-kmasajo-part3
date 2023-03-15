const express = require('express');

const MAX_ENTRIES = 100;

const app = express();
app.use(express.json());

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
  res.json(persons);
});

app.get('/api/info', (req, res) => {
  const data = 
    `<p>Phonebook has ${persons.length} entries</p>\n<p>${new Date()}</p>`;
  res.send(data);
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

app.post('/api/persons', (req, res) => {
  const person = req.body;
    
  let id = Math.floor(Math.random() * MAX_ENTRIES);
  while(persons.find(person => person.id === id));

  person.id = id;
  persons = persons.concat(person);
    
  res.json(person);
});
      
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

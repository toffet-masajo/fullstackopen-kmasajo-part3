require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const MAX_ENTRIES = 100;

const app = express();
app.use(express.json());
app.use(express.static('build'));

morgan.token('type', function(req, res) {return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));

app.use(cors());

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
  Person.find({}).then(results => {
    res.json(results);
  })
});

app.get('/api/info', (req, res) => {
  Person.find({}).then(results => {
    const data = 
      `<p>Phonebook has ${results.length} entries</p>\n<p>${new Date()}</p>`;
    res.send(data);
  });
});

app.get('/api/person/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person);
    });
});
  
app.delete('/api/person/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
    
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const person = req.body;

  if(person.name === undefined || person.name === null || person.name.length <= 0)
    res.status(400).json({'error': 'name missing'}).end();
  else if(person.number === undefined || person.number === null || person.number.length <= 0)
    res.status(400).json({'error': 'number missing'}).end();
  else {
    const personObj = new Person({"name" : person.name, "number" : person.number});

    personObj.save().then(result => {
      res.json(result);
    });
  }
});
      
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) res.json(person);
      else res.status(404).end();
    })
    .catch(error => next(error));
});
  
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;  
  const person = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(
    req.params.id, 
    person, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if(result) res.json(person);
      else res.status(404).send({error: 'unknown id'});
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const person = req.body;
  const personObj = new Person({"name" : person.name, "number" : person.number});

  personObj
    .save()
    .then(result => {
      res.json(result);
    })
    .catch(error => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if( error.name === 'CastError' )
    return res.status(400).send({error: 'malformed id'});
  else if( error.name === 'ValidationError' )
    return res.status(400).json({error: error.message});

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);
      
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

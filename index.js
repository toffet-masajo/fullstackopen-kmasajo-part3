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

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(result => {
      if(result) res.json(person);
      else res.status(404).send({error: 'unknown id'});
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res) => {
  const person = req.body;

  if(person.name === undefined || person.name === null || person.name.length <= 0)
    res.status(400).json({ error: 'name missing' }).end();
  else if(person.number === undefined || person.number === null || person.number.length <= 0)
    res.status(400).json({ error: 'number missing' }).end();
  else {
    const personObj = new Person({"name" : person.name, "number" : person.number});

    personObj.save().then(result => {
      res.json(result);
    });
  }
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'});
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if( error.name === 'CastError' )
    return res.status(400).send({error: 'malformed id'});

  next(error);
};

app.use(unknownEndpoint);
app.use(errorHandler);
      
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

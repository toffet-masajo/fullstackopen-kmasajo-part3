const mongoose = require('mongoose');

if( process.argv.length < 3) {
  console.log(`Usage:\n node ${process.argv[1]} <password> [<name> <number>]`);
  process.exit(1);
}

const password = process.argv[2];

const MONGO_URL=`mongodb+srv://fullstack:${password}@fullstackopen.vrpdwcv.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if(process.argv.length === 5) {
  const personName = process.argv[3];
  const personNumber = process.argv[4];

  const person = new Person({
    name: personName,
    number: personNumber
  });

  person.save().then(result => {
    console.log(`added ${personName} number ${personNumber} to phonebook`);
    mongoose.connection.close();
    process.exit(0);
  });
} else {
  console.log('phonebook:');
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
  
    mongoose.connection.close();
    process.exit(0);
  });
}

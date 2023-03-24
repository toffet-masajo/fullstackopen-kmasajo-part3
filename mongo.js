const mongoose = require('mongoose');

const args = process.argv;

if( args.length < 3) {
  console.log(`Usage:\n node ${args[1]} <password> [<name> <number>]`);
  process.exit(1);
}

const password = args[2];

const MONGO_URL=`mongodb+srv://fullstack:${password}@fullstackopen.vrpdwcv.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if(args.length === 5) {
  const personName = args[3];
  const personNumber = args[4];

  const person = new Person({
    name: personName,
    number: personNumber
  });

  person.save().then(() => {
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

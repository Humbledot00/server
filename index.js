const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

const hostname = '0.0.0.0';

// Connection URL and database name for MongoDB Atlas
const url = 'mongodb+srv://workforshreyas:honey1203@cluster0.he9gqe9.mongodb.net/?retryWrites=true&w=majority';
const dbName = '<your-database-name>'; // Replace with your actual database name

const collectionName = 'events'; 

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connection success');
}).catch((err) => console.log('No connection', err));

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., HTML files)
app.use(express.static('public'));

app.post('/sign_up', async (req, res) => {
    try {
        let registrationNumber;

        // Fetch the current counter value from the database
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const configCollection = db.collection('config'); // Collection to store the counter
        const counterDocument = await configCollection.findOne({ name: 'registrationCounter' });

        if (counterDocument) {
            // Use the current counter value as part of the registration number
            const currentCounter = counterDocument.value;
            registrationNumber = `CORE00${currentCounter}`;

            // Increment the counter for the next registration
            await configCollection.updateOne(
                { name: 'registrationCounter' },
                { $inc: { value: 1 } }
            );
        } else {
            // Initialize the counter if it doesn't exist
            await configCollection.insertOne({ name: 'registrationCounter', value: 1 });
            registrationNumber = 'CORE-1';
        }

        // Prepare the user data
        const userData = {
            name: req.body.name,
            email: req.body.email,
            usn: req.body.usn,
            year: req.body.year,
            department: req.body.department,
            areaofinterest: req.body.areaofinterest,
            registrationNumber: registrationNumber, // Include the registration number in user data
            // Add more user details here as needed
        };

        // Connect to the MongoDB database
        const collection = db.collection('membership');

        // Insert user data into the database
        await collection.insertOne(userData);

        // Close the database connection
        client.close();

        res.redirect(`/success.html?registrationNumber=${registrationNumber}&name=${req.body.name}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing registration');
    }
});

app.get('/event', async (req, res) => {
    let client; // Declare client at a higher scope
  
    try {
      client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
  
      // Assuming you have an event with ID 1, adjust the query based on your schema
      const eventData = await collection.findOne();
  
      res.json(eventData);
    } catch (error) {
      console.error('Error fetching event data', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (client) {
        client.close();
      }
    }
  });

  app.get('/upcomingevs', async (req, res) => {
    let client; // Declare client at a higher scope
  
    try {
      client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('eventlist');
  
      // Assuming you have an event with ID 1, adjust the query based on your schema
      const eventData = await collection.find().toArray();;
  
      res.json(eventData);
    } catch (error) {
      console.error('Error fetching event data', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (client) {
        client.close();
      }
    }
  });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Serve the 'index.html' file
});

app.listen(PORT, hostname,() => {
    console.log(`Server listening at http://localhost:${hostname}:${PORT}`);
});

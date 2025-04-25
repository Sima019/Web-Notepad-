const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = 5000;
const MONGO_URI = 'mongodb+srv://sima-db:sima-db@cluster0.0h1c0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const DATABASE_NAME = 'notepad-app';
const COLLECTION_NAME = 'notes';

let db;
let notesCollection;

// Connect to MongoDB
async function connectToDB() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    notesCollection = db.collection(COLLECTION_NAME);
    console.log('Connected to MongoDB');
}

connectToDB();

// Get all notes
app.get('/api/notes', async (req, res) => {
    try {
        const notes = await notesCollection.find({}).toArray();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
});


// POST route to add a new task
app.post('/api/notes', async (req, res) => {
    try {
        const { title, description } = req.body;
        
        // Validate inputs
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        const result = await notesCollection.insertOne({ title, description });
        console.log(result)
        res.status(201).json(result.ops[0]);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a note by ID
app.put('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
        const result = await notesCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { title, description } },
            { returnDocument: 'after' }
        );
        res.json(result.value);
    } catch (error) {
        res.status(500).json({ message: 'Error updating note' });
    }
});

// Delete a note by ID
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await notesCollection.deleteOne({ _id: new ObjectId(id) });
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.json("server connected");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

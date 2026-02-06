import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'events.json');

app.use(cors());
app.use(express.json());

// Helper to read data
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        return [];
    }
}

// Helper to write data
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes
app.get('/api/events', async (req, res) => {
    try {
        const events = await readData();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read events' });
    }
});

app.post('/api/events', async (req, res) => {
    try {
        const newEvent = req.body;
        const events = await readData();
        events.push(newEvent);
        await writeData(events);
        res.status(201).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save event' });
    }
});

app.put('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedEvent = req.body;
        const events = await readData();
        const newEvents = events.map(e => e.id === id ? updatedEvent : e);
        await writeData(newEvents);
        res.json(newEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event' });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const events = await readData();
        const newEvents = events.filter(e => e.id !== id);
        await writeData(newEvents);
        res.json(newEvents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

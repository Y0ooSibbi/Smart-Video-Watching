// app.js
const express = require('express');
const { getTranscript, validateID } = require('./transcriptUtils'); // Adjust the path accordingly
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors())

const port = 3000;

// Define a route to fetch video transcript
app.get('/transcript', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        const transcript = await getTranscript(videoId);
        res.send(transcript);
    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({ error: 'Failed to fetch transcript' });
    }
});


app.get('/search', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        // Fetch the transcript based on the video ID
        const transcript = await axios.get(`http://localhost:${port}/transcript?videoId=${videoId}`);
        const transcriptData = transcript.data;

        // Extract the keyword from the query parameter
        const keyword = req.query.keyword;
        console.log(keyword);

        // Search the transcript data for the keyword
        const result = transcriptData.find((item) => item.text.toLowerCase().includes(keyword.toLowerCase()));

        // Check if the keyword is found
        if (result) {
            // Return the timestamp if found
            res.status(200).json({ timestamp: result.start });
        } else {
            // Return a message if keyword is not found
            res.status(404).json({ message: 'Keyword not found in the transcript.' });
        }
    } catch (error) {
        console.error('Error searching transcript:', error);
        res.status(500).json({ error: 'Failed to search transcript' });
    }
});


// Define a route to validate video ID
app.get('/validateID', async (req, res) => {
    try {
        const videoId = req.query.videoId;
        const isValid = await validateID(videoId);
        res.send({ isValid });
    } catch (error) {
        console.error('Error validating video ID:', error);
        res.status(500).json({ error: 'Failed to validate video ID' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

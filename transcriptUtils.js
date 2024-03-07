// transcriptUtils.js
const axios = require('axios');
const cheerio = require('cheerio');

async function getTranscript(id) {
    const response = await axios.get(`https://youtubetranscript.com/?server_vid2=${id}`);
    const $ = cheerio.load(response.data);
    const err = $('error');
  
    if (err.length) throw new Error(err.text());
    
    const transcripts = $('transcript text').map((i, elem) => {
        const $a = $(elem);
        return {
            text: $a.text(),
            start: $a.attr('start'),
            duration: $a.attr('dur')
        };
    }).toArray();
    
    return transcripts;
}

async function validateID(id) {
    try {
        await axios.get(`https://video.google.com/timedtext?type=track&v=${id}&id=0&lang=en`);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { getTranscript, validateID };

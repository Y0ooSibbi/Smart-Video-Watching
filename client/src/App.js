// App.js
import React, { useState } from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';

function App() {
  const [videoId, setVideoId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [seekToTime, setSeekToTime] = useState(0);
  const [timestamp, setTimestamp] = useState(null);
  const [searchWord, setSearchWord] = useState('');

  const handleChange = (event) => {
    setVideoId(getYouTubeID(event.target.value));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

  const handleSeekTo = () => {
    if (seekToTime !== null) {
      // Accessing the YouTube player instance and calling seekTo method
      const player = window.player;
      if (player) {
        player.seekTo(seekToTime);
      }
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/search?videoId=${videoId}&keyword=${searchWord}`);
      const data = response.data;
      console.log(Math.round(data.timestamp));
      setTimestamp(Math.round(data.timestamp));
      const player = window.player;
      if (player) {
        player.seekTo(timestamp-1);
      }
    } catch (error) {
      console.error('Error searching for word:', error);
    }
  };

  const handleTimeChange = (event) => {
    // Convert timestamp to seconds
    const time = event.target.value;
    const [minutes, seconds] = time.split(':');
    const totalSeconds = parseInt(minutes) * 60 + parseInt(seconds);
    setSeekToTime(totalSeconds);
  };

  // Function to extract YouTube video ID from URL
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div>
      <input type="text" placeholder="Enter YouTube Video URL" onChange={handleChange} />
      {videoId && (
        <div>
          <YouTube
            videoId={videoId}
            opts={{ width: '100%', playerVars: { autoplay: 0 } }}
            onReady={(event) => (window.player = event.target)} // Save player instance to window object
          />
          <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
          <input type="text" placeholder="Enter timestamp (mm:ss)" onChange={handleTimeChange} />
          <button onClick={handleSeekTo}>Skip to timestamp</button>
        </div>
      )}
            <input type="text" placeholder="Enter word to search" value={searchWord} onChange={(e) => setSearchWord(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

    </div>
  );
}

export default App;

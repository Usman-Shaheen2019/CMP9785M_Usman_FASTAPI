import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { postAPI, getAPI } from '../utils/APIClient';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function AddCohereLLMJoke() {
  const { accessToken, tokenType } = useAuth();
  const nav = useNavigate();
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [generatedJoke, setGeneratedJoke] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('');

  useEffect(() => {
    // Fetch categories from your API
    getAPI('dailyjoke/getCategory', accessToken, tokenType)
      .then((data) => {
        console.log(data);
        setCategories(data); // Assuming data is an array of categories
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [accessToken, tokenType]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!summary.trim() || !tone.trim()) {
      setError('Summary and Tone are required');
      setIsLoading(false);
      return;
    }

    const body = {
      text: summary,
      category_tone: tone
    };

    postAPI('dailyjoke/cohere_llm_joke/', body, accessToken, tokenType)
      .then((data) => {
        console.log('API Response:', data);
        const jokeText = data?.["Cohere Generate Joke"]?.text || '';
        console.log('Generated Joke:', jokeText);
        setGeneratedJoke(jokeText);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsLoading(false);
      });
  };

  const handleSave = () => {
    if (!category.trim() || !generatedJoke.trim()) {
      setError('Category and Generated Joke are required to save');
      return;
    }

    const body = {
      text: generatedJoke,
      category: category,
    };

    postAPI('dailyjoke/create', body, accessToken, tokenType)
      .then(() => {
        nav("/");
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography component="h1" variant="h5">
          Generate Cohere LLM Joke
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} mt={3}>
        <FormControl fullWidth margin="normal" required error={!!error && (!tone.trim() || !summary.trim())} helpertext={!!error && (!tone.trim() || !summary.trim()) ? error : ''}>
          <InputLabel id="tone-label">Tone</InputLabel>
          <Select
            labelId="tone-label"
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="PUN">Pun</MenuItem>
            <MenuItem value="FUNNY">Funny</MenuItem>
            <MenuItem value="HUMOROUS">Humorous</MenuItem>
            <MenuItem value="Happy">Happy</MenuItem>
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          required
          fullWidth
          id="summary"
          label="Write a Joke:"
          name="Write a Joke:"
          multiline
          rows={4}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Generate Joke
          </Button>
        )}

        <TextField
          margin="normal"
          fullWidth
          id="generatedJoke"
          label="Generated Joke:"
          name="Generated Joke:"
          multiline
          rows={4}
          value={generatedJoke}
          InputProps={{
            readOnly: true,
          }}
        />

        <FormControl fullWidth margin="normal" error={!!error && !category.trim()} helpertext={!!error && !category.trim() ? error : ''}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((categoryItem) => (
              <MenuItem key={categoryItem.id} value={categoryItem.category_name}>
                {categoryItem.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSave}
          disabled={!generatedJoke.trim()}
        >
          Save Joke
        </Button>
      </Box>
    </Box>
  );
}

export default AddCohereLLMJoke;
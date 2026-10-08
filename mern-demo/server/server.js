const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Câu 22: API GET /api/hello
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend dang hoat dong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
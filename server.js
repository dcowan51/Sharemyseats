const express = require('express'); // Require express only once
const path = require('path');
const app = express();
const ticketRoutes = require('./routes/tickets'); // Define ticket routes only once

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Use ticket routes
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
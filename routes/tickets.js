const express = require('express');
const mongoose = require('mongoose'); // Import mongoose to generate ObjectIds
const router = express.Router();
const Ticket = require('../models/Ticket');

// Create a new ticket
router.post('/', async (req, res) => {
  const { event, date, section, row, seat } = req.body;
  
  // Generate a new ObjectId for the user (for testing purposes)
  const user = new mongoose.Types.ObjectId(); // Replace this with an actual user ID if available

  try {
    const newTicket = new Ticket({ event, date, section, row, seat, user });
    const savedTicket = await newTicket.save();
    res.json(savedTicket);
  } catch (err) {
    console.error('Error creating ticket:', err); // Log the actual error to the console
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get all tickets for a user
router.get('/:userId', async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.params.userId });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve tickets' });
  }
});

// Update a ticket (e.g., mark as donated)
router.put('/:id', async (req, res) => {
  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// Delete a ticket
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router; // Export the router only once at the end of the file
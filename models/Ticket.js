const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  row: {
    type: String,
    required: true
  },
  seat: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donated: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);
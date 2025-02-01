const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  period: { type: String, enum: ['daily', 'monthly', 'yearly'], required: true },
  sales: { type: Number, required: true },
  revenue: { type: Number, required: true },
});

module.exports = mongoose.model('Sales', salesSchema);

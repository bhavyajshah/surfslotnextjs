import mongoose from 'mongoose';

const spotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  conditions: {
    waveHeight: String,
    wind: String,
    tide: String,
    bestTimeToSurf: [String]
  }
});

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  active: { type: Boolean, default: false },
  spots: [spotSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);
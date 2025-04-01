const express = require('express');
const cors = require('cors');
const { parsePhoneNumber } = require('libphonenumber-js');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/normalize', (req, res) => {
  const { phone, country = 'DE' } = req.body;
  try {
    const number = parsePhoneNumber(phone, country);
    if (!number || !number.isValid()) {
      return res.status(400).json({ valid: false, error: 'Invalid phone number' });
    }

    return res.json({
      e164: number.format('E.164'),
      national: number.formatNational(),
      international: number.formatInternational(),
      type: number.getType(),
      country: number.country,
      valid: true
    });
  } catch (err) {
    return res.status(500).json({ error: 'Parsing failed', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Phone Normalizer API is running. POST to /api/normalize with { phone, country }');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

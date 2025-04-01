import { parsePhoneNumber } from 'libphonenumber-js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, country = 'DE' } = req.body;

  try {
    const number = parsePhoneNumber(phone, country);
    if (!number || !number.isValid()) {
      return res.status(400).json({ valid: false, error: 'Invalid phone number' });
    }

    return res.status(200).json({
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
}

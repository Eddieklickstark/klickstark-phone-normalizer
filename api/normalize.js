import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default function handler(req, res) {
  const { phone } = req.body
  const defaultCountry = 'DE' // Deutschland als Standard

  try {
    // Schritt 1: Nummer bereinigen und normalisieren.
    // - Ersetze eine führende "00" durch "+".
    // - Entferne danach alle Zeichen außer Ziffern und dem Pluszeichen.
    const normalizedPhone = phone.trim().replace(/^00/, '+').replace(/[^0-9\+]/g, '')

    // Schritt 2: Parsen mit der normalisierten Nummer.
    const phoneNumber = parsePhoneNumberFromString(normalizedPhone, defaultCountry)

    // Schritt 3: Validieren.
    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ valid: false, reason: 'Invalid or unparseable number' })
    }

    // Schritt 4: Erfolgreiche Antwort zurückgeben.
    return res.status(200).json({
      e164: phoneNumber.number,
      valid: true,
      country: phoneNumber.country
    })

  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message })
  }
}

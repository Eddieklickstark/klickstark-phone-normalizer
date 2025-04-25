import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default function handler(req, res) {
  const { phone } = req.body
  const defaultCountry = 'DE'

  try {
    let phoneNumber

    const cleaned = phone.replace(/[^0-9+]/g, '')

    // Wenn mit + oder 00 beginnt → direkt verwenden
    if (/^(\+|00)/.test(cleaned)) {
      phoneNumber = parsePhoneNumberFromString(cleaned)
    }
    // Wenn mit internationalem Präfix OHNE + → ergänze +
    else if (/^(49|41|43|352)\d{7,12}$/.test(cleaned)) {
      phoneNumber = parsePhoneNumberFromString('+' + cleaned)
    }
    // Sonst: lokale Nummer → Defaultland verwenden
    else {
      phoneNumber = parsePhoneNumberFromString(cleaned, defaultCountry)
    }

    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ valid: false, reason: 'Invalid number' })
    }

    return res.status(200).json({
      e164: phoneNumber.number,
      valid: true,
      country: phoneNumber.country
    })

  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message })
  }
}

import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default function handler(req, res) {
  const { phone } = req.body
  const defaultCountry = 'DE'

  try {
    let phoneNumber

    // Wenn mit + oder 00 → kein Standardland
    if (/^(\+|00)/.test(phone)) {
      phoneNumber = parsePhoneNumberFromString(phone)
    } else {
      phoneNumber = parsePhoneNumberFromString(phone, defaultCountry)
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

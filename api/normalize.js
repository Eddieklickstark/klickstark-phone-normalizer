import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default function handler(req, res) {
  const { phone } = req.body;
  const defaultCountry = 'DE';

  try {
    let numberToParse;
    const trimmedPhone = phone.trim();

    // 1. Fall: Nummer beginnt bereits mit "+". Perfekt.
    if (trimmedPhone.startsWith('+')) {
      numberToParse = trimmedPhone;
    }
    // 2. Fall: Nummer beginnt mit "00". Ersetze durch "+".
    else if (trimmedPhone.startsWith('00')) {
      numberToParse = '+' + trimmedPhone.substring(2);
    }
    // 3. Fall: Nummer beginnt mit einer bekannten Ländervorwahl (OHNE "+"/ "00").
    // Wir fügen hier die für euch relevanten Ländervorwahlen hinzu (49=DE, 41=CH, 43=AT).
    // Die Nummer wird für den Test von Leerzeichen und Klammern befreit.
    else if (/^(49|41|43)/.test(trimmedPhone.replace(/[\s\(\)\-]/g, ''))) {
      numberToParse = '+' + trimmedPhone;
    }
    // 4. Fall: Alle anderen Nummern (z.B. lokale deutsche Nummern wie "0176...")
    else {
      numberToParse = trimmedPhone;
    }

    // Jetzt wird die vorbereitete Nummer mit dem `defaultCountry` geparst.
    // Die Bibliothek ist intelligent genug, um mit Leerzeichen, etc. umzugehen.
    const phoneNumber = parsePhoneNumberFromString(numberToParse, defaultCountry);

    // Validieren
    if (!phoneNumber || !phoneNumber.isValid()) {
      return res.status(400).json({ valid: false, reason: 'Invalid or unparseable number', original: phone, parsedAttempt: numberToParse });
    }

    // Erfolgreiche Antwort
    return res.status(200).json({
      e164: phoneNumber.number,
      valid: true,
      country: phoneNumber.country
    });

  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message });
  }
}

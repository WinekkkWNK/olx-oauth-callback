// Endpoint odbierający callback OAuth z OLX
// Po zalogowaniu, OLX przekieruje tutaj z parametrem ?code=...
// Ten kod trzeba wymienić na access token (drugi krok OAuth)

module.exports = async function handler(req, res) {
  const { code, error, state } = req.query;

  // OLX zwrócił błąd (np. użytkownik odmówił dostępu)
  if (error) {
    res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px;">
          <h2>Błąd autoryzacji</h2>
          <p>OLX zwrócił błąd: <strong>${error}</strong></p>
        </body>
      </html>
    `);
    return;
  }

  // Brak kodu - ktoś wszedł na endpoint bez przejścia przez OLX
  if (!code) {
    res.status(400).send(`
      <html>
        <body style="font-family: sans-serif; padding: 40px;">
          <h2>Brak kodu autoryzacyjnego</h2>
          <p>Ten endpoint powinien być wywołany przez OLX po zalogowaniu.</p>
        </body>
      </html>
    `);
    return;
  }

  // Na razie tylko wyświetlamy kod - w kolejnym kroku wymienimy go na token
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; padding: 40px;">
        <h2>Autoryzacja OLX udana</h2>
        <p>Otrzymany kod autoryzacyjny:</p>
        <code style="background:#f0f0f0; padding: 10px; display:block; word-break: break-all;">${code}</code>
        <p style="color: #666; margin-top: 20px;">
          Ten kod jest jednorazowy i wygasa po kilku minutach.
          Kolejny krok: wymiana kodu na access token przez zapytanie POST do OLX.
        </p>
      </body>
    </html>
  `);
}

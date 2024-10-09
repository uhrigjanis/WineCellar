const getStoredWines = () => {
  const data = localStorage.getItem('wines');
  return data ? JSON.parse(data) : [];
};

// Liste der Weinanbaugebiete aus Frankreich, Deutschland, Italien, Österreich und Spanien
const wineRegions = {
  France: ['Bordeaux', 'Burgundy', 'Champagne', 'Loire Valley', 'Alsace', 'Provence'],
  Germany: ['Mosel', 'Rheingau', 'Pfalz', 'Franken', 'Baden', 'Ahr'],
  Italy: ['Tuscany', 'Piedmont', 'Sicily', 'Veneto', 'Lombardy', 'Trentino-Alto Adige'],
  Austria: ['Wachau', 'Burgenland', 'Steiermark', 'Niederösterreich'],
  Spain: ['Rioja', 'Ribera del Duero', 'Priorat', 'Penedès', 'Galicia', 'Navarra'],
  Slovakia: ['Small Carpathians', 'Tokaj', 'Nitra', 'Južnoslovenská', 'Stredoslovenská', 'Východoslovenská'],
  Czechia: ['Moravia', 'Bohemia'],
  SouthAfrica: ['Stellenbosch', 'Paarl', 'Swartland', 'Constantia', 'Walker Bay', 'Franschhoek'],
  Australia: ['Barossa Valley', 'Hunter Valley', 'Yarra Valley', 'Margaret River', 'McLaren Vale', 'Clare Valley'],
  NewZealand: ['Marlborough', 'Hawke\'s Bay', 'Central Otago', 'Wairarapa', 'Nelson', 'Canterbury']

};

// Liste der Speisen oder Kategorien für "Passt zu"
const foodPairings = ['Rindfleisch', 'Geflügel', 'Fisch', 'Käse', 'Pasta', 'Desserts', 'Vegetarisch', 'Meeresfrüchte'];

const WineCellar = () => {
  const [wines, setWines] = React.useState(getStoredWines());
  const [newWine, setNewWine] = React.useState({
    name: '',
    vintage: '',
    varietal: '',
    region: '',
    quantity: '',
    price: '',
    pairing: '', // Feld für "Passt zu"
    dateStored: '', // Feld für den Einlagerungszeitpunkt
    winemaker: '' // Neues Feld für den Winzer
  });
  const [selectedCountry, setSelectedCountry] = React.useState('France');

  // Synchronisiere Local Storage mit den aktuellen Weindaten
  React.useEffect(() => {
    localStorage.setItem('wines', JSON.stringify(wines));
  }, [wines]);

  const handleChange = (e) => {
    setNewWine({ ...newWine, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWine.name || !newWine.vintage || !newWine.quantity || !newWine.region || !newWine.pairing || !newWine.dateStored || !newWine.winemaker) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus!');
      return;
    }

    const existingWineIndex = wines.findIndex(wine => wine.name.toLowerCase() === newWine.name.toLowerCase());

    if (existingWineIndex !== -1) {
      const updatedWines = wines.map((wine, index) => {
        if (index === existingWineIndex) {
          const updatedQuantity = parseInt(wine.quantity) + parseInt(newWine.quantity);

          if (updatedQuantity <= 0) {
            return null;
          }

          return { ...wine, quantity: updatedQuantity, region: newWine.region, pairing: newWine.pairing, dateStored: newWine.dateStored, winemaker: newWine.winemaker };
        }
        return wine;
      }).filter(Boolean);

      setWines(updatedWines);
      alert('Weinmenge wurde aktualisiert.');
    } else {
      const wineToAdd = { 
        ...newWine, 
        id: Date.now(), 
      };
      setWines([...wines, wineToAdd]);
      alert('Neuer Wein wurde hinzugefügt.');
    }

    setNewWine({ name: '', vintage: '', varietal: '', region: '', quantity: '', price: '', pairing: '', dateStored: '', winemaker: '' });
  };

  const handleDelete = (id) => {
    setWines(wines.filter((wine) => wine.id !== id));
  };

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setNewWine({ ...newWine, region: '' }); // Setze das Anbaugebiet zurück, wenn das Land geändert wird
  };

  return (
    <div className="wine-cellar">
      <h1>Weinkeller</h1>
      <form onSubmit={handleSubmit} className="wine-form">
      {/* Eingabefeld für den Winzer */}
        <input
          name="winemaker"
          value={newWine.winemaker}
          onChange={handleChange}
          placeholder="Winzer"
          required
        />

        <input
          name="name"
          value={newWine.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          name="vintage"
          value={newWine.vintage}
          onChange={handleChange}
          placeholder="Jahrgang"
          required
        />
        <input
          name="varietal"
          value={newWine.varietal}
          onChange={handleChange}
          placeholder="Sorte"
        />
        
        {/* Dropdown für Land */}
        <select value={selectedCountry} onChange={handleCountryChange}>
          <option value="France">Frankreich</option>
          <option value="Germany">Deutschland</option>
          <option value="Italy">Italien</option>
          <option value="Austria">Österreich</option>
          <option value="Spain">Spanien</option>
        </select>

        {/* Dropdown für Anbaugebiet */}
        <select
          name="region"
          value={newWine.region}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Wählen Sie ein Anbaugebiet</option>
          {wineRegions[selectedCountry].map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        {/* Dropdown für "Passt zu" */}
        <select
          name="pairing"
          value={newWine.pairing}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Passt zu</option>
          {foodPairings.map((pairing) => (
            <option key={pairing} value={pairing}>
              {pairing}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          value={newWine.quantity}
          onChange={handleChange}
          placeholder="Menge (positiv zum Hinzufügen, negativ zum Entfernen)"
          required
        />
        <input
          name="price"
          value={newWine.price}
          onChange={handleChange}
          placeholder="Preis"
        />

        {/* Eingabefeld für den Einlagerungszeitpunkt */}
        <input
          type="datetime-local"
          name="dateStored"
          value={newWine.dateStored}
          onChange={handleChange}
          required
        />

        
        <button type="submit" className="add-button">Wein hinzufügen / aktualisieren</button>
      </form>

      <table className="wine-table">
        <thead>
          <tr>
            <th>Winzer</th> {/* Neuer Winzer */}
            <th>Name</th>
            <th>Jahrgang</th>
            <th>Sorte</th>
            <th>Region</th>
            <th>Passt zu</th>
            <th>Menge</th>
            <th>Preis</th>
            <th>Zeitpunkt</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
    {wines.map((wine) => (
      <tr key={wine.id}>
        <td data-label="Name">{wine.name}</td>
        <td data-label="Jahrgang">{wine.vintage}</td>
        <td data-label="Sorte">{wine.varietal}</td>
        <td data-label="Region">{wine.region}</td>
        <td data-label="Passt zu">{wine.pairing}</td>
        <td data-label="Menge">{wine.quantity} Flaschen</td>
        <td data-label="Preis">{wine.price} €</td>
        <td data-label="Zeitpunkt">{wine.dateStored}</td>
        <td data-label="Winzer">{wine.winemaker}</td>
        <td data-label="Aktion">
          <button onClick={() => handleDelete(wine.id)} className="delete-button">
            Löschen
          </button>
        </td>
      </tr>
    ))}
  </tbody>
      </table>
    </div>
  );
};

// Rendere die React App
ReactDOM.render(<WineCellar />, document.getElementById('root'));

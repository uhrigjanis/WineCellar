const getStoredWines = () => {
  const data = localStorage.getItem('wines');
  return data ? JSON.parse(data) : [];
};

const WineCellar = () => {
  const [wines, setWines] = React.useState(getStoredWines());
  const [newWine, setNewWine] = React.useState({
    name: '',
    vintage: '',
    varietal: '',
    region: '',
    quantity: '', // Menge kann positiv oder negativ sein
    price: '',
    fit: ''
  });

  // Synchronisiere Local Storage mit den aktuellen Weindaten
  React.useEffect(() => {
    localStorage.setItem('wines', JSON.stringify(wines));
  }, [wines]);

  const handleChange = (e) => {
    setNewWine({ ...newWine, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWine.name || !newWine.vintage || !newWine.quantity) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus, inklusive Menge!');
      return;
    }

    // Überprüfe, ob der Wein bereits existiert
    const existingWineIndex = wines.findIndex(wine => wine.name.toLowerCase() === newWine.name.toLowerCase());

    if (existingWineIndex !== -1) {
      // Wenn der Wein bereits existiert, aktualisiere ihn
      const updatedWines = wines.map((wine, index) => {
        if (index === existingWineIndex) {
          const updatedQuantity = parseInt(wine.quantity) + parseInt(newWine.quantity); // Menge addieren/subtrahieren

          // Wenn die neue Menge kleiner oder gleich 0 ist, löschen wir den Wein
          if (updatedQuantity <= 0) {
            return null;
          }

          return { ...wine, quantity: updatedQuantity }; // Menge aktualisieren
        }
        return wine;
      }).filter(Boolean); // Filtere Weine, deren Menge <= 0 ist

      setWines(updatedWines);
      alert('Weinmenge wurde aktualisiert.');
    } else {
      // Wenn der Wein nicht existiert, füge ihn hinzu
      const wineToAdd = { ...newWine, id: Date.now() };
      setWines([...wines, wineToAdd]);
      alert('Neuer Wein wurde hinzugefügt.');
    }

    setNewWine({ name: '', vintage: '', varietal: '', region: '', quantity: '', price: '', fit: '' });
  };

  const handleDelete = (id) => {
    setWines(wines.filter((wine) => wine.id !== id));
  };

  return (
    <div className="wine-cellar">
      <h1>Weinkeller</h1>
      <form onSubmit={handleSubmit} className="wine-form">
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
        <input
          name="region"
          value={newWine.region}
          onChange={handleChange}
          placeholder="Region"
        />
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
        <input
          name="fit"
          value={newWine.fit}
          onChange={handleChange}
          placeholder="Passt zu"
        />
        <button type="submit" className="add-button">Wein hinzufügen / aktualisieren</button>
      </form>

      <table className="wine-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Jahrgang</th>
            <th>Sorte</th>
            <th>Region</th>
            <th>Menge</th>
            <th>Preis</th>
            <th>Passt zu</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {wines.map((wine) => (
            <tr key={wine.id}>
              <td>{wine.name}</td>
              <td>{wine.vintage}</td>
              <td>{wine.varietal}</td>
              <td>{wine.region}</td>
              <td>{wine.quantity} Flaschen</td>
              <td>{wine.price} €</td>
              <td>{wine.fit}</td>
                
              <td>
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

const getStoredWines = () => {
    const data = localStorage.getItem('wines');
    return data ? JSON.parse(data) : [];
};

// Liste der Weinanbaugebiete
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

const wineTypes = ['Rotwein', 'Weißwein', 'Rosé', 'Champagner', 'Sekt', 'Dessertwein', 'Portwein'];

const foodPairings = ['Rindfleisch', 'Geflügel', 'Fisch', 'Käse', 'Pasta', 'Desserts', 'Vegetarisch', 'Meeresfrüchte'];

const WineCellar = () => {
    const [wines, setWines] = React.useState(getStoredWines());
    const [newWine, setNewWine] = React.useState({
        name: '',
        vintage: '',
        wineType: '',
        varietal: '',
        region: '',
        quantity: '',
        price: '',
        pairing: '',
        dateStored: '',
        winemaker: ''
    });
    const [selectedCountry, setSelectedCountry] = React.useState('France');

    React.useEffect(() => {
        localStorage.setItem('wines', JSON.stringify(wines));
    }, [wines]);

    const handleChange = (e) => {
        setNewWine({
            ...newWine,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newWine.name || !newWine.vintage || !newWine.wineType || !newWine.quantity || !newWine.region || !newWine.pairing || !newWine.dateStored || !newWine.winemaker) {
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
                    return {
                        ...wine,
                        quantity: updatedQuantity,
                        region: newWine.region,
                        pairing: newWine.pairing,
                        dateStored: newWine.dateStored,
                        winemaker: newWine.winemaker
                    };
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

        setNewWine({
            name: '',
            vintage: '',
            wineType: '',
            varietal: '',
            region: '',
            quantity: '',
            price: '',
            pairing: '',
            dateStored: '',
            winemaker: ''
        });
    };

    const handleDelete = (id) => {
        setWines(wines.filter((wine) => wine.id !== id));
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setNewWine({
            ...newWine,
            region: ''
        });
    };

    return (
        <div className="wine-cellar">
            <h1>Weinkeller</h1>
            <form onSubmit={handleSubmit} className="wine-form">
                <input name="winemaker" value={newWine.winemaker} onChange={handleChange} placeholder="Winzer" required />
                <input name="name" value={newWine.name} onChange={handleChange} placeholder="Name" required />
                <input name="vintage" value={newWine.vintage} onChange={handleChange} placeholder="Jahrgang" required />

                {/* Dropdown für Weinsorten */}
                <select name="wineType" value={newWine.wineType} onChange={handleChange} required>
                    <option value="">Weinsorte auswählen</option>
                    {wineTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <input name="varietal" value={newWine.varietal} onChange={handleChange} placeholder="Sorte" />

                {/* Dropdown für Land */}
                <select value={selectedCountry} onChange={handleCountryChange}>
                    <option value="France">Frankreich</option>
                    <option value="Germany">Deutschland</option>
                    <option value="Italy">Italien</option>
                    <option value="Austria">Österreich</option>
                    <option value="Spain">Spanien</option>
                </select>

                {/* Dropdown für Anbaugebiet */}
                <select name="region" value={newWine.region} onChange={handleChange} required>
                    <option value="" disabled>Wählen Sie ein Anbaugebiet</option>
                    {wineRegions[selectedCountry].map((region) => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>

                {/* Dropdown für "Passt zu" */}
                <select name="pairing" value={newWine.pairing} onChange={handleChange} required>
                    <option value="" disabled>Passt zu</option>
                    {foodPairings.map((pairing) => (
                        <option key={pairing} value={pairing}>{pairing}</option>
                    ))}
                </select>

                <input name="quantity" value={newWine.quantity} onChange={handleChange} placeholder="Menge (positiv zum Hinzufügen, negativ zum Entfernen)" required />
                <input name="price" value={newWine.price} onChange={handleChange} placeholder="Preis" />

                {/* Eingabefeld für den Einlagerungszeitpunkt */}
                <input type="datetime-local" name="dateStored" value={newWine.dateStored} onChange={handleChange} required />

                <button type="submit" className="add-button">Wein hinzufügen / aktualisieren</button>
            </form>

        <div className="wine-list">
        {wines.map((wine) => (
          <div key={wine.id} className="wine-card">
            <h2>{wine.name} ({wine.vintage})</h2>
            <div className="wine-details">
              <span>Winzer: {wine.winemaker}</span>
              <span>Weinsorte: {wine.wineType}</span>
              <span>Sorte: {wine.varietal}</span>
              <span>Region: {wine.region}, {wine.country}</span>
              <span>Passt zu: {wine.pairing}</span>
              <span>Menge: {wine.quantity}</span>
              <span>Preis: {wine.price} €</span>
              <span>Gelagert seit: {wine.dateStored}</span>
            </div>
            <div className="wine-actions">
              <button onClick={() => handleDelete(wine.id)}>Löschen</button>
            </div>
          </div>
        ))}
        </div>
    </div>
    );
};

// Rendere die React App
ReactDOM.render(<WineCellar />, document.getElementById('root'));

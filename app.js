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
        winemaker: '',
        image: ''
    });
    const [selectedCountry, setSelectedCountry] = React.useState('France');
    const [editingWineId, setEditingWineId] = React.useState(null);

    React.useEffect(() => {
        localStorage.setItem('wines', JSON.stringify(wines));
    }, [wines]);

    const handleChange = (e) => {
        setNewWine({
            ...newWine,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewWine({
                ...newWine,
                image: reader.result
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    if (!newWine.name || !newWine.vintage || !newWine.wineType || !newWine.quantity || !newWine.region || !newWine.pairing || !newWine.dateStored || !newWine.winemaker) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus!');
        return;
    }

    const existingWineIndex = wines.findIndex(wine => wine.id === editingWineId);

    if (existingWineIndex !== -1) {
        // Update existing wine directly
        const updatedWines = wines.map((wine) => {
            if (wine.id === editingWineId) {
                return {
                    ...wine,
                    ...newWine, // Update all fields
                    quantity: parseInt(newWine.quantity) // Directly set the new quantity
                };
            }
            return wine;
        });

        setWines(updatedWines);
        alert('Weinmenge wurde aktualisiert.');
    } else {
        // Add new wine if it doesn't exist
        const wineToAdd = {
            ...newWine,
            id: Date.now(),
        };
        setWines([...wines, wineToAdd]);
        alert('Neuer Wein wurde hinzugefügt.');
    }

    resetForm();
    setEditingWineId(null); // Reset editing ID
};


    const handleDelete = (id) => {
        const updatedWines = wines.filter((wine) => wine.id !== id);
        setWines(updatedWines);
        alert('Wein wurde gelöscht.');
    };

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setNewWine({
            ...newWine,
            region: ''
        });
    };

    const resetForm = () => {
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
            winemaker: '',
            image: ''
        });
    };

    const startEditing = (wine) => {
        setNewWine(wine);
        setEditingWineId(wine.id);
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

                <input name="quantity" value={newWine.quantity} onChange={handleChange} placeholder="Menge" required />
                <input name="price" value={newWine.price} onChange={handleChange} placeholder="Preis" />

                {/* Eingabefeld für den Einlagerungszeitpunkt */}
                <input type="datetime-local" name="dateStored" value={newWine.dateStored} onChange={handleChange} required />

                {/* Eingabefeld für Bild-Upload */}
                <input type="file" accept="image/*" onChange={handleImageChange} />

                <button type="submit" className="add-button">
                    {editingWineId ? 'Aktualisieren' : 'Neuen Wein hinzufügen'}
                </button>
            </form>

            <div className="wine-list">
    {wines.map((wine) => (
        <div key={wine.id} className="wine-card">
            {/* Das Bild wird links angezeigt */}
            <img src={wine.image} alt={wine.name} className="wine-image" />

            {/* Details und Aktionen werden rechts angezeigt */}
            <div className="wine-details">
                {editingWineId === wine.id ? (
                    <React.Fragment>
                        <h2>{wine.name} ({wine.vintage})</h2>
                        <span>Winzer: {wine.winemaker}</span>
                        <span>Weinsorte: {wine.wineType}</span>
                        <span>Sorte: {wine.varietal}</span>
                        <span>Region: {wine.region}, {wine.country}</span>
                        <span>Passt zu: {wine.pairing}</span>
                        <span>Menge: {wine.quantity}</span>
                        <span>Preis: {wine.price} €</span>
                        <span>Gelagert seit: {wine.dateStored}</span>
                        <div className="wine-actions">
                            <button onClick={() => handleDelete(wine.id)}>Löschen</button>
                            <button onClick={() => resetForm()}>Abbrechen</button>
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <h2>{wine.name} ({wine.vintage})</h2>
                        <span>Winzer: {wine.winemaker}</span>
                        <span>Weinsorte: {wine.wineType}</span>
                        <span>Sorte: {wine.varietal}</span>
                        <span>Region: {wine.region}, {wine.country}</span>
                        <span>Passt zu: {wine.pairing}</span>
                        <span>Menge: {wine.quantity}</span>
                        <span>Preis: {wine.price} €</span>
                        <span>Gelagert seit: {wine.dateStored}</span>
                        <div className="wine-actions">
                            <button onClick={() => startEditing(wine)}>Aktualisieren</button>
                            <button onClick={() => handleDelete(wine.id)}>Löschen</button>
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    ))}
</div>


        </div>
    );
};

// Rendere die React App
ReactDOM.render(<WineCellar />, document.getElementById('root'));

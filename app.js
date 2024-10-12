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

        const wineToAdd = {
            ...newWine,
            id: Date.now(),
        };
        setWines([...wines, wineToAdd]);
        alert('Neuer Wein wurde hinzugefügt.');

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
    
    // Formatierte Datumsdarstellung
    const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

    return (
        <div className="wine-cellar">
            <h1>Weinkeller</h1>
            <form onSubmit={handleSubmit} className="wine-form">
                <input name="winemaker" value={newWine.winemaker} onChange={handleChange} placeholder="Winzer" required />
                <input name="name" value={newWine.name} onChange={handleChange} placeholder="Name" required />
                <input name="vintage" value={newWine.vintage} onChange={handleChange} placeholder="Jahrgang" required />

                {/* Dropdown für Weinsorte */}
                <select name="wineType" value={newWine.wineType} onChange={handleChange} required>
                    <option value="">Weinsorte wählen</option>
                    <option value="Rotwein">Rotwein</option>
                    <option value="Weißwein">Weißwein</option>
                    <option value="Rosé">Rosé</option>
                    <option value="Schaumwein">Schaumwein</option>
                </select>

                {/* Dropdown für Sorte (Varietal) */}
                <select name="varietal" value={newWine.varietal} onChange={handleChange}>
                    <option value="">Sorte wählen</option>
                    <option value="Pinot Noir">Pinot Noir</option>
                    <option value="Chardonnay">Chardonnay</option>
                    <option value="Merlot">Merlot</option>
                    <option value="Cabernet Sauvignon">Cabernet Sauvignon</option>
                    <option value="Riesling">Riesling</option>
                </select>

                <input name="region" value={newWine.region} onChange={handleChange} placeholder="Region" required />
                <input name="quantity" value={newWine.quantity} onChange={handleChange} placeholder="Menge" required />
                <input name="price" value={newWine.price} onChange={handleChange} placeholder="Preis" />
                <input name="pairing" value={newWine.pairing} onChange={handleChange} placeholder="Passt zu" />
                <input type="datetime-local" name="dateStored" value={newWine.dateStored} onChange={handleChange} required />

                <button type="submit" className="add-button">Wein hinzufügen</button>
            </form>

            <div className="wine-list">
                {wines.map((wine) => (
                    <div key={wine.id} className="wine-card">
                        <img src="/wine-bottle-placeholder.jpg" alt="Weinflasche" /> {/* Placeholder image */}
                        <h2>{wine.name} ({wine.vintage})</h2>
                        <div className="wine-details">
                            <span>Winzer: {wine.winemaker}</span>
                            <span>Weinsorte: {wine.wineType}</span>
                            <span>Sorte: {wine.varietal}</span>
                            <span>Region: {wine.region}</span>
                            <span>Passt zu: {wine.pairing}</span>
                            <span>Menge: {wine.quantity}</span>
                            <span>Preis: {wine.price} €</span>
                            <span>Gelagert seit: {wine.dateStored}</span>
                        </div>
                        <div className="wine-actions">
                            <span className="price">{wine.price ? `${wine.price} €` : 'Preis nicht angegeben'}</span>
                            <button onClick={() => handleDelete(wine.id)}>Löschen</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getStoredWines() {
    const storedWines = localStorage.getItem('wines');
    return storedWines ? JSON.parse(storedWines) : [];
}

ReactDOM.render(<WineCellar />, document.getElementById('root'));

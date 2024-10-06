var getStoredWines = function() {
  var data = localStorage.getItem('wines');
  return data ? JSON.parse(data) : [];
};

var WineCellar = function() {
  var [wines, setWines] = React.useState(getStoredWines());
  var [newWine, setNewWine] = React.useState({
    name: '',
    vintage: '',
    varietal: '',
    region: '',
    quantity: '',
    price: ''
  });
  
  // Filter- und Suchzustände
  var [searchTerm, setSearchTerm] = React.useState('');
  var [sortKey, setSortKey] = React.useState('name');
  var [sortOrder, setSortOrder] = React.useState('asc');
  var [filterVintage, setFilterVintage] = React.useState('');

  React.useEffect(function() {
    localStorage.setItem('wines', JSON.stringify(wines));
  }, [wines]);

  var handleChange = function(e) {
    setNewWine({ ...newWine, [e.target.name]: e.target.value });
  };

  var handleSubmit = function(e) {
    e.preventDefault();
    if (!newWine.name || !newWine.vintage) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus!');
      return;
    }
    var wineToAdd = { ...newWine, id: Date.now() };
    setWines([...wines, wineToAdd]);
    setNewWine({ name: '', vintage: '', varietal: '', region: '', quantity: '', price: '' });
  };

  var handleDelete = function(id) {
    setWines(wines.filter(function(wine) {
      return wine.id !== id;
    }));
  };

  // Sortierlogik
  var sortWines = function(wines) {
    return wines.sort(function(a, b) {
      var aValue = a[sortKey].toString().toLowerCase();
      var bValue = b[sortKey].toString().toLowerCase();
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Gefilterte und sortierte Weine
  var filteredWines = sortWines(
    wines.filter(function(wine) {
      return wine.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
      (filterVintage ? wine.vintage === filterVintage : true);
    })
  );

  var handleSearch = function(e) {
    setSearchTerm(e.target.value);
  };

  var handleSortChange = function(e) {
    setSortKey(e.target.value);
  };

  var handleSortOrderChange = function(e) {
    setSortOrder(e.target.value);
  };

  var handleFilterVintage = function(e) {
    setFilterVintage(e.target.value);
  };

  return (
    <div>
      <h1>Weinkeller</h1>

      {/* Sucheingabe */}
      <input 
        type="text" 
        placeholder="Suche nach Name" 
        value={searchTerm} 
        onChange={handleSearch} 
      />

      {/* Filter nach Jahrgang */}
      <input 
        type="text" 
        placeholder="Filter nach Jahrgang" 
        value={filterVintage} 
        onChange={handleFilterVintage} 
      />

      {/* Sortieroptionen */}
      <select value={sortKey} onChange={handleSortChange}>
        <option value="name">Name</option>
        <option value="vintage">Jahrgang</option>
        <option value="varietal">Sorte</option>
        <option value="region">Region</option>
        <option value="price">Preis</option>
      </select>

      {/* Sortierreihenfolge */}
      <select value={sortOrder} onChange={handleSortOrderChange}>
        <option value="asc">Aufsteigend</option>
        <option value="desc">Absteigend</option>
      </select>

      {/* Formular zur Weinhinzufügung */}
      <form onSubmit={handleSubmit}>
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
          placeholder="Menge"
        />
        <input
          name="price"
          value={newWine.price}
          onChange={handleChange}
          placeholder="Preis"
        />
        <button type="submit">Wein hinzufügen</button>
      </form>

      {/* Liste der Weine */}
      <ul>
        {filteredWines.map(function(wine) {
          return (
            <li key={wine.id}>
              {wine.name} - {wine.vintage} - {wine.varietal} - {wine.region} - {wine.quantity} Flaschen - {wine.price} €
              <button onClick={() => handleDelete(wine.id)}>Löschen</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Rendere die React App
ReactDOM.render(<WineCellar />, document.getElementById('root'));

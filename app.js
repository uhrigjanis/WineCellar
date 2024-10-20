// Import MongoDB
const { MongoClient } = require('mongodb');

// MongoDB connection URI and database name
const uri = 'mongodb+srv://uhrigjanis:uf1N8GUyMsyITJsj@cluster24913.ke7cu.mongodb.net/Wines?retryWrites=true&w=majority&appName=Cluster24913;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db('Wines'); // Replace with your database name
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }
}

// Fetch wines from MongoDB
async function fetchWines() {
  try {
    const winesCollection = db.collection('wines');
    const wines = await winesCollection.find().toArray();
    return wines;
  } catch (err) {
    console.error('Error fetching wines:', err);
  }
}

// Insert a new wine into MongoDB
async function addWine(newWine) {
  try {
    const winesCollection = db.collection('wines');
    const result = await winesCollection.insertOne(newWine);
    console.log(`New wine added with ID: ${result.insertedId}`);
    return result.insertedId;
  } catch (err) {
    console.error('Error adding wine:', err);
  }
}

// Call the MongoDB connection
connectToMongoDB();

// React Component for the Wine App
class WineApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wines: [],
      name: '',
      year: '',
      price: ''
    };
  }

  componentDidMount() {
    // Fetch wines from MongoDB when the component mounts
    fetchWines().then(wines => {
      this.setState({ wines });
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { name, year, price } = this.state;
    if (name && year && price) {
      const newWine = { name, year: parseInt(year), price: parseFloat(price) };
      const wineId = await addWine(newWine);

      // Update the wine list after adding a new wine
      if (wineId) {
        this.setState(prevState => ({
          wines: [...prevState.wines, { ...newWine, _id: wineId }],
          name: '',
          year: '',
          price: ''
        }));
      }
    }
  };

  render() {
    const { wines, name, year, price } = this.state;
    return (
      <div className="wine-cellar">
        <h1>Weinkeller Verwaltung</h1>
        
        {/* Form to add a new wine */}
        <form onSubmit={this.handleFormSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            onChange={this.handleInputChange}
            placeholder="Wine Name"
            required
          />
          <input
            type="number"
            name="year"
            value={year}
            onChange={this.handleInputChange}
            placeholder="Year"
            required
          />
          <input
            type="number"
            name="price"
            value={price}
            onChange={this.handleInputChange}
            placeholder="Price"
            required
          />
          <button type="submit">Add Wine</button>
        </form>

        {/* Wine List */}
        <div className="wine-list">
          {wines.map(wine => (
            <div className="wine-card" key={wine._id}>
              <h2>{wine.name}</h2>
              <div className="wine-details">
                <span>Year: {wine.year}</span>
                <span>Price: ${wine.price.toFixed(2)}</span>
              </div>
              <div className="wine-actions">
                <span className="price">${wine.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

// Render the WineApp component
ReactDOM.render(<WineApp />, document.getElementById('root'));

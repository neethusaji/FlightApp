import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const flightsData = [
  {
    id: 1,
    airline: 'IndiGo',
    logo: 'Assets/indigo.png',
    from: 'DEL (Delhi Airport)',
    to: 'BOM (Mumbai Airport)',
    price: 5500,
    duration: 135,
    departure: '06:00',
    arrival: '08:15',
    refundable: true,
  },
  {
    id: 2,
    airline: 'Air India',
    logo: 'Assets/airindia.png',
    from: 'BLR (Bengaluru Airport)',
    to: 'DEL (Delhi Airport)',
    price: 7000,
    duration: 160,
    departure: '09:30',
    arrival: '12:10',
    refundable: false,
  },
  {
    id: 3,
    airline: 'SpiceJet',
    logo: 'Assets/spiceJet.png',
    from: 'HYD (Hyderabad Airport)',
    to: 'MAA (Chennai Airport)',
    price: 4500,
    duration: 85,
    departure: '14:15',
    arrival: '15:40',
    refundable: true,
  },
  {
    id: 4,
    airline: 'Vistara',
    logo: 'Assets/vitara.jpg',
    from: 'CCU (Kolkata Airport)',
    to: 'BOM (Mumbai Airport)',
    price: 7000,
    duration: 155,
    departure: '11:00',
    arrival: '13:35',
    refundable: false,
  },
  {
    id: 5,
    airline: 'Go First',
    logo: 'Assets/gofirst.jpg',
    from: 'PNQ (Pune Airport)',
    to: 'DEL (Delhi Airport)',
    price: 8000,
    duration: 140,
    departure: '17:45',
    arrival: '20:05',
    refundable: true,
  },
];

function FlightApp() {
  const [flights, setFlights] = useState(flightsData);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [formData, setFormData] = useState({ from: '', to: '' });
  const [departureFilter, setDepartureFilter] = useState('all');
  const [arrivalFilter, setArrivalFilter] = useState('all');

  const filterTimeSlot = (time, slot) => {
    const hour = parseInt(time.split(':')[0]);
    if (slot === 'morning') return hour >= 6 && hour < 12;
    if (slot === 'afternoon') return hour >= 12 && hour < 18;
    if (slot === 'evening') return hour >= 18 && hour < 24;
    if (slot === 'night') return hour >= 0 && hour < 6;
    return true;
  };

  const applyFilters = () => {
    let filtered = flightsData.filter(
      (flight) =>
        flight.price >= priceRange[0] &&
        flight.price <= priceRange[1] &&
        (formData.from === '' || flight.from.toLowerCase().includes(formData.from.toLowerCase())) &&
        (formData.to === '' || flight.to.toLowerCase().includes(formData.to.toLowerCase())) &&
        (departureFilter === 'all' || filterTimeSlot(flight.departure, departureFilter)) &&
        (arrivalFilter === 'all' || filterTimeSlot(flight.arrival, arrivalFilter))
    );
    setFlights(filtered);
  };

  const sortFlights = (key) => {
    const sorted = [...flights].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      if (typeof valueA === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });
    setFlights(sorted);
    setSortKey(key);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Flight Listings</h2>

      {/* Filter Form */}
      <form className="row g-3 mb-4" onSubmit={(e) => { e.preventDefault(); applyFilters(); }}>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="From Location"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="To Location"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <select className="form-select" onChange={(e) => setDepartureFilter(e.target.value)}>
            <option value="all">All Departure Times</option>
            <option value="morning">Morning (6am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 6pm)</option>
            <option value="evening">Evening (6pm - 12am)</option>
            <option value="night">Night (12am - 6am)</option>
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" onChange={(e) => setArrivalFilter(e.target.value)}>
            <option value="all">All Arrival Times</option>
            <option value="morning">Morning (6am - 12pm)</option>
            <option value="afternoon">Afternoon (12pm - 6pm)</option>
            <option value="evening">Evening (6pm - 12am)</option>
            <option value="night">Night (12am - 6am)</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {/* Sorting & Price Filter */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label className="me-2">Sort By:</label>
          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => sortFlights('price')}>Price</button>
          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => sortFlights('departure')}>Departure</button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => sortFlights('duration')}>Duration</button>
        </div>
        <div>
          <label className="me-2">Max Price:</label>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceRange[1]}
            onChange={(e) => {
              const value = Number(e.target.value);
              setPriceRange([0, value]);
              applyFilters();
            }}
            className="form-range"
          />
          <span className="ms-2">INR {priceRange[1]}</span>
        </div>
      </div>

      {/* Flight Cards */}
      {flights.map((flight) => (
        <div key={flight.id} className="card mb-4 shadow rounded">
          <div className="card-body p-3">
            <div className="row align-items-center">

              <div className="col-md-9">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={flight.logo}
                    alt={flight.airline}
                    style={{ width: '60px', marginRight: '1rem' }}
                  />
                  <h5 className="mb-0">{flight.airline}</h5>
                </div>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <div><strong>From:</strong> {flight.from}</div>
                  <div><strong>To:</strong> {flight.to}</div>
                </div>

                <div className="d-flex justify-content-between text-muted mb-2">
                  <div><strong>Departure:</strong> {flight.departure}</div>
                  <div><strong>Arrival:</strong> {flight.arrival}</div>
                </div>
                <div className="d-flex justify-content-between text-muted">
                  <div><strong>Duration:</strong> {Math.floor(flight.duration / 60)}h {flight.duration % 60}m</div>
                  <div>
                    <strong>{flight.refundable ? 'Refundable' : 'Non-refundable'}</strong>
                  </div>
                </div>
              </div>

              <div className="col-md-3 text-end">
                <div className="mb-2">
                  <span className="fs-6 text-decoration-line-through text-muted">INR {(flight.price * 1.1).toLocaleString()}</span>
                </div>
                <div className="fs-4 text-primary mb-2">INR {flight.price.toLocaleString()}</div>
                <button className="btn btn-primary btn-sm w-90">Book</button>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FlightApp;

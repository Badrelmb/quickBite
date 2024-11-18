import React, { useState } from 'react';
import './TableManagement.css'; // Import the CSS for styling
import Header from './Header'; // Import the shared Header component
import { QRCodeCanvas } from 'qrcode.react'; // Import QRCodeCanvas from qrcode.react

function TableManagement() {
  const [tables, setTables] = useState([1, 2, 3, 4]); // Initial QR codes for 4 tables
  const restaurantName = "Your Restaurant Name";

  // Function to add a new table
  const addTable = () => {
    setTables([...tables, tables.length + 1]);
  };

  // Function to delete the last table
  const deleteTable = () => {
    if (tables.length > 0) {
      setTables(tables.slice(0, -1));
    }
  };

  return (
    <div className="table-management-page">
      <Header userID="USER123" onLogout={() => {}} /> {/* Replace with your logout logic */}

      <main className="main-content text-center">
        {/* Restaurant Logo and Name */}
        <h1>{restaurantName}</h1>

        {/* Buttons to Add and Delete Tables */}
        <div className="button-group">
          <button className="btn btn-success" onClick={addTable}>Add a Table</button>
          <button className="btn btn-danger" onClick={deleteTable}>Delete a Table</button>
        </div>

        {/* QR Codes Section */}
        <div className="qr-codes">
          {tables.map((tableNumber) => (
            <div key={tableNumber} className="qr-code-container">
              <QRCodeCanvas value={`Table ${tableNumber}`} size={150} />
              <p>Table {tableNumber}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TableManagement;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes'; // new file you’ll create next

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

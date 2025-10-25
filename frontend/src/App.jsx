import React, { useState } from 'react';

import { AnimatePresence } from 'framer-motion';


import Header from './header.jsx'; 
import WelcomeBanner from './WelcomeBanner.jsx'; 
import { ProductCard } from './ProductCard.jsx';
import { ProductModal } from './ProductModal.jsx';

function App() {
  
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="App">
      <Header />
      <WelcomeBanner />

      
      <ProductCard id={1} onClick={setSelectedId} />

     
      <AnimatePresence>
        {selectedId && (
          <ProductModal id={selectedId} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
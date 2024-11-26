import React from 'react';
import PolygonDrawingTool from './componets/PolygonTool';
function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>Polygon Drawer</h1>
      </div>

      <PolygonDrawingTool />
    </div>
  );
}

export default App;

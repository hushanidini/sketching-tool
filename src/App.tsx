import React from 'react';
import PolygonCanvas from './componets/PolygonCanvas';
import PolygonDrawingTool from './componets/PolygonTool';
function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ textAlign: 'center' }}>Polygon Drawer</h1>
      </div>
      
      <PolygonDrawingTool />
      {/* <PolygonCanvas /> */}
    </div>
  );
}

export default App;

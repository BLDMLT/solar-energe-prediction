import { useState } from 'react';
import { defaultSolarPanelCharacteristics } from '../utils/constant'

export default function Form({ onSubmit, hasData, handleReset }) {
  const [panelCapacity, setPanelCapacity] = useState(5)
  const [efficiency, setEfficiency] = useState(15)
  const [size, setSize] = useState(1.6)
  const [panelNum, setPanelNum] = useState(10)



  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ panelCapacity, efficiency, size, panelNum });
  };

  const handleCharReset = () => {
    setPanelCapacity(defaultSolarPanelCharacteristics.panelCapacity)
    setEfficiency(defaultSolarPanelCharacteristics.efficiency)
    setSize(defaultSolarPanelCharacteristics.size)
    setPanelNum(defaultSolarPanelCharacteristics.panelNum)
    handleReset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Solar Panel Characteristics:</h2> 
      {/* temple add style */}
      <style jsx>{`
        input[type="number"] {
          -moz-appearance: textfield; 
          text-align: right;
          margin: 0px 10px; 
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      `}</style>
      <div style={{ margin: '5px' }}>
        <label>
          Panel Capacity:
          <input
            type="number"
            value={panelCapacity}
            onChange={(e) => setPanelCapacity(e.target.value)}
          /> kW
        </label>
      </div>
      <div style={{ margin: '5px' }}>
        <label>
          Efficiency:
          <input
            type="number"
            value={efficiency}
            onChange={(e) => setEfficiency(e.target.value)}
          /> %
        </label>
      </div>
      <div style={{ margin: '5px' }}>
        <label>
          Size:
          <input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          /> m² per panel
        </label>
      </div>
      <div style={{ margin: '5px' }}>
        <label>
          Number of Panels:
          <input
            type="number"
            value={panelNum}
            onChange={(e) => setPanelNum(e.target.value)}
          />
        </label>
      </div>
      <button type="button" style={{ margin: '5px 2px' }} onClick={() => handleCharReset()}>Reset</button>
      <button type="submit" disabled={!hasData} style={{ margin: '5px 12px' }}>Get AI Result</button>
    </form>
  );
}

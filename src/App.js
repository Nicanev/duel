import React, { useState } from "react";
import Canvas from "./Canvas";
import ColorPickerModal from "./ColorPickerModal";

const App = () => {
  const [circle1Speed, setCircle1Speed] = useState(2);
  const [circle2Speed, setCircle2Speed] = useState(4);
  const [circle1FireRate, setCircle1FireRate] = useState(1000);
  const [circle2FireRate, setCircle2FireRate] = useState(2000);
  const [hits, setHits] = useState([0, 0]);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [circle1BulletColor, setCircle1BulletColor] = useState("orange");
  const [circle2BulletColor, setCircle2BulletColor] = useState("green");

  const handleBulletColorChange = (color) => {
    if (selectedCircle === 0) {
      setCircle1BulletColor(color);
    } else if (selectedCircle === 1) {
      setCircle2BulletColor(color);
    }
    setSelectedCircle(null);
  };

  return (
    <div className="container">
      <h1>Дуэль</h1>
      <div className="stats">
        <h2>Подсчет попаданий:</h2>
        <p>Герой 1: {hits[0]}</p>
        <p>Герой 2: {hits[1]}</p>
      </div>
      <Canvas
        circle1Speed={circle1Speed}
        circle2Speed={circle2Speed}
        circle1FireRate={circle1FireRate}
        circle2FireRate={circle2FireRate}
        circle1BulletColor={circle1BulletColor}
        circle2BulletColor={circle2BulletColor}
        onHit={(index) => {
          setHits((prevHits) => {
            const newHits = [...prevHits];
            newHits[index]++;
            return newHits;
          });
        }}
        onCircleClick={setSelectedCircle}
      />
      <div className="controls">
        <label>
          Скорость первого героя:
          <input
            type="range"
            min="1"
            max="20"
            value={circle1Speed}
            onChange={(e) => setCircle1Speed(Number(e.target.value))}
          />
        </label>
        <label>
          Скорость второго героя:
          <input
            type="range"
            min="1"
            max="20"
            value={circle2Speed}
            onChange={(e) => setCircle2Speed(Number(e.target.value))}
          />
        </label>
        <label>
          Частота выстрелов первого героя (мс):
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={circle1FireRate}
            onChange={(e) => setCircle1FireRate(Number(e.target.value))}
          />
        </label>
        <label>
          Частота выстрелов второго героя (мс):
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={circle2FireRate}
            onChange={(e) => setCircle2FireRate(Number(e.target.value))}
          />
        </label>
      </div>
      <ColorPickerModal
        selectedCircle={selectedCircle}
        onColorChange={handleBulletColorChange}
        onClose={() => setSelectedCircle(null)}
      />
    </div>
  );
};

export default App;

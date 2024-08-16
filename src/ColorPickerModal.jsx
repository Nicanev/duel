import React from "react";

const ColorPickerModal = ({ selectedCircle, onColorChange, onClose }) => {
  if (selectedCircle === null) return null;

  const handleColorChange = (color) => {
    onColorChange(color);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Выбор цвета заклинания для {selectedCircle + 1} героя</h2>
        <button onClick={() => handleColorChange("orange")}>Оранжевый</button>
        <button onClick={() => handleColorChange("green")}>Зеленый</button>
        <button onClick={() => handleColorChange("red")}>Красный</button>
        <button onClick={() => handleColorChange("blue")}>Синий</button>
      </div>
    </div>
  );
};

export default ColorPickerModal;

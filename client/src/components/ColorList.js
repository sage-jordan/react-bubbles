import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from "../auth/axiosWithAuth";

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);
  const [add, setAdd] = useState(false);

  const redirect = () => {
    document.location.reload(true);
  };

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const addColor = () => {
    axiosWithAuth().post('http://localhost:5000/api/colors', colorToEdit)
      .then(res => setColorToEdit(initialColor))
      .catch(err => console.error("ERROR IN ADD COLOR AXIOS:", err))
    redirect();
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth().put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => setColorToEdit(initialColor))
      .catch(err => console.log(err.response));
    redirect();
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth().delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => console.log(res))
      .catch(err => console.log(err));
    redirect();
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <button onClick={() => setAdd(true)}>add color</button>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      {/* stretch - build another form here to add a color */}
        {add && (
          <form onSubmit={addColor}>
            <legend>add color</legend>
              <label>
                color name:
                <input
                  onChange={e =>
                    setColorToEdit({ ...colorToEdit, color: e.target.value })
                  }
                  value={colorToEdit.color}
                />
              </label>
              <label>
                hex code:
                <input
                  onChange={e =>
                    setColorToEdit({
                      ...colorToEdit,
                      code: { hex: e.target.value }
                    })
                  }
                  value={colorToEdit.code.hex}
                />
              </label>
              <div className="button-row">
                <button type="submit">add</button>
                <button onClick={() => setAdd(false)}>cancel</button>
              </div>
            </form>
          )}
        <div className="spacer" />
        </div>
  );
};

export default ColorList;

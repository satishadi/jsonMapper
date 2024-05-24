// components/JsonMapper.js
import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import JsonContext from './JsonContext';

const JsonMapper = () => {
  const { sourceJson, targetJson } = useContext(JsonContext);
  const [mappings, setMappings] = useState([]);
  const [modifiedSourceObject, setModifiedSourceObject] = useState({ ...sourceJson[0] });
  const [updatedSourceJson, setUpdatedSourceJson] = useState('');

  useEffect(() => {
    const updatedJson = sourceJson.map((obj) => {
      const newObj = {};
      Object.keys(obj).forEach((key) => {
        const mapping = mappings.find((m) => m.source === key);
        if (mapping) {
          newObj[mapping.target] = obj[key];
        } else {
          newObj[key] = obj[key];
        }
      });
      return newObj;
    });
    setUpdatedSourceJson(JSON.stringify(updatedJson, null, 2)); // Convert to string
  }, [mappings, sourceJson]);

  const handleDragStart = (event, key) => {
    event.dataTransfer.setData('sourceKey', key);
  };

  const handleDrop = (event, targetKey) => {
    event.preventDefault();
    const sourceKey = event.dataTransfer.getData('sourceKey');
    const value = modifiedSourceObject[sourceKey];

    const updatedSourceObject = {};
    Object.keys(modifiedSourceObject).forEach((key) => {
      if (key === sourceKey) {
        updatedSourceObject[targetKey] = value;
      } else {
        updatedSourceObject[key] = modifiedSourceObject[key];
      }
    });

    setModifiedSourceObject(updatedSourceObject);
    setMappings([...mappings, { source: sourceKey, target: targetKey }]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const renderObject = (obj, isSource = false) => {
    return (
      <ul className="list-group">
        {Object.entries(obj).map(([key, value]) => (
          <li
            key={key}
            className="list-group-item"
            draggable={isSource}
            onDragStart={isSource ? (e) => handleDragStart(e, key) : null}
            onDrop={isSource ? null : (e) => handleDrop(e, key)}
            onDragOver={isSource ? null : handleDragOver}
          >
            <span className="fw-bold">{key}:</span> {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    );
  };

  const saveUpdatedJson = () => {
    // Convert updatedSourceJson to JSON format
    const jsonData = JSON.parse(updatedSourceJson);

    // Send the updated JSON data to the server
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonData), // Convert to JSON format before sending
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Data saved successfully:', data);
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3>Source JSON</h3>
            </div>
            <div className="card-body">{renderObject(modifiedSourceObject, true)}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h3>Target JSON</h3>
            </div>
            <div className="card-body">{renderObject(targetJson)}</div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-primary" onClick={saveUpdatedJson}>
            Save Updated JSON
          </button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-info text-white">
              <h3>Updated Source JSON</h3>
            </div>
            <div className="card-body">
              <pre>{updatedSourceJson}</pre> {/* Display updated JSON */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonMapper;

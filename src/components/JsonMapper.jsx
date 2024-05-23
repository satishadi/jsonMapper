import React, { useState, useEffect, useRef, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const JsonMapper = () => {
    const [mappings, setMappings] = useState([]);
    const [selectedSourceField, setSelectedSourceField] = useState(null);
    const canvasRef = useRef(null);
  
  
    const sourceJson = {
      id: 1,
      details: {
        title: 'iPhone 9',
        description: 'An apple mobile which is nothing like apple',
        price: 549,
        discount_Per: 12.96,
        rating: 4.69,
        stock: 94,
      },
      info: {
        brand: 'Apple',
        category: 'smartphones',
      },
      thumbnail: '...',
    };
    
    const targetJson = {
      product: {
        Model: '',
        cost: 0,
        Availability: 0,
      },
      meta: {
        brand: '',
        category: '',
      },
    };
  
    const SourceField = ({ field, path, handleDragStart }) => {
      if (typeof field === 'object' && field !== null) {
        return (
          <ul>
            {Object.keys(field).map((key) => (
              <li key={path + key}>
                <strong>{key}</strong>
                <SourceField
                  field={field[key]}
                  path={path + key + '.'}
                  handleDragStart={handleDragStart}
                />
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <li
            id={`source-${path}`}
            className="list-group-item"
            draggable
            onDragStart={(e) => handleDragStart(e, path)}
          >
            {path}
          </li>
        );
      }
    };
    const TargetField = ({ field, path, handleDrop, handleDragOver }) => {
      if (typeof field === 'object' && field !== null) {
        return (
          <ul>
            {Object.keys(field).map((key) => (
              <li key={path + key}>
                <strong>{key}</strong>
                <TargetField
                  field={field[key]}
                  path={path + key + '.'}
                  handleDrop={handleDrop}
                  handleDragOver={handleDragOver}
                />
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <li
            id={`target-${path}`}
            className="list-group-item"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, path)}
          >
            {path}
          </li>
        );
      }
    };
      
    const colors = [
      'red', 'blue', 'green', 'purple', 'orange', 'pink', 'brown', 'black'
    ];
  
    const drawAllArrows = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      mappings.forEach(({ source, target }, index) => {
        const sourceElem = document.getElementById(`source-${source}`);
        const targetElem = document.getElementById(`target-${target}`);
  
        const sourceRect = sourceElem.getBoundingClientRect();
        const targetRect = targetElem.getBoundingClientRect();
  
        const sourceX = sourceRect.right;
        const sourceY = sourceRect.top + sourceRect.height / 2;
        const targetX = targetRect.left;
        const targetY = targetRect.top + targetRect.height / 2;
  
        const cp1X = sourceX + (targetX - sourceX) / 2;
        const cp1Y = sourceY;
        const cp2X = targetX - (targetX - sourceX) / 2;
        const cp2Y = targetY;
  
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(sourceX, sourceY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, targetX, targetY);
        ctx.strokeStyle = colors[index % colors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
  
        const headlen = 10;
        const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
        ctx.beginPath();
        ctx.moveTo(targetX, targetY);
        ctx.lineTo(targetX - headlen * Math.cos(angle - Math.PI / 6), targetY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(targetX - headlen * Math.cos(angle + Math.PI / 6), targetY - headlen * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(targetX, targetY);
        ctx.lineTo(targetX - headlen * Math.cos(angle - Math.PI / 6), targetY - headlen * Math.sin(angle - Math.PI / 6));
        ctx.strokeStyle = colors[index % colors.length];
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();
      });
    }, [mappings]);
  
    useEffect(() => {
      drawAllArrows();
    }, [drawAllArrows]);
  
    const handleDragStart = (event, path) => {
      setSelectedSourceField(path);
      event.dataTransfer.setData('text', path);
    };
  
    const handleDrop = (event, targetField) => {
      event.preventDefault();
      if (selectedSourceField) {
        setMappings((prevMappings) => [
          ...prevMappings,
          { source: selectedSourceField, target: targetField },
        ]);
      }
    };
  
    const handleDragOver = (event) => {
      event.preventDefault();
    };
  
    const generateCode = () => {
      const mappingObj = {};
      mappings.forEach(({ source, target }) => {
        mappingObj[source] = target;
      });
  
      const code = `
  const sourceJson = ${JSON.stringify(sourceJson, null, 4)};
  const mappings = ${JSON.stringify(mappingObj, null, 4)};
  
  function generateTargetJson(source, mappings) {
    let target = {};
    for (const [sourcePath, targetKey] of Object.entries(mappings)) {
      const keys = sourcePath.split('.');
      let value = source;
      for (const key of keys) {
        value = value[key];
      }
      const targetKeys = targetKey.split('.');
      let targetRef = target;
      for (let i = 0; i < targetKeys.length - 1; i++) {
        const k = targetKeys[i];
        targetRef[k] = targetRef[k] || {};
        targetRef = targetRef[k];
      }
      targetRef[targetKeys[targetKeys.length - 1]] = value;
    }
    return target;
  }
  
  const generatedTargetJson = generateTargetJson(sourceJson, mappings);
  console.log(generatedTargetJson);
      `;
      return code;
    };
  
    return (
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3>Source JSON</h3>
              </div>
              <div className="card-body">
                <ul id="sourceFields" className="list-group">
                  <SourceField
                    field={sourceJson}
                    path=""
                    handleDragStart={handleDragStart}
                  />
                </ul>
              </div>
            </div>
          </div>
          <div className="col-1 text-center d-flex align-items-center justify-content-center">
            <div className="mapping-placeholder">
         
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h3>Target JSON</h3>
              </div>
              <div className="card-body">
                <ul id="targetFields" className="list-group">
                  <TargetField
                    field={targetJson}
                    path=""
                    handleDrop={handleDrop}
                    handleDragOver={handleDragOver}
                  />
                </ul>
              </div>
            </div>
          </div>
          <div className="col-5 text-center">
            <pre id="codeOutput" className="mt-3 p-3 bg-light border rounded">
              {generateCode()}
            </pre>
          </div>
        </div>
        <canvas id="canvas" ref={canvasRef} className="position-absolute"></canvas>
      </div>
    );
  };
  

  export default JsonMapper;
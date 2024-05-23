import React, { useState } from 'react';

function Home() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [url, setUrl] = useState('');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'RestEndpoint':
        return (
          <div className="mt-3">
            <label className="form-label">Enter URL:</label>
            <input
              type="text"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        );
      case 'SchemaBuilder':
        return <div>Schema Builder Component</div>;
      case 'JsonMapper':
        return <div>JSON Mapper Component</div>;
      case 'Rebrand':
        return <div>Rebrand Component</div>;
      default:
        return <div>Select an option from the left</div>;
    }
  };

  return (
    <div className="container-fluid" >
      <div className="row" >
        <div className="col-3 bg-light border">
          <div className="d-flex flex-column p-3">
            <button
              className="btn btn-primary mb-5 mt-5"
              onClick={() => setActiveComponent('RestEndpoint')}
            >
              Rest Endpoint
            </button>
            <button
              className="btn btn-secondary mb-5"
              onClick={() => setActiveComponent('SchemaBuilder')}
            >
              Schema Builder
            </button>
            <button
              className="btn btn-success mb-5"
              onClick={() => setActiveComponent('JsonMapper')}
            >
              Json Mapper
            </button>
            <button
              className="btn btn-info mb-5"
              onClick={() => setActiveComponent('Rebrand')}
            >
              Rebrand
            </button>
          </div>
        </div>
        <div className="col-9 border">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}

export default Home;

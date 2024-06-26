import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import RestEndpoint from "./RestEndPoint";
import SchemaBuilder from "./SchemaBuilder";
import JsonMapper from "./JsonMapper";


function Home() {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  const handleNavigation = (component) => {
    setActiveComponent(component);
    switch (component) {
      case "RestEndpoint":
        navigate("/rest-endpoint");
        break;
      case "SchemaBuilder":
        navigate("/schema-builder");
        break;
      case "JsonMapper":
      navigate("/json-mapper");
      break;
      default:
        break;
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 bg-light border">
          <div className="d-flex flex-column p-3">
            <button
              className="btn btn-primary mb-5 mt-5"
              onClick={() => handleNavigation("RestEndpoint")}
            >
              Rest Endpoint
            </button>
            <button
              className="btn btn-secondary mb-5"
              onClick={() => handleNavigation("SchemaBuilder")}
            >
              Schema Builder
            </button>
            <button
              className="btn btn-success mb-5"
              onClick={() => handleNavigation("JsonMapper")}
            >
              Json Mapper
            </button>
          </div>
        </div>
        <div className="col-9 border">
          <Routes>
            <Route path="/rest-endpoint" element={<RestEndpoint />} />
            <Route path="/schema-builder" element={<SchemaBuilder />} />
            <Route path="/Json-mapper" element={<JsonMapper />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Home;

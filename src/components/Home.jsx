import React, { useEffect, useState } from "react";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";

function Home() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [url, setUrl] = useState("https://fakestoreapi.com/products");
  const [sourceJson, setSourceJson] = useState([]);
  const [targetJson, setTargetJson] = useState({});

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "RestEndpoint":
        return (
          <RestEndpoint
            url={url}
            setUrl={setUrl}
            sourceJson={sourceJson}
            setSourceJson={setSourceJson}
          />
        );
      case "SchemaBuilder":
        return (
          <div>
            <SchemaBuilder
              sourceJson={sourceJson}
              targetJson={targetJson}
              setTargetJson={setTargetJson}
            />
          </div>
        );
      case "JsonMapper":
        return <div>JSON Mapper Component</div>;
      case "Rebrand":
        return <div>Rebrand Component</div>;
      default:
        return <div>Select an option from the left</div>;
    }
  };

  function RestEndpoint({ url, setUrl, sourceJson, setSourceJson }) {
    const handleSaveData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setSourceJson(data);
        alert("Data saved to source");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    return (
      <div className="mt-3">
        <label className="form-label">Enter URL:</label>
        <input
          type="text"
          className="form-control"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSaveData}>
          Save Data
        </button>
      </div>
    );
  }

  function SchemaBuilder({ sourceJson, setTargetJson }) {
    const [editorValue, setEditorValue] = useState({});
    console.log(sourceJson);

   
    const handleEditorChange = (newValue) => {
      console.log(newValue);
      setEditorValue(newValue);
    };

    const handleTargetButtonClick = () => {
      setTargetJson(editorValue);
    };

    return (
      <div className="mt-3">
        <h3>JSON Editor:</h3>
        {sourceJson.length > 0 && (
          <Editor
            value={editorValue}
            onChange={handleEditorChange}
            modes={["tree", "code"]}
            mode="tree"
            history={true}
            search={true}
            indentation={4}
          />
        )}
        <button
          className="btn btn-success my-2"
          onClick={handleTargetButtonClick}
        >
          Target
        </button>
        {console.log(targetJson)}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-3 bg-light border">
          <div className="d-flex flex-column p-3">
            <button
              className="btn btn-primary mb-5 mt-5"
              onClick={() => setActiveComponent("RestEndpoint")}
            >
              Rest Endpoint
            </button>
            <button
              className="btn btn-secondary mb-5"
              onClick={() => setActiveComponent("SchemaBuilder")}
            >
              Schema Builder
            </button>
            <button
              className="btn btn-success mb-5"
              onClick={() => setActiveComponent("JsonMapper")}
            >
              Json Mapper
            </button>
            <button
              className="btn btn-info mb-5"
              onClick={() => setActiveComponent("Rebrand")}
            >
              Rebrand
            </button>
          </div>
        </div>
        <div className="col-9 border">{renderActiveComponent()}</div>
      </div>
    </div>
  );
}

export default Home;

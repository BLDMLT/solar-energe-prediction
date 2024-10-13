import { useState, useRef } from 'react'
import { parseCSVToJSON, parseJSONFile } from '../utils/fileUtils';

export default function FileLoading({onUpload, setHasData}) {
  const inputFileRef = useRef(null);
  const [fileName, setFileName] = useState(null)

  const handleFileUpload = (file) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result

      try {
        let jsonData;
        if (file.type === 'application/json') {
          jsonData = parseJSONFile(content);
        } else if (file.type === 'text/csv') {
          jsonData = parseCSVToJSON(content);
        }
        onUpload(jsonData)
        setHasData(true)
        setFileName(file.name)
      } catch (error) {
        alert('Error parsing file: ' + error.message);
      }
    };

    reader.readAsText(file);
  };



  return (
    <>
    <div
      style={{ width: '100%', minHeight: '80px', display: 'flex', alignItems: 'center' }}
      >
      <button style={{ height: '80px' }} onClick={() => inputFileRef.current.click()}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
            <span>Upload a CSV or JSON</span>
          </div>
        </div>
      </button>
    </div>

     <input type="file" style={{ display: 'none' }}
     ref={inputFileRef}
     accept=".json,.csv"  
     onChange={event => {
      const file = event.target.files?.[0]; 
      if (file) {
        if (!['application/json', 'text/csv'].includes(file.type)) {
          alert("Please upload a valid JSON or CSV file");
        } else {
          handleFileUpload(file);
        }
        // Reset file input
        event.target.value = '';
      }
     }} />
      {fileName && (
        <div style={{ marginTop: '10px' }}>
          <span>Uploaded File: {fileName}</span>
        </div>
      )}
 </>
  )
}

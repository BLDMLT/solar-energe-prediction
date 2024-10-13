import { useEffect, useState } from 'react';
import Form from '../components/Form';
import Results from '../components/Results';
import FileLoading from '../components/FileLoading';

export default function Home() {
  const [jsonData, setJsonData] = useState(null);
  const [result, setResult] = useState(null);
  const [hasData, setHasData] = useState(false)
  const [isReset, setIsReset] = useState(false)

  useEffect(() => {
    if(jsonData){
      setHasData(true)
    } else {
      setHasData(false)
    }
  }, [jsonData])

  const handleDataUpload = (data) => {
    setJsonData(data);
  };

  const handleFormSubmit = async (submitData) => {
    try {
      const data = {
        weatherData: jsonData,
        solarPanelCharacteristics: submitData
      }
      const response = await fetch('/api/calculateEnergy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        
      });
      const reader = response.body.getReader();
      let tempResponse = '';
      const readChunk = () => {
        reader.read()
          .then(({
            value,
            done
          }) => {  
            if (done) {
              setResult(tempResponse);
              return;
            } 
            // Convert the chunk value to a string
            const chunkString = new TextDecoder().decode(value);
            tempResponse += chunkString
            setResult(tempResponse);
            readChunk();
          })
      };
      // Start reading the first chunk
      readChunk();
      // const resultData = await response.json();
      setResult(tempResponse);
    } catch (error) {
      console.log('index: err --', error)
    }
  };

  const handleReset = () => {
    setResult(null)
  }

  return (
    <div>
      <h1>Solar Energy Prediction Tool</h1>
      <FileLoading onUpload={handleDataUpload} setHasData={setHasData}/>
      <Form onSubmit={handleFormSubmit} hasData={hasData} handleReset={handleReset}/>
      <Results result={result}/>
    </div>
  );
}

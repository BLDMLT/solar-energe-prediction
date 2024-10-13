export default function Results({ result }) {
  
  if (!result) return null;

  return (
    <div>
      <h3>Results (Streaming)</h3>
      <pre style={{whiteSpace: "pre-wrap", wordWrap:"break-word"}}>{result}</pre>
    </div>
  );
}


export const parseCSVToJSON = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const jsonArray = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index];
      return acc;
    }, {});
  });
  return jsonArray;
};

export const parseJSONFile = (json) => {
  return JSON.parse(json);
};

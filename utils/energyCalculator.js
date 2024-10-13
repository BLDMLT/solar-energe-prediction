export const calculateEnergy = ({sunlightHours, panelCapacity, cloudCoverPercentage,efficiency, numPanels}) => {

  const energyProduction = (sunlightHours * panelCapacity * (1 - cloudCoverPercentage / 100) * efficiency) * numPanels;
  return energyProduction;
}

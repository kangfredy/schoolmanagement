export const addDecimalPoints = (value: string) => {
    const values = value.replace(/\D/g, '');
    let parsedValue = '';
  
    if (values.length > 3) {
      const integerPart = values.slice(0, -3);
      const decimalPart = values.slice(-3);
      parsedValue = `${addDecimalPoints(integerPart)}.${decimalPart}`;
    } else {
      parsedValue = values;
    }
  
    return parsedValue;
  };
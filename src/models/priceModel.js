const getConection = require('../db');

const getPrice = async (idType, idSupplier) => {
  const db = await getConection();
  // Ejemplo: supongamos una tabla “price” o calculamos según alguna regla.
  // Por simplicidad, aquí devolvemos un número fijo (p. ej. 20.000 * idType)
  const tarifa = 20000 * parseInt(idType, 10);
  return { tarifa };
};

module.exports = { getPrice };

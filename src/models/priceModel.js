const getConection = require('../db');

const getPrice = async (idType, idSupplier) => {
  const db = await getConection();
  const tarifa = 2000 * parseInt(idType*2, 10);
  return { tarifa };
};

module.exports = { getPrice };

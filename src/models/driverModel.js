const getConection = require('../db');

const getAllDrivers = async () => {
  const db = await getConection();
  // Para llenar el dropdown de conductores, necesitamos id de driver y el nombre de usuario correspondiente
  const [rows] = await db.execute(`
    SELECT d.id, u.name 
    FROM driver d
    JOIN \`user\` u ON u.id = d.id_user
  `);
  return rows;
};

module.exports = { getAllDrivers };

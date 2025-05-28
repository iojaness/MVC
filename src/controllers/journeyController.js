const JourneyModel = require('../models/journeyModel');

const getJourney = async (req, res) => {
  try {
    const results = await JourneyModel.getAllJourneys();
    console.log('📦 Datos que se mandan al frontend:', results);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error en getJourney:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};


const postJouney = async (req, res) => {
  const {
    description,
    date,
    id_user,
    id_usu_boss,
    id_origin_place,
    id_arrival_place,
    date_service,
    time_service,
    status,
  } = req.body;
  const errors = [];

  // Validación de formato de fecha
  if (
    !date ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !date_service ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date_service)
  ) {
    errors.push('Las fechas son obligatorias y deben tener formato YYYY-MM-DD');
  }

  // Validación de hora
  if (!time_service || !/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time_service)) {
    errors.push('La hora no está en el formato HH:MM:SS o HH:MM');
  } else {
    // Validar que la hora esté entre las 06:00 y las 18:00
    const [hourStr] = time_service.split(':');
    const hour = parseInt(hourStr, 10);
    if (hour < 6 || hour >= 18) {
      errors.push('La hora del servicio debe estar entre las 06:00 y las 18:00');
    }
  }

  // Validar que la fecha de servicio sea distinta a la actual
  const today = new Date().toISOString().split('T')[0];
  if (date_service === today) {
    errors.push('La fecha del servicio debe ser diferente a la fecha actual');
  }

  // Validar que origen y destino no sean iguales
  if (id_origin_place == id_arrival_place) {
    errors.push('El lugar de origen no puede ser igual al lugar de destino');
  }

  // Validación de IDs de usuario
  if (
    !id_user ||
    !id_usu_boss ||
    !Number.isInteger(Number(id_user)) ||
    !Number.isInteger(Number(id_usu_boss))
  ) {
    errors.push('Se debe ingresar el usuario por ID y es obligatoria');
  }

  // Validación de IDs de lugar
  if (
    !id_arrival_place ||
    !id_origin_place ||
    !Number.isInteger(Number(id_origin_place)) ||
    !Number.isInteger(Number(id_arrival_place))
  ) {
    errors.push('Se deben ingresar los lugares por ID y son obligatorios');
  }

  // Validación de estado
  const validStatus = ['PENDIENTE', 'CONFIRMADO', 'POR APROBAR', 'APROBADO'];
  if (!status || !validStatus.includes(status)) {
    errors.push(
      "Los estados solo pueden ser 'PENDIENTE', 'CONFIRMADO', 'POR APROBAR' o 'APROBADO' y es obligatoria"
    );
  }

  // Si hay errores, detener ejecución
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Crear el viaje
  try {
    await JourneyModel.createNewJourney(
      description,
      date,
      id_user,
      id_usu_boss,
      id_origin_place,
      id_arrival_place,
      date_service,
      time_service,
      status
    );
    res.status(201).json({ message: 'Viaje creado correctamente' });
  } catch (err) {
    console.error('❌ Error en postJouney:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

const getVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await JourneyModel.getVehicleToTravel(id);
    if (!data) return res.status(404).json({ error: 'Error, registro no encontrado' });
    res.status(200).json(data[0][0]);
  } catch (err) {
    console.error('❌ Error en getVehicle:', err);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
};

const patchVehicleToTravel = async (req, res) => {
  console.log('🚧 patchVehicleToTravel recibe:', req.body);
  const { id, id_supplier, id_type_vehicle, id_driver, id_license_plate } = req.body;

  if (!id || !id_supplier || !id_type_vehicle || !id_driver || !id_license_plate) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (
    !Number.isInteger(Number(id)) ||
    !Number.isInteger(Number(id_supplier)) ||
    !Number.isInteger(Number(id_type_vehicle)) ||
    !Number.isInteger(Number(id_driver)) ||
    !Number.isInteger(Number(id_license_plate))
  ) {
    return res.status(400).json({ error: 'Todos los parámetros deben ser números' });
  }

  try {
    await JourneyModel.patchVehicleToTravel(id, id_supplier, id_type_vehicle, id_driver, id_license_plate);
    res.status(201).json({ message: 'Vehículo asignado correctamente' });
  } catch (err) {
    console.error('❌ Error en patchVehicleToTravel:', err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
};

const confirmJourney = async (req, res) => {
  const { id } = req.params;
  try {
    await JourneyModel.confirmJourney(id);
    res.status(200).json({ message: 'Trayecto confirmado correctamente' });
  } catch (err) {
    console.error('❌ Error en confirmJourney:', err);
    res.status(500).json({ error: 'Error al confirmar en la base de datos' });
  }
};

module.exports = {
  getJourney,
  postJouney,
  getVehicle,
  patchVehicleToTravel,
  confirmJourney
};

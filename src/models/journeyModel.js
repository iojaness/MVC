const getConection = require('../db');

// Damos todos los productos a la vista
const getAllJourneys = async () => {
    const db = await getConection();
    const [rows] = await db.execute('CALL `get_travels`()');
    return rows;
};

// Creamos un nuevo viaje, solicitando todos los datos requeridos básicos
const createNewJourney = async (
    description, date, id_user, id_usu_boss, id_origin_place, id_arrival_place, date_service, time_service, status) => {
    const db = await getConection();
    const [rows] = await db.execute(
        'CALL `post_new_journey`(?, ?, ?, ?, ?, ? ,? , ?, ?)', 
        [description, date, id_user, id_usu_boss, id_origin_place, id_arrival_place, date_service, time_service, status]);
}

// Obtiene la información de los detalles del vehiculo por ID, esto solicitado desde la ventana flotante
const getVehicleToTravel = async (id_journey) => {
    const db = await getConection();
    const [rows] = await db.execute(
        'CALL get_vehicle_detail_journey(?)', [id_journey]);
    return rows;
}

// Guarda información del vehiculo
const patchVehicleToTravel = async (id, id_supplier, id_type_vehicle, id_driver, id_licence_plate) => {
    const db = await getConection();
    const [rows] = await db.execute(
      'CALL push_vehicle_journey(?, ?, ?, ?, ?)', [id, id_supplier, id_type_vehicle, id_driver, id_licence_plate]);
}

// Obtiene quien es el jefe según el empleado
const getBoss = async (idEmpl) => {
    const db = await getConection();
    const [rows] = await db.execute('SELECT boss.name ' + 
        'AS jefe, empl.name' + 
        'AS empleado FROM hierarchy' +
        'JOIN user AS boss ON boss.id = hierarchy.id_boss' +
        'JOIN user AS empl ON empl.id = hierarchy.id_employee' +
        'WHERE empl.id = ?' , [idEmpl]);
    return rows;
}

module.exports = { 
    getAllJourneys,
    getBoss,
    createNewJourney,
    getVehicleToTravel,
    patchVehicleToTravel,
}
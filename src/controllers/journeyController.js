const JourneyModel = require('../models/journeyModel')

const getJourney = async (req, res) => {
    try {
        const results = await JourneyModel.getAllJourneys(); // Ejecuta el metodo que tiene la rutina
        res.status(200).json(results[0]); // Con [0] se llama solamente la matriz de info, sin metadata de MySQL
    }
        catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({ error: 'Error en la base de datos' });
    }
};

const postJouney = async (req, res) => {
    const { description, date, id_user, id_usu_boss, id_origin_place, id_arrival_place, date_service, time_service, status } = req.body;
    // Se envia un acumulado de errores si ocurren
    const errors = [];

    // Validaciones para la información enviada

    // Para la fecha de hoy, se hace desde el front o desde el back???
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !date_service || !/^\d{4}-\d{2}-\d{2}$/.test(date_service)) {
        errors.push('Las fechas son obligatorias y debe tener formato YYYY-MM-DD');
    }
    // Valida que la hora se ingrese en formato correcto
    if (!time_service || !/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(time_service)) {
        errors.push('La hora no está en el formato HH:MM:SS o en HH:MM');
    }
    // Se valida que las relaciones sean en numeros enteros
    if (!id_user || !id_usu_boss || !Number.isInteger(Number(id_user)) || !Number.isInteger(Number(id_usu_boss))) {
        errors.push('Se debe ingresar el usuario por ID y es obligatoria');
    }
    // Se valida que las relaciones sean en numeros enteros
    if (!id_arrival_place || !id_origin_place || !Number.isInteger(Number(id_origin_place)) || !Number.isInteger(Number(id_arrival_place))) {
        errors.push('Se debe ingresar los lugares por ID y es obligatoria');
    }
    // Valida que los estados solamente sean estos tres
    const validStatus = ['PENDIENTE', 'CONFIRMADO', 'POR APROBAR', 'APROBADO'];
    if (!status || !validStatus.includes(status)) {
        errors.push("Los estados solo pueden ser 'PENDIENTE', 'CONFIRMADO', 'POR APROBAR' o 'APROBADO' y es obligatoria");
    }
    // Si hay errores los imprime en el json
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    // Cuando finaliza las comprobaciones realiza el query
    try {
        await JourneyModel.createNewJourney(description, date, id_user, id_usu_boss, id_origin_place, id_arrival_place, date_service, time_service, status)
        res.status(201).json({ message: 'Viaje creado correctamente'})
    }
    catch (err) {
        console.log(err)
        res.status(500).json({error: 'Error en la base de datos'})
    }
};

// Obtiene los datos requeridos para mostrar en la ventana flotante para configurar el vehiculo
const getVehicle = async (req, res) => {
    const { id } = req.params;
    
    try {
        const data = await JourneyModel.getVehicleToTravel(id);
        if (!data) return res.status(404).json({ error: 'Error, registro no encontrado'});
        res.status(200).json(data[0][0])
    }
    catch (err){
        console.log(err);
        res.status(500).json({ error: 'Error en la busqueda'});
    }
}

// Asigna el vehiculo al viaje a travez de un patch
const patchVehicleToTravel = async (req, res) => {
    const { id, id_supplier, id_type_vehicle, id_driver, id_license_plate } = req.body;

    // Comprueba si la información es correcta, que todo pertenezca a ID
    if (!id || !id_supplier || !id_type_vehicle || !id_driver || !id_license_plate )
        return res.status(400).json({ error: 'Todos los campos son obligatorios'})

    if (!Number.isInteger(Number(id)) || !Number.isInteger(Number(id_supplier)) || !Number.isInteger(Number(id_type_vehicle)) || !Number.isInteger(Number(id_driver)) || !Number.isInteger(Number(id_license_plate)))
        return res.status(400).json({ error: 'Todos los parámetros deben ser números'})

    // Intenta guardar el vehiculo
    try {
        await JourneyModel.patchVehicleToTravel(id, id_supplier, id_type_vehicle, id_driver, id_license_plate);
        res.status(201).json({ message: 'Vehiculo asignado correctamente'});
    }
    catch (err){
        console.log(err);
        res.status(500).json({error: 'Error en la base de datos'});
    }
}

// Exportación de los modulos para usarlos en las rutas
module.exports = { 
    getJourney,
    postJouney,
    getVehicle,
    patchVehicleToTravel,
}
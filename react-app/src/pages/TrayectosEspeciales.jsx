  // src/pages/TrayectosEspeciales.jsx
  import { useState, useEffect } from 'react';
  import Modal from '../components/Modal.jsx'; // O el componente de modal que uses
  import '../App.css';
  import moment from 'moment';

  export default function TrayectosEspeciales() {
    // —————————————————————————
    // ESTADOS PRINCIPALES
    const [trayectos, setTrayectos]         = useState([]);
    const [showNuevo, setShowNuevo]         = useState(false);
    const [showAsignar, setShowAsignar]     = useState(false);
    const [trayectoSeleccionado, setTrayectoSeleccionado] = useState(null);

    // Formulario “Nuevo Trayecto”
    const [formNuevo, setFormNuevo] = useState({
      dateSolicitud: moment().format('YYYY-MM-DD'),
      id_user: '',
      id_usu_boss: '',
      id_origin_place: '',
      id_arrival_place: '',
      date_service: moment().format('YYYY-MM-DD'),
      time_service: '',
    });
    const [erroresNuevo, setErroresNuevo] = useState([]);

    // Formulario “Asignar Vehículo”
    const [formAsignar, setFormAsignar] = useState({
      id_supplier: '',
      id_type_vehicle: '',
      id_driver: '',
      id_license_plate: '',
    });
    const [tarifa, setTarifa] = useState(0);

    // Listas desplegables
    const [usuarios, setUsuarios]         = useState([]);
    const [lugares, setLugares]           = useState([]);
    const [proveedores, setProveedores]   = useState([]);
    const [conductores, setConductores]   = useState([]);
    const [tiposVehiculo, setTiposVehiculo] = useState([]);
    const [placas, setPlacas]             = useState([]);
    const [jefe, setBoss]                 = useState([]);

    // —————————————————————————
    // EFECTOS: CARGA INICIAL
    useEffect(() => {
      fetchTrayectos();
      fetchUsuariosYLugares();
      fetchDatosVehiculo();
    }, []);

    // 1) Traer todos los trayectos
    const fetchTrayectos = async () => {
      try {
        const res = await fetch('/journeys'); // ← Asegúrate de la ruta exacta
        if (!res.ok) throw new Error('Status ' + res.status);
        const data = await res.json();
        setTrayectos(data);
      } catch (err) {
        console.error('⚠️ Error cargando trayectos:', err);
      }
    };

    // 2) Traer usuarios y lugares para dropdowns
    const fetchUsuariosYLugares = async () => {
      try {
        const [rUsers, rBoses,rLugares] = await Promise.all([
          fetch('/users'),
          fetch('/user_bosses'),
          fetch('/places'),
        ]);
        if (!rUsers.ok || !rBoses || !rLugares.ok) throw new Error('Status en usuarios o lugares');
        const [uJSON, bJSON, lJSON] = await Promise.all([rUsers.json(), rBoses.json(),rLugares.json()]);
        setUsuarios(uJSON);
        setBoss(bJSON);
        setLugares(lJSON);
      } catch (err) {
        console.error('⚠️ Error en fetchUsuariosYLugares:', err);
      }
    };

    // 3) Traer datos de vehículo (proveedores, conductores, tipos, placas)
    const fetchDatosVehiculo = async () => {
      try {
        const [rProv, rCond, rTipos, rPlacas] = await Promise.all([
          fetch('/suppliers'),
          fetch('/drivers'),
          fetch('/vehicle-types'),
          fetch('/license-plates'),
        ]);
        if (!rProv.ok || !rCond.ok || !rTipos.ok || !rPlacas.ok) {
          throw new Error('Status en fetch datos de vehículo');
        }
        const [pJSON, cJSON, tJSON, plJSON] = await Promise.all([
          rProv.json(),
          rCond.json(),
          rTipos.json(),
          rPlacas.json(),
        ]);
        setProveedores(pJSON);
        setConductores(cJSON);
        setTiposVehiculo(tJSON);
        setPlacas(plJSON);
      } catch (err) {
        console.error('⚠️ Error en fetchDatosVehiculo:', err);
      }
    };

    // —————————————————————————
    // MANEJADORES

    // 3.1) Crear nuevo trayecto
    const handleNuevoSubmit = async (e) => {
      e.preventDefault();
      setErroresNuevo([]);

      // Validaciones “frontend” (además de las que ya hace el back)
      const errs = [];
      if (!formNuevo.id_user) errs.push('Seleccione un usuario.');
      if (!formNuevo.id_origin_place) errs.push('Seleccione lugar de origen.');
      if (!formNuevo.id_arrival_place) errs.push('Seleccione lugar de destino.');
      if (formNuevo.id_origin_place === formNuevo.id_arrival_place) {
        errs.push('Origen y destino no pueden ser iguales.');
      }
      if (!formNuevo.time_service) errs.push('Ingrese hora de servicio.');
      // (Podrías validar aqui formato de hora, pero el back ya lo checa rígido)
      if (errs.length) {
        setErroresNuevo(errs);
        return;
      }

      // Hacer POST a /journeys
      try {
        const res = await fetch('/journeys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: '', // No lo pides en el formulario, así que vacío
            date: formNuevo.dateSolicitud,
            id_user: formNuevo.id_user,
            id_usu_boss: formNuevo.id_user, 
              // <— si quisieras traer el jefe real, tendrías que llamar getBoss(id_user) 
              //    o exponer un endpoint /users/:id/boss. Para este ejemplo simplifico poniendo al mismo usuario.
            id_origin_place: formNuevo.id_origin_place,
            id_arrival_place: formNuevo.id_arrival_place,
            date_service: formNuevo.date_service,
            time_service: formNuevo.time_service,
            status: 'PENDIENTE',
          }),
        });
        if (res.ok) {
          setShowNuevo(false);
          fetchTrayectos();
        } else {
          const errData = await res.json();
          setErroresNuevo(errData.errors || ['Error desconocido']);
        }
      } catch (err) {
        console.error('⚠️ Error en handleNuevoSubmit:', err);
        setErroresNuevo(['Error de red, inténtalo más tarde.']);
      }
    };

    // 3.2) Abrir modal “Asignar Vehículo”
    const abrirAsignar = (trayecto) => {
      setTrayectoSeleccionado(trayecto);
      setFormAsignar({
        id_supplier: '',
        id_type_vehicle: '',
        id_driver: '',
        id_license_plate: '',
      });
      setTarifa(0);
      setShowAsignar(true);
    };

    // 3.3) Calcular tarifa cuando cambie proveedor o tipo de vehículo
    useEffect(() => {
      const { id_supplier, id_type_vehicle } = formAsignar;
      if (id_supplier && id_type_vehicle) {
        fetch(`/price?type=${id_type_vehicle}&supplier=${id_supplier}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.tarifa !== undefined) setTarifa(data.tarifa);
            else setTarifa(0);
          })
          .catch(() => setTarifa(0));
      }
    }, [formAsignar.id_type_vehicle, formAsignar.id_supplier]);

    // 3.4) Enviar asignación de vehículo
    const handleAsignarSubmit = async (e) => {
      e.preventDefault();
      const errors = [];
      Object.entries(formAsignar).forEach(([k, v]) => {
        if (!v) errors.push(`Complete ${k}`);
      });
      if (errors.length) {
        // Opcional: mostrar errores en un estado
        return;
      }

      try {
        const res = await fetch('/journeys/vehicle', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: trayectoSeleccionado.id,
            id_supplier: formAsignar.id_supplier,
            id_type_vehicle: formAsignar.id_type_vehicle,
            id_driver: formAsignar.id_driver,
            id_license_plate: formAsignar.id_license_plate,
          }),
        });
        if (res.ok) {
          setShowAsignar(false);
          fetchTrayectos();
        } else {
          console.error('⚠️ Error al asignar vehículo');
        }
      } catch (err) {
        console.error('⚠️ Error en handleAsignarSubmit:', err);
      }
    };

    // 3.5) Confirmar trayecto (cambiar a estado “CONFIRMADO”)
    const handleConfirmar = async (trayecto) => {
      const ok = window.confirm('¿Seguro que quieres confirmar este trayecto?');
      if (!ok) return;

      try {
        const res = await fetch(`/journeys/${trayecto.id}/confirm`, {
          method: 'PATCH',
        });
        if (res.ok) {
          fetchTrayectos();
        } else {
          console.error('⚠️ Error al confirmar trayecto');
        }
      } catch (err) {
        console.error('⚠️ Error en handleConfirmar:', err);
      }
    };

    // —————————————————————————
    // RENDER
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Trayectos Especiales</h1>
        <button
          onClick={() => setShowNuevo(true)}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Nuevo Trayecto
        </button>

        {/* ——— TABLA DE TRAYECTOS ——— */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Fecha Solicitud</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Jefe</th>
                <th className="px-4 py-2">Origen</th>
                <th className="px-4 py-2">Destino</th>
                <th className="px-4 py-2">Fecha Servicio</th>
                <th className="px-4 py-2">Hora Servicio</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {trayectos.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-2">{t.date}</td>
                  <td className="px-4 py-2">{t.user}</td>
                  <td className="px-4 py-2">{t.user_boss}</td>
                  <td className="px-4 py-2">{t.origin_place}</td>
                  <td className="px-4 py-2">{t.arrival_place}</td>
                  <td className="px-4 py-2">{t.date_service}</td>
                  <td className="px-4 py-2">{t.time_service}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        t.status.toUpperCase() === 'PENDIENTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : t.status.toUpperCase() === 'CONFIRMADO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {t.status.toUpperCase() === 'PENDIENTE' && (
                      <button
                        onClick={() => abrirAsignar(t)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 text-sm"
                      >
                        Asignar Vehículo
                      </button>
                    )}

                    {t.status.toUpperCase() === 'CONFIRMADO' && (
                      <button
                        onClick={() => handleConfirmar(t)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {trayectos.length === 0 && (
            <p className="mt-4 text-gray-500">No hay trayectos por el momento.</p>
          )}
        </div>

        {/* ——— MODAL: Nuevo Trayecto ——— */}
        {showNuevo && (
          <Modal onClose={() => setShowNuevo(false)}>
            <h2 className="text-xl font-semibold mb-3">Crear Nuevo Trayecto</h2>
            <form onSubmit={handleNuevoSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1">Fecha Solicitud:</label>
                <input
                  type="date"
                  value={formNuevo.dateSolicitud}
                  disabled
                  className="border rounded px-3 py-2 w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Usuario:</label>
                <select
                  value={formNuevo.id_user}
                  onChange={(e) =>
                    setFormNuevo({ ...formNuevo, id_user: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Usuario Jefe:</label>
                <select
                  value={formNuevo.id_user}
                  onChange={(e) =>
                    setFormNuevo({ ...formNuevo, id_user: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione usuario</option>
                  {jefe.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.username}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Origen:</label>
                <select
                  value={formNuevo.id_origin_place}
                  onChange={(e) =>
                    setFormNuevo({
                      ...formNuevo,
                      id_origin_place: e.target.value,
                      id_arrival_place: '',
                    })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione origen</option>
                  {lugares.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Destino:</label>
                <select
                  value={formNuevo.id_arrival_place}
                  onChange={(e) =>
                    setFormNuevo({ ...formNuevo, id_arrival_place: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione destino</option>
                  {lugares
                    .filter((l) => l.id !== Number(formNuevo.id_origin_place))
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Fecha de Servicio:</label>
                <input
                  type="date"
                  value={formNuevo.date_service}
                  min={moment().format('YYYY-MM-DD')}
                  onChange={(e) =>
                    setFormNuevo({ ...formNuevo, date_service: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Hora de Servicio:</label>
                <input
                  type="time"
                  value={formNuevo.time_service}
                  onChange={(e) =>
                    setFormNuevo({ ...formNuevo, time_service: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              {erroresNuevo.length > 0 && (
                <ul className="text-red-600">
                  {erroresNuevo.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNuevo(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* ——— MODAL: Asignar Vehículo ——— */}
        {showAsignar && (
          <Modal onClose={() => setShowAsignar(false)}>
            <h2 className="text-xl font-semibold mb-3">Asignar Vehículo</h2>
            <form onSubmit={handleAsignarSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block font-medium mb-1">Proveedor:</label>
                <select
                  value={formAsignar.id_supplier}
                  onChange={(e) =>
                    setFormAsignar({ ...formAsignar, id_supplier: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Tipo de Vehículo:</label>
                <select
                  value={formAsignar.id_type_vehicle}
                  onChange={(e) =>
                    setFormAsignar({ ...formAsignar, id_type_vehicle: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione tipo</option>
                  {tiposVehiculo.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Conductor:</label>
                <select
                  value={formAsignar.id_driver}
                  onChange={(e) =>
                    setFormAsignar({ ...formAsignar, id_driver: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione conductor</option>
                  {conductores.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Placa:</label>
                <select
                  value={formAsignar.id_license_plate}
                  onChange={(e) =>
                    setFormAsignar({ ...formAsignar, id_license_plate: e.target.value })
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">Seleccione placa</option>
                  {placas.map((pl) => (
                    <option key={pl.id} value={pl.id}>
                      {pl.plate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Tarifa:</label>
                <input
                  type="number"
                  value={tarifa}
                  disabled
                  className="border rounded px-3 py-2 w-full bg-gray-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAsignar(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Asignar
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  }

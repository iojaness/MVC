-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-05-2025 a las 06:26:39
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

CREATE DATABASE IF NOT EXISTS patrones;
USE patrones;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `patrones`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_travels` ()   SELECT 
	journey.id,
    journey.description, 
    journey.date, 
    user_sol.email AS 'user',
    boss.email AS 'user_boss',
    origin_p.description AS 'origin_place',
    arr_p.description AS 'arrival_place',
    journey.date_service, 
    journey.time_service, 
	journey.status    
FROM journey 
JOIN user AS boss ON boss.id = journey.id_usu_boss
JOIN user AS user_sol ON user_sol.id = journey.id_user
JOIN place AS origin_p ON origin_p.id = journey.id_origin_place
JOIN place AS arr_p ON arr_p.id = journey.id_arrival_place$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `get_vehicle_detail_journey` (IN `p_journey_id` INT)   SELECT
        supplier.description AS suplier,
        type_of_vehicle.descritcion AS type_of_vehicle,
        user.username AS driver,
        licence_plate.number AS licence_plate
    FROM journey
    JOIN supplier ON supplier.id = journey.id_supplier
    JOIN type_of_vehicle ON type_of_vehicle.id = journey.id_type_of_vehicle
    JOIN driver ON driver.id = journey.id_driver
    JOIN user ON driver.id_user = user.id
    JOIN licence_plate ON licence_plate.id = journey.id_licence_plate
    WHERE journey.id = p_journey_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `post_new_journey` (IN `p_description` VARCHAR(255), IN `p_date` DATE, IN `p_id_user` INT, IN `p_id_usu_boss` INT, IN `p_id_origin_place` INT, IN `p_id_arrival_place` INT, IN `p_date_service` DATE, IN `p_time_service` TIME, IN `p_status` VARCHAR(50))   BEGIN
    INSERT INTO journey (
        description,
        date,
        id_user,
        id_usu_boss,
        id_origin_place,
        id_arrival_place,
        date_service,
        time_service,
        status
    ) VALUES (
        p_description,
        p_date,
        p_id_user,
        p_id_usu_boss,
        p_id_origin_place,
        p_id_arrival_place,
        p_date_service,
        p_time_service,
        p_status
    );
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `push_vehicle_journey` (IN `p_journey_id` INT, IN `p_id_supplier` INT, IN `p_id_type_of_vehicle` INT, IN `p_id_driver` INT, IN `p_id_licence_plate` INT)   BEGIN
    UPDATE journey
    SET
        id_supplier = p_id_supplier,
        id_type_of_vehicle = p_id_type_of_vehicle,
        id_driver = p_id_driver,
        id_licence_plate = p_id_licence_plate
    WHERE id = p_journey_id;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `driver`
--

CREATE TABLE `driver` (
  `id` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_type_of_vehicle` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `driver`
--

INSERT INTO `driver` (`id`, `id_user`, `id_type_of_vehicle`) VALUES
(1, 8, 1),
(2, 8, 2),
(3, 9, 3),
(4, 10, 1),
(5, 11, 1),
(6, 11, 2),
(7, 11, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hierarchy`
--

CREATE TABLE `hierarchy` (
  `id` int(11) NOT NULL,
  `id_employee` int(11) DEFAULT NULL,
  `id_boss` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hierarchy`
--

INSERT INTO `hierarchy` (`id`, `id_employee`, `id_boss`) VALUES
(1, 6, 1),
(2, 3, 1),
(3, 4, 2),
(4, 5, 2),
(5, 7, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `journey`
--

CREATE TABLE `journey` (
  `id` int(11) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `date_service` date DEFAULT NULL,
  `time_service` time DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `id_usu_boss` int(11) DEFAULT NULL,
  `id_origin_place` int(11) DEFAULT NULL,
  `id_arrival_place` int(11) DEFAULT NULL,
  `id_supplier` int(11) DEFAULT NULL,
  `id_driver` int(11) DEFAULT NULL,
  `id_type_of_vehicle` int(11) DEFAULT NULL,
  `id_licence_plate` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `journey`
--

INSERT INTO `journey` (`id`, `description`, `date`, `id_user`, `date_service`, `time_service`, `status`, `id_usu_boss`, `id_origin_place`, `id_arrival_place`, `id_supplier`, `id_driver`, `id_type_of_vehicle`, `id_licence_plate`) VALUES
(1, 'Viaje de paseo', '2025-05-12 23:50:54', 3, '2025-05-19', '07:30:00', 'Pendiente', 1, 1, 2, NULL, NULL, NULL, NULL),
(2, 'Emergencia', '2025-05-13 00:38:20', 4, '2025-05-14', '13:00:00', 'Pendiente', 1, 3, 5, NULL, NULL, NULL, NULL),
(3, 'Envio de archivos', '2025-05-13 00:39:40', 4, '2025-05-16', '15:00:00', 'Confirmado', 1, 6, 2, 1, 1, 2, 1),
(4, 'A la U', '2025-05-13 00:41:41', 5, '2025-05-20', '07:00:00', 'Confirmado', 1, 7, 1, 3, 2, 2, 2),
(9, 'Viaje a la miercoles', '2025-05-16 00:00:00', 4, '2025-05-23', '09:00:00', 'PENDIENTE', 1, 2, 4, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `licence_plate`
--

CREATE TABLE `licence_plate` (
  `id` int(11) NOT NULL,
  `number` varchar(8) DEFAULT NULL,
  `id_type_of_vehicle` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `licence_plate`
--

INSERT INTO `licence_plate` (`id`, `number`, `id_type_of_vehicle`) VALUES
(1, 'ZCG36G', 1),
(2, 'HSN207', 2),
(3, 'SJE672', 3),
(4, 'SDF87F', 1),
(5, 'SIE752', 2),
(6, 'SRH915', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `place`
--

CREATE TABLE `place` (
  `id` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `place`
--

INSERT INTO `place` (`id`, `description`) VALUES
(1, 'Fundación Universitaria Uninpahu'),
(2, 'Chia'),
(3, 'Cota'),
(4, 'Nemocon'),
(5, 'Funza'),
(6, 'Mosquera'),
(7, 'Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `description` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `supplier`
--

INSERT INTO `supplier` (`id`, `description`) VALUES
(1, 'Uber'),
(2, 'Cabify'),
(3, 'Picap'),
(4, 'Didi');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_of_vehicle`
--

CREATE TABLE `type_of_vehicle` (
  `id` int(11) NOT NULL,
  `descritcion` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_of_vehicle`
--

INSERT INTO `type_of_vehicle` (`id`, `descritcion`) VALUES
(1, 'Moto'),
(2, 'Carro'),
(3, 'Camión');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(15) NOT NULL,
  `name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `user`
--

UPDATE `user`
SET `password` = '12345678'
WHERE id > 0;

INSERT INTO `user` (`id`, `username`, `name`, `last_name`, `email`, `password`, `type`) VALUES
(1, 'sergio_parra', 'Sergio', 'Parra', 'stevenparracuesta@gmail.com', '12345678', 'Jefe'),
(2, 'johan_rojas', 'Johan', 'Rojas', 'johan_rojas@gmail.com', '12345678', 'Jefe'),
(3, 'tatiana_criado', 'Tatiana', 'Criado', 'tatiana.criado@gmail.com', '12345678', 'Empleado'),
(4, 'steven_cuesta', 'Steven', 'Cuesta', 'steven-cuesta@hotmail.com', '12345678', 'Empleado'),
(5, 'erick_ruales', 'Erick', 'Ruales', 'erick.ruales@hotmail.com', '12345678', 'Empleado'),
(6, 'hayder_pava', 'Hayber', 'Pava', 'hayver.pava56@gmail.com', '12345678', 'Empleado'),
(7, 'fer_fonseca', 'Fernando', 'Fonseca', 'fer.fonseca78@gmail.com', '12345678', 'Empleado'),
(8, 'erick_alvarez', 'Erick', 'Alvarez', 'erick.alvarez45@gmail.com', '12345678', 'Conductor'),
(9, 'jose_veloza', 'Jose', 'Veloza', 'joseveloza46@gmail.com', '12345678', 'Conductor'),
(10, 'maria_mendoza', 'Maria', 'Mendoza', 'maria.mendoza25@gmail.com', '12345678', 'Conductor'),
(11, 'ber_martinez', 'Bernardo', 'Martinez', 'bernardo.martinez@gmail.com', '12345678', 'Conductor');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `driver`
--
ALTER TABLE `driver`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_type_of_vehicle` (`id_type_of_vehicle`);

--
-- Indices de la tabla `hierarchy`
--
ALTER TABLE `hierarchy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_employee` (`id_employee`),
  ADD KEY `id_boss` (`id_boss`);

--
-- Indices de la tabla `journey`
--
ALTER TABLE `journey`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_origin_place` (`id_origin_place`),
  ADD KEY `id_arrival_place` (`id_arrival_place`),
  ADD KEY `id_supplier` (`id_supplier`),
  ADD KEY `id_driver` (`id_driver`),
  ADD KEY `id_type_of_vehicle` (`id_type_of_vehicle`),
  ADD KEY `id_licence_plate` (`id_licence_plate`),
  ADD KEY `journey_ibfk_8` (`id_usu_boss`);

--
-- Indices de la tabla `licence_plate`
--
ALTER TABLE `licence_plate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_type_of_vehicle` (`id_type_of_vehicle`);

--
-- Indices de la tabla `place`
--
ALTER TABLE `place`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `type_of_vehicle`
--
ALTER TABLE `type_of_vehicle`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `journey`
--
ALTER TABLE `journey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `driver`
--
ALTER TABLE `driver`
  ADD CONSTRAINT `driver_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `driver_ibfk_2` FOREIGN KEY (`id_type_of_vehicle`) REFERENCES `type_of_vehicle` (`id`);

--
-- Filtros para la tabla `hierarchy`
--
ALTER TABLE `hierarchy`
  ADD CONSTRAINT `hierarchy_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `hierarchy_ibfk_2` FOREIGN KEY (`id_boss`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `journey`
--
ALTER TABLE `journey`
  ADD CONSTRAINT `journey_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `journey_ibfk_2` FOREIGN KEY (`id_origin_place`) REFERENCES `place` (`id`),
  ADD CONSTRAINT `journey_ibfk_3` FOREIGN KEY (`id_arrival_place`) REFERENCES `place` (`id`),
  ADD CONSTRAINT `journey_ibfk_4` FOREIGN KEY (`id_supplier`) REFERENCES `supplier` (`id`),
  ADD CONSTRAINT `journey_ibfk_5` FOREIGN KEY (`id_driver`) REFERENCES `driver` (`id`),
  ADD CONSTRAINT `journey_ibfk_6` FOREIGN KEY (`id_type_of_vehicle`) REFERENCES `type_of_vehicle` (`id`),
  ADD CONSTRAINT `journey_ibfk_7` FOREIGN KEY (`id_licence_plate`) REFERENCES `licence_plate` (`id`),
  ADD CONSTRAINT `journey_ibfk_8` FOREIGN KEY (`id_usu_boss`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `licence_plate`
--
ALTER TABLE `licence_plate`
  ADD CONSTRAINT `licence_plate_ibfk_1` FOREIGN KEY (`id_type_of_vehicle`) REFERENCES `type_of_vehicle` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

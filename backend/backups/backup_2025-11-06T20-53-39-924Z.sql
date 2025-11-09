

DROP TABLE IF EXISTS `mng_agents`;
CREATE TABLE `mng_agents` (
  `CustomerId` int unsigned NOT NULL AUTO_INCREMENT,
  `CustomerParentId` int DEFAULT '-1',
  `CustomerStatusId` int DEFAULT '0',
  `CustomerTypeId` int DEFAULT NULL,
  `CustomerIdz` varchar(50) DEFAULT NULL,
  `CustomerName` varchar(500) DEFAULT NULL,
  `CustomerOpeningBalance` decimal(20,2) DEFAULT NULL,
  `CustomerNotes` varchar(1000) DEFAULT NULL,
  `CustomerProfileImage` varchar(200) DEFAULT NULL,
  `CustomerEmails` varchar(500) DEFAULT NULL,
  `CustomerPhoneNumber` varchar(20) DEFAULT NULL,
  `CustomerMobileNumber` varchar(20) DEFAULT NULL,
  `CustomerFaxNumber` varchar(20) DEFAULT NULL,
  `CustomerAddressLine1` varchar(100) DEFAULT NULL,
  `CustomerAddressLine2` varchar(100) DEFAULT NULL,
  `CustomerCity` varchar(50) DEFAULT NULL,
  `CustomerState` varchar(50) DEFAULT NULL,
  `CustomerZIP` varchar(50) DEFAULT NULL,
  `CustomerCountry` varchar(50) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`CustomerId`),
  KEY `IDX_23a60148ce59c1f41a7c651199` (`CustomerIdz`),
  KEY `IDX_79f3d8fdc837fe59ab541b1623` (`CustomerCountry`),
  KEY `FKIndex` (`CustomerId`,`CustomerStatusId`,`CustomerTypeId`,`CreatedDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_backups`;
CREATE TABLE `mng_backups` (
  `BackupId` int unsigned NOT NULL AUTO_INCREMENT,
  `BackupPath` varchar(500) DEFAULT NULL,
  `BackupNotes` varchar(1000) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `CanDelete` bit(1) DEFAULT b'0',
  PRIMARY KEY (`BackupId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_cars`;
CREATE TABLE `mng_cars` (
  `CarId` int unsigned NOT NULL AUTO_INCREMENT,
  `ObjectId` int DEFAULT '0',
  `CarStatusId` int DEFAULT '0',
  `CarNumber` varchar(50) DEFAULT NULL,
  `CarNotes` varchar(1000) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`CarId`),
  KEY `FKIndex` (`CarId`,`ObjectId`,`CarStatusId`,`CarNumber`,`CreatedDate`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_cars` VALUES (1, 1, 1, 'ABC-1234', 'سيارة نقل بضائع', 1, 1, '2025-10-19T23:08:07.206Z', '2025-10-19T23:08:07.206Z');
INSERT INTO `mng_cars` VALUES (2, 1, 1, 'XYZ-5678', 'سيارة توصيل', 1, 1, '2025-10-19T23:08:07.206Z', '2025-10-19T23:08:07.206Z');
INSERT INTO `mng_cars` VALUES (3, 2, 1, 'DEF-9012', 'سيارة نقل ثقيل', 1, 1, '2025-10-19T23:08:07.206Z', '2025-10-19T23:08:07.206Z');
INSERT INTO `mng_cars` VALUES (4, 1, 1, 'GHI-3456', 'سيارة قيد الصيانة', 1, 1, '2025-10-19T23:08:07.206Z', '2025-10-19T23:08:07.206Z');
INSERT INTO `mng_cars` VALUES (5, 2, 1, 'JKL-7890', 'سيارة توصيل سريع', 1, 1, '2025-10-19T23:08:07.206Z', '2025-10-19T23:08:07.206Z');
INSERT INTO `mng_cars` VALUES (6, 0, 1, 'sqsdf', 'qsfdfqsd', 1, 1, '2025-10-20T22:28:31.118Z', '2025-10-20T22:28:31.118Z');


DROP TABLE IF EXISTS `mng_customers`;
CREATE TABLE `mng_customers` (
  `CustomerId` int unsigned NOT NULL AUTO_INCREMENT,
  `CustomerParentId` int DEFAULT '0',
  `CustomerStatusId` int DEFAULT '0',
  `CustomerTypeId` int DEFAULT NULL,
  `CustomerIdz` varchar(50) DEFAULT NULL,
  `CustomerName` varchar(500) DEFAULT NULL,
  `CustomerOpeningBalance` decimal(20,2) DEFAULT NULL,
  `CustomerAllowedExcessAmount` decimal(20,2) DEFAULT NULL,
  `CustomerAllowedExcessDays` int DEFAULT NULL,
  `CustomerNotes` varchar(1000) DEFAULT NULL,
  `CustomerProfileImage` varchar(200) DEFAULT NULL,
  `CustomerEmails` varchar(500) DEFAULT NULL,
  `CustomerPhoneNumber` varchar(20) DEFAULT NULL,
  `CustomerMobileNumber` varchar(20) DEFAULT NULL,
  `CustomerFaxNumber` varchar(20) DEFAULT NULL,
  `CustomerAddressLine1` varchar(100) DEFAULT NULL,
  `CustomerAddressLine2` varchar(100) DEFAULT NULL,
  `CustomerCity` varchar(50) DEFAULT NULL,
  `CustomerState` varchar(50) DEFAULT NULL,
  `CustomerZIP` varchar(50) DEFAULT NULL,
  `CustomerCountry` varchar(50) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`CustomerId`),
  UNIQUE KEY `CustomerId_UNIQUE` (`CustomerId`),
  KEY `IDX_c93f86cdec08d0f5d47c66c11e` (`CustomerIdz`),
  KEY `IDX_56663e5542c7be3d6575292b7c` (`CustomerCountry`),
  KEY `FKIndex` (`CustomerId`,`CustomerStatusId`,`CustomerTypeId`,`CreatedDate`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_customers` VALUES (1, 0, 1, NULL, '123456789', 'أحمد محمد علي', NULL, NULL, NULL, NULL, NULL, 'ahmed@example.com', '0501234567', NULL, NULL, 'شارع الملك فهد، الرياض', NULL, 'الرياض', NULL, NULL, NULL, 1, 1, '2025-10-19T23:08:07.122Z', '2025-10-19T23:08:07.122Z');
INSERT INTO `mng_customers` VALUES (2, 0, 1, NULL, '987654321', 'فاطمة حسن', NULL, NULL, NULL, NULL, NULL, 'fatima@example.com', '0559876543', NULL, NULL, 'شارع العليا، جدة', NULL, 'جدة', NULL, NULL, NULL, 1, 1, '2025-10-19T23:08:07.122Z', '2025-10-19T23:08:07.122Z');
INSERT INTO `mng_customers` VALUES (3, 0, 1, NULL, '456789123', 'خالد عبدالله', NULL, NULL, NULL, NULL, NULL, 'khaled@example.com', '0505551234', NULL, NULL, 'شارع التحلية، الدمام', NULL, 'الدمام', NULL, NULL, NULL, 1, 1, '2025-10-19T23:08:07.122Z', '2025-10-19T23:08:07.122Z');
INSERT INTO `mng_customers` VALUES (4, 0, 1, NULL, '789123456', 'سارة أحمد', NULL, NULL, NULL, NULL, NULL, 'sara@example.com', '0507778899', NULL, NULL, 'شارع الأمير محمد، الخبر', NULL, 'الخبر', NULL, NULL, NULL, 1, 1, '2025-10-19T23:08:07.122Z', '2025-10-19T23:08:07.122Z');
INSERT INTO `mng_customers` VALUES (5, 0, 1, NULL, '321654987', 'محمد يوسف', NULL, NULL, NULL, NULL, NULL, 'mohamed@example.com', '0503334455', NULL, NULL, 'شارع الملك عبدالعزيز، مكة', NULL, 'مكة', NULL, NULL, NULL, 1, 1, '2025-10-19T23:08:07.122Z', '2025-10-19T23:08:07.122Z');


DROP TABLE IF EXISTS `mng_drivers`;
CREATE TABLE `mng_drivers` (
  `DriverId` int unsigned NOT NULL AUTO_INCREMENT,
  `DriverParentId` int DEFAULT '0',
  `DriverStatusId` int DEFAULT '0',
  `DriverTypeId` int DEFAULT NULL,
  `DriverIdz` varchar(50) DEFAULT NULL,
  `CarNumber` varchar(50) DEFAULT NULL,
  `DriverName` varchar(500) DEFAULT NULL,
  `DriverNotes` varchar(1000) DEFAULT NULL,
  `DriverProfileImage` varchar(200) DEFAULT NULL,
  `DriverEmails` varchar(500) DEFAULT NULL,
  `DriverPhoneNumber` varchar(20) DEFAULT NULL,
  `DriverMobileNumber` varchar(20) DEFAULT NULL,
  `DriverFaxNumber` varchar(20) DEFAULT NULL,
  `DriverAddressLine1` varchar(100) DEFAULT NULL,
  `DriverAddressLine2` varchar(100) DEFAULT NULL,
  `DriverCity` varchar(50) DEFAULT NULL,
  `DriverState` varchar(50) DEFAULT NULL,
  `DriverZIP` varchar(50) DEFAULT NULL,
  `DriverCountry` varchar(50) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`DriverId`),
  KEY `IDX_22b04ee39019db7c411373f87e` (`DriverIdz`),
  KEY `IDX_5a0d326bf889248c637206daf1` (`CarNumber`),
  KEY `IDX_409c17d54ad04ce25349d1d03c` (`DriverCountry`),
  KEY `FKIndex` (`DriverId`,`DriverParentId`,`DriverStatusId`,`DriverTypeId`,`CreatedDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_inventoryadjustmentitems`;
CREATE TABLE `mng_inventoryadjustmentitems` (
  `AdjustmentItemId` int unsigned NOT NULL AUTO_INCREMENT,
  `AdjustmentId` int DEFAULT NULL,
  `ProductItemId` int DEFAULT NULL,
  `ProductItemCostTypeId` int DEFAULT NULL,
  `ProductItemCost` decimal(20,2) DEFAULT NULL,
  `ProductItemAdjustedCost` decimal(20,2) DEFAULT NULL,
  `ReferenceNumber` varchar(100) NOT NULL,
  `AdjustmentItemNewStockUnits` int DEFAULT NULL,
  `PalletsAmount` int DEFAULT NULL,
  `AdjustmentItemStatusId` int DEFAULT NULL,
  `AdjustmentItemReasonId` int DEFAULT NULL,
  `CreatedBy` int DEFAULT NULL,
  `ModifiedBy` int DEFAULT NULL,
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`AdjustmentItemId`),
  KEY `FKIndex` (`AdjustmentItemId`,`AdjustmentId`,`ProductItemId`,`AdjustmentItemStatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_inventoryadjustments`;
CREATE TABLE `mng_inventoryadjustments` (
  `AdjustmentId` int unsigned NOT NULL AUTO_INCREMENT,
  `AdjustmentDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `AdjustmentStatusId` int DEFAULT NULL,
  `AdjustmentTypeId` int DEFAULT NULL,
  `Description` longtext,
  `CreatedBy` int DEFAULT NULL,
  `ModifiedBy` int DEFAULT NULL,
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`AdjustmentId`),
  KEY `FKIndex` (`AdjustmentId`,`AdjustmentDate`,`AdjustmentStatusId`,`AdjustmentTypeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_lookups`;
CREATE TABLE `mng_lookups` (
  `LookUpId` int unsigned NOT NULL AUTO_INCREMENT,
  `LookUpTableName` varchar(100) DEFAULT NULL,
  `LookUpCode` varchar(50) DEFAULT NULL,
  `LookUpName` varchar(255) DEFAULT NULL,
  `Param1` varchar(255) DEFAULT NULL,
  `Param2` varchar(255) DEFAULT NULL,
  `Param3` varchar(255) DEFAULT NULL,
  `LookUpStatus` int DEFAULT '1',
  `LookUpTypeId` int DEFAULT '0',
  `LookUpTypeName` varchar(100) DEFAULT NULL,
  `LookUpData` text,
  `CreatedById` int DEFAULT '1',
  `ModifiedById` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`LookUpId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_lookups` VALUES (1, 'OrderType', 'IMMEDIATE', 'طلب فوري', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (2, 'OrderType', 'REGULAR', 'طلب عادي', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (3, 'TaxRate', 'VAT', 'ضريبة القيمة المضافة', '0.17', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (4, 'ProductCategory', 'PARTS', 'قطع غيار', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (5, 'ProductCategory', 'SERVICE', 'خدمات', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (6, 'ProductStatus', 'ACTIVE', 'نشط', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (7, 'CarStatus', 'ACTIVE', 'نشط', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');
INSERT INTO `mng_lookups` VALUES (8, 'CustomerStatus', 'ACTIVE', 'نشط', '', NULL, NULL, 1, 0, NULL, NULL, 1, 1, '2025-10-19T23:08:07.015Z', '2025-10-19T23:08:07.015Z');


DROP TABLE IF EXISTS `mng_orderitems`;
CREATE TABLE `mng_orderitems` (
  `OrderItemId` int unsigned NOT NULL AUTO_INCREMENT,
  `OrderId` int DEFAULT NULL,
  `OrderTypeId` int DEFAULT NULL,
  `OrderUnitsNumber` decimal(20,2) DEFAULT NULL,
  `OrderPrice` decimal(20,2) DEFAULT NULL,
  `OrderVat` decimal(20,2) DEFAULT NULL,
  `OrderIncludeVat` int DEFAULT '1',
  `OrderTotalPriceWithOutVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceWithVat` decimal(20,2) DEFAULT NULL,
  `OrderCost` decimal(20,2) DEFAULT NULL,
  `OrderTotalCost` decimal(20,2) DEFAULT NULL,
  `OrderStatusId` int DEFAULT NULL,
  `ShippingCertificateId` varchar(50) DEFAULT NULL,
  `AgentId` int DEFAULT NULL,
  `FromLocationId` int DEFAULT NULL,
  `ToLocationId` int DEFAULT NULL,
  `OrderNotes` varchar(1000) DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`OrderItemId`),
  KEY `FKIndex` (`OrderItemId`,`OrderId`,`OrderTypeId`,`OrderStatusId`,`ShippingCertificateId`,`FromLocationId`,`ToLocationId`,`OrderDate`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_orderitems` VALUES (1, 1, NULL, '1.00', '800.00', NULL, 1, '800.00', '136.00', '936.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:07.000Z', 1, 1, '2025-10-19T23:08:07.590Z', '2025-10-19T23:08:07.590Z');
INSERT INTO `mng_orderitems` VALUES (2, 1, NULL, '2.00', '50.00', NULL, 1, '100.00', '17.00', '117.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:07.000Z', 1, 1, '2025-10-19T23:08:07.590Z', '2025-10-19T23:08:07.590Z');
INSERT INTO `mng_orderitems` VALUES (3, 2, NULL, '1.00', '500.00', NULL, 1, '500.00', '85.00', '585.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:07.000Z', 1, 1, '2025-10-19T23:08:07.809Z', '2025-10-19T23:08:07.809Z');
INSERT INTO `mng_orderitems` VALUES (4, 2, NULL, '1.00', '200.00', NULL, 1, '200.00', '34.00', '234.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:07.000Z', 1, 1, '2025-10-19T23:08:07.809Z', '2025-10-19T23:08:07.809Z');
INSERT INTO `mng_orderitems` VALUES (5, 3, NULL, '1.00', '1200.00', NULL, 1, '1200.00', '204.00', '1404.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:07.000Z', 1, 1, '2025-10-19T23:08:07.963Z', '2025-10-19T23:08:07.963Z');
INSERT INTO `mng_orderitems` VALUES (6, 4, NULL, '1.00', '350.00', NULL, 1, '350.00', '59.50', '409.50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:08.000Z', 1, 1, '2025-10-19T23:08:08.053Z', '2025-10-19T23:08:08.053Z');
INSERT INTO `mng_orderitems` VALUES (7, 4, NULL, '4.00', '400.00', NULL, 1, '1600.00', '272.00', '1872.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:08.000Z', 1, 1, '2025-10-19T23:08:08.053Z', '2025-10-19T23:08:08.053Z');
INSERT INTO `mng_orderitems` VALUES (8, 5, NULL, '1.00', '800.00', NULL, 0, '800.00', '0.00', '800.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:08.000Z', 1, 1, '2025-10-19T23:08:08.230Z', '2025-10-19T23:08:08.230Z');
INSERT INTO `mng_orderitems` VALUES (9, 5, NULL, '3.00', '150.00', NULL, 0, '450.00', '0.00', '450.00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-19T23:08:08.000Z', 1, 1, '2025-10-19T23:08:08.230Z', '2025-10-19T23:08:08.230Z');


DROP TABLE IF EXISTS `mng_orders`;
CREATE TABLE `mng_orders` (
  `OrderId` int unsigned NOT NULL AUTO_INCREMENT,
  `CustomerId` int DEFAULT NULL,
  `DriverId` int DEFAULT NULL,
  `OrderTypeId` int DEFAULT NULL,
  `OrderUnitsNumber` decimal(20,2) DEFAULT NULL,
  `OrderPrice` decimal(20,2) DEFAULT NULL,
  `OrderVat` decimal(20,2) DEFAULT NULL,
  `OrderIncludeVat` int DEFAULT '1',
  `OrderTotalPriceWithOutVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceWithVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalCost` decimal(20,2) DEFAULT NULL,
  `OrderStatusId` int DEFAULT NULL,
  `ShippingCertificateId` varchar(50) DEFAULT NULL,
  `Meters` int DEFAULT NULL,
  `Cubes` int DEFAULT NULL,
  `FromLocationId` int DEFAULT NULL,
  `ToLocationId` int DEFAULT NULL,
  `LocationAddress` varchar(255) DEFAULT NULL,
  `OrderNotes` varchar(1000) DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `EvacuationTime` int DEFAULT '0',
  `ConversionDate` datetime DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`OrderId`),
  KEY `FKIndex` (`OrderId`,`CustomerId`,`OrderStatusId`,`OrderDate`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_orders` VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'شارع الملك فهد، الرياض', 'صيانة دورية - CNT-2024-001', '2024-01-15T00:00:00.000Z', 0, NULL, 1, 1, '2025-10-19T23:08:07.496Z', '2025-10-19T23:08:07.496Z');
INSERT INTO `mng_orders` VALUES (2, 2, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'شارع العليا، جدة', 'فحص سنوي - CNT-2024-002', '2024-01-16T00:00:00.000Z', 0, NULL, 1, 1, '2025-10-19T23:08:07.496Z', '2025-10-19T23:08:07.496Z');
INSERT INTO `mng_orders` VALUES (3, 3, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'شارع التحلية، الدمام', 'إصلاح عاجل - CNT-2024-003', '2024-01-17T00:00:00.000Z', 0, NULL, 1, 1, '2025-10-19T23:08:07.496Z', '2025-10-19T23:08:07.496Z');
INSERT INTO `mng_orders` VALUES (4, 4, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'شارع الأمير محمد، الخبر', 'تغيير قطع - CNT-2024-004', '2024-01-18T00:00:00.000Z', 0, NULL, 1, 1, '2025-10-19T23:08:07.496Z', '2025-10-19T23:08:07.496Z');
INSERT INTO `mng_orders` VALUES (5, 5, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'شارع الملك عبدالعزيز، مكة', 'صيانة عامة - CNT-2024-005', '2024-01-19T00:00:00.000Z', 0, NULL, 1, 1, '2025-10-19T23:08:07.496Z', '2025-10-19T23:08:07.496Z');


DROP TABLE IF EXISTS `mng_paymentitems`;
CREATE TABLE `mng_paymentitems` (
  `PaymentItemId` int unsigned NOT NULL AUTO_INCREMENT,
  `PaymentId` int DEFAULT NULL,
  `PaymentItemMethodId` int DEFAULT NULL,
  `PaymentItemBankId` int DEFAULT NULL,
  `PaymentItemBankAccountNumber` varchar(20) DEFAULT NULL,
  `PaymentItemBankBranchNumber` varchar(20) DEFAULT NULL,
  `PaymentItemAmount` decimal(20,2) DEFAULT NULL,
  `PaymentItemCheckNumber` varchar(20) DEFAULT NULL,
  `PaymentItemNameOnCheck` varchar(500) DEFAULT NULL,
  `PaymentItemCheckDueDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `PaymentItemReference` varchar(45) DEFAULT NULL,
  `PaymentItemCheckStatusId` int DEFAULT NULL,
  `PaymentItemStatusId` int DEFAULT NULL,
  `PaymentItemNotes` varchar(1000) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`PaymentItemId`),
  KEY `FKIndex` (`PaymentItemId`,`PaymentId`,`PaymentItemMethodId`,`PaymentItemStatusId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_payments`;
CREATE TABLE `mng_payments` (
  `PaymentId` int unsigned NOT NULL AUTO_INCREMENT,
  `CustomerId` int DEFAULT NULL,
  `PaymentTypeId` int DEFAULT NULL,
  `PaymentDiscount` decimal(20,2) DEFAULT NULL,
  `PaymentStatusId` int DEFAULT '1',
  `PaymentNotes` varchar(1000) DEFAULT NULL,
  `PaymentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`PaymentId`),
  KEY `FKIndex` (`PaymentId`,`CustomerId`,`PaymentTypeId`,`PaymentStatusId`,`PaymentDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_products`;
CREATE TABLE `mng_products` (
  `ProductId` int unsigned NOT NULL AUTO_INCREMENT,
  `ProductCode` varchar(255) NOT NULL,
  `ProductName` varchar(255) DEFAULT NULL,
  `CategoryId` int DEFAULT NULL,
  `ProductSize` varchar(255) DEFAULT NULL,
  `ManufacturerId` int DEFAULT NULL,
  `BrandId` int DEFAULT NULL,
  `ProductPrice` decimal(20,2) DEFAULT NULL,
  `ProductImage` varchar(500) DEFAULT NULL,
  `ReturnableItem` int DEFAULT '1',
  `IncludeVariants` int DEFAULT '1',
  `ProductVariants` longtext,
  `ProductStatusId` int DEFAULT '1',
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`ProductId`),
  UNIQUE KEY `ProductCode_UNIQUE` (`ProductCode`),
  KEY `IDX_01b6b54fc5391d8495f9cd3c27` (`ProductCode`),
  KEY `FKIndex` (`ProductId`,`CategoryId`,`ProductStatusId`,`CreatedDate`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `mng_products` VALUES (1, 'SRV001', 'خدمة صيانة شاملة', 1, NULL, NULL, NULL, '800.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (2, 'SRV002', 'فحص دوري', 1, NULL, NULL, NULL, '500.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (3, 'SRV003', 'تغيير زيت', 1, NULL, NULL, NULL, '200.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (4, 'SRV004', 'إصلاح المحرك', 1, NULL, NULL, NULL, '1200.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (5, 'PRT001', 'فلتر زيت', 2, NULL, NULL, NULL, '50.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (6, 'PRT002', 'فلتر هواء', 2, NULL, NULL, NULL, '45.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (7, 'PRT003', 'بطارية', 2, NULL, NULL, NULL, '350.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (8, 'PRT004', 'إطار', 2, NULL, NULL, NULL, '400.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (9, 'PRT005', 'ممسحة زجاج', 2, NULL, NULL, NULL, '80.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');
INSERT INTO `mng_products` VALUES (10, 'PRT006', 'قطع غيار متنوعة', 2, NULL, NULL, NULL, '150.00', NULL, 1, 1, NULL, 1, 1, 1, '2025-10-19T23:08:07.324Z', '2025-10-19T23:08:07.324Z');


DROP TABLE IF EXISTS `mng_quoteitems`;
CREATE TABLE `mng_quoteitems` (
  `OrderItemId` int unsigned NOT NULL AUTO_INCREMENT,
  `OrderId` int DEFAULT NULL,
  `OrderTypeId` int DEFAULT NULL,
  `OrderUnitsNumber` decimal(20,2) DEFAULT NULL,
  `OrderPrice` decimal(20,2) DEFAULT NULL,
  `OrderVat` decimal(20,2) DEFAULT NULL,
  `OrderIncludeVat` int DEFAULT '1',
  `OrderTotalPriceWithOutVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceWithVat` decimal(20,2) DEFAULT NULL,
  `OrderStatusId` int DEFAULT NULL,
  `ShippingCertificateId` varchar(50) DEFAULT NULL,
  `FromLocationId` int DEFAULT NULL,
  `ToLocationId` int DEFAULT NULL,
  `OrderNotes` varchar(1000) DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`OrderItemId`),
  KEY `FKIndex` (`OrderItemId`,`OrderId`,`OrderTypeId`,`OrderStatusId`,`ShippingCertificateId`,`FromLocationId`,`ToLocationId`,`OrderDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_quotes`;
CREATE TABLE `mng_quotes` (
  `OrderId` int unsigned NOT NULL AUTO_INCREMENT,
  `CustomerId` int DEFAULT NULL,
  `DriverId` int DEFAULT NULL,
  `OrderTypeId` int DEFAULT NULL,
  `OrderUnitsNumber` decimal(20,2) DEFAULT NULL,
  `OrderPrice` decimal(20,2) DEFAULT NULL,
  `OrderVat` decimal(20,2) DEFAULT NULL,
  `OrderIncludeVat` int DEFAULT '1',
  `OrderTotalPriceWithOutVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceWithVat` decimal(20,2) DEFAULT NULL,
  `OrderStatusId` int DEFAULT NULL,
  `ShippingCertificateId` varchar(50) DEFAULT NULL,
  `Meters` int DEFAULT NULL,
  `Cubes` int DEFAULT NULL,
  `FromLocationId` int DEFAULT NULL,
  `ToLocationId` int DEFAULT NULL,
  `LocationAddress` varchar(500) DEFAULT NULL,
  `OrderNotes` varchar(1000) DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `EvacuationTime` int DEFAULT '0',
  `ConversionDate` datetime DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`OrderId`),
  KEY `FKIndex` (`OrderId`,`CustomerId`,`DriverId`,`OrderTypeId`,`OrderStatusId`,`ShippingCertificateId`,`FromLocationId`,`ToLocationId`,`OrderDate`,`ConversionDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_transportationitems`;
CREATE TABLE `mng_transportationitems` (
  `TransportationItemId` int unsigned NOT NULL AUTO_INCREMENT,
  `TransportationId` int DEFAULT NULL,
  `TransportationItemStatusId` int DEFAULT NULL,
  `ShippingCertificateId` varchar(50) DEFAULT NULL,
  `TransportationItemDesc` varchar(1000) DEFAULT NULL,
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `OrderUnitsNumber` decimal(20,2) DEFAULT NULL,
  `OrderPrice` decimal(20,2) DEFAULT NULL,
  `OrderVat` decimal(20,2) DEFAULT NULL,
  `OrderIncludeVat` int DEFAULT '1',
  `OrderTotalPriceWithOutVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalPriceWithVat` decimal(20,2) DEFAULT NULL,
  `OrderTotalCost` decimal(20,2) DEFAULT NULL,
  `OrderStatusId` int DEFAULT NULL,
  `Meters` int DEFAULT NULL,
  `Cubes` int DEFAULT NULL,
  `FromLocationId` int DEFAULT NULL,
  `ToLocationId` int DEFAULT NULL,
  `LocationAddress` varchar(500) DEFAULT NULL,
  `OrderNotes` varchar(1000) DEFAULT NULL,
  `OrderDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `EvacuationTime` int DEFAULT '0',
  `ConversionDate` datetime DEFAULT NULL,
  PRIMARY KEY (`TransportationItemId`),
  KEY `FKIndex` (`TransportationItemId`,`TransportationId`,`TransportationItemStatusId`,`ShippingCertificateId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `mng_transportations`;
CREATE TABLE `mng_transportations` (
  `TransportationId` int unsigned NOT NULL AUTO_INCREMENT,
  `DriverId` int DEFAULT NULL,
  `TransportationStatusId` int DEFAULT NULL,
  `TransportationNotes` varchar(1000) DEFAULT NULL,
  `TransportationDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedBy` int DEFAULT '1',
  `ModifiedBy` int DEFAULT '1',
  `CreatedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`TransportationId`),
  KEY `FKIndex` (`TransportationId`,`DriverId`,`TransportationStatusId`,`TransportationDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `UserStatus` int NOT NULL DEFAULT '-1',
  `UserType` int NOT NULL DEFAULT '-1',
  `FullName` varchar(255) DEFAULT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `PhoneNumber` varchar(50) DEFAULT NULL,
  `MobileNumber` varchar(50) DEFAULT NULL,
  `FaxNumber` varchar(50) DEFAULT NULL,
  `AddressLine1` varchar(255) DEFAULT NULL,
  `AddressLine2` varchar(255) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `ZIP` varchar(20) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `ProfileImage` text,
  `ResetGuId` varchar(255) DEFAULT NULL,
  `CreatedBy` int NOT NULL DEFAULT '-1',
  `ModifiedBy` int NOT NULL DEFAULT '-1',
  `CreatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `ModifiedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `IDX_69454be7b099b8ac20e082bef6` (`UserName`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
INSERT INTO `users` VALUES (2, 1, 1, 'Test User', 'testuser', 'yuSJdE4lnniCFmlVN/9Q4o1EVt8VvZ63SfQ/sx379e0=', '1234567890', '0987654321', NULL, NULL, NULL, 'Test City', NULL, NULL, NULL, NULL, NULL, 1, 1, '2025-10-09T00:08:05.000Z', '2025-10-09T00:09:10.432Z');

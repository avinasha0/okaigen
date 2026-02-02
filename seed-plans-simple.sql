-- Simple MySQL script to seed plans
-- This will insert plans only if they don't exist (safe to run multiple times)

-- Starter Plan
INSERT IGNORE INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive`, `createdAt`, `updatedAt`) 
VALUES (REPLACE(UUID(), '-', ''), 'Starter', 10, 1, 50, 1, 0, 1, NOW(3), NOW(3));

-- Growth Plan
INSERT IGNORE INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive`, `createdAt`, `updatedAt`) 
VALUES (REPLACE(UUID(), '-', ''), 'Growth', 70, 3, 500, 3, 49, 1, NOW(3), NOW(3));

-- Scale Plan
INSERT IGNORE INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive`, `createdAt`, `updatedAt`) 
VALUES (REPLACE(UUID(), '-', ''), 'Scale', 334, 10, 2000, 10, 149, 1, NOW(3), NOW(3));

-- Enterprise Plan
INSERT IGNORE INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive`, `createdAt`, `updatedAt`) 
VALUES (REPLACE(UUID(), '-', ''), 'Enterprise', 100000, 999, 10000, 999, 999, 1, NOW(3), NOW(3));

-- Verify
SELECT `name`, `dailyLimit`, `botLimit`, `storageLimit`, `price` FROM `Plan` ORDER BY `price`;

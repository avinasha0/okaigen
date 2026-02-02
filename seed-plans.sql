-- Seed Plans for SiteBotGPT
-- Run this script in your MySQL database to create/update the required plans

-- Insert Starter Plan
INSERT INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `stripePriceIdMonthly`, `stripePriceIdYearly`, `razorpayPlanIdMonthly`, `razorpayPlanIdYearly`, `paypalPlanIdMonthly`, `paypalPlanIdYearly`, `isActive`, `createdAt`, `updatedAt`)
SELECT 
    REPLACE(UUID(), '-', '') as `id`,
    'Starter' as `name`,
    10 as `dailyLimit`,
    1 as `botLimit`,
    50 as `storageLimit`,
    1 as `teamMemberLimit`,
    0 as `price`,
    NULL as `stripePriceIdMonthly`,
    NULL as `stripePriceIdYearly`,
    NULL as `razorpayPlanIdMonthly`,
    NULL as `razorpayPlanIdYearly`,
    NULL as `paypalPlanIdMonthly`,
    NULL as `paypalPlanIdYearly`,
    1 as `isActive`,
    NOW(3) as `createdAt`,
    NOW(3) as `updatedAt`
WHERE NOT EXISTS (SELECT 1 FROM `Plan` WHERE `name` = 'Starter');

-- Insert Growth Plan
INSERT INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `stripePriceIdMonthly`, `stripePriceIdYearly`, `razorpayPlanIdMonthly`, `razorpayPlanIdYearly`, `paypalPlanIdMonthly`, `paypalPlanIdYearly`, `isActive`, `createdAt`, `updatedAt`)
SELECT 
    REPLACE(UUID(), '-', '') as `id`,
    'Growth' as `name`,
    70 as `dailyLimit`,
    3 as `botLimit`,
    500 as `storageLimit`,
    3 as `teamMemberLimit`,
    49 as `price`,
    NULL as `stripePriceIdMonthly`,
    NULL as `stripePriceIdYearly`,
    NULL as `razorpayPlanIdMonthly`,
    NULL as `razorpayPlanIdYearly`,
    NULL as `paypalPlanIdMonthly`,
    NULL as `paypalPlanIdYearly`,
    1 as `isActive`,
    NOW(3) as `createdAt`,
    NOW(3) as `updatedAt`
WHERE NOT EXISTS (SELECT 1 FROM `Plan` WHERE `name` = 'Growth');

-- Insert Scale Plan
INSERT INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `stripePriceIdMonthly`, `stripePriceIdYearly`, `razorpayPlanIdMonthly`, `razorpayPlanIdYearly`, `paypalPlanIdMonthly`, `paypalPlanIdYearly`, `isActive`, `createdAt`, `updatedAt`)
SELECT 
    REPLACE(UUID(), '-', '') as `id`,
    'Scale' as `name`,
    334 as `dailyLimit`,
    10 as `botLimit`,
    2000 as `storageLimit`,
    10 as `teamMemberLimit`,
    149 as `price`,
    NULL as `stripePriceIdMonthly`,
    NULL as `stripePriceIdYearly`,
    NULL as `razorpayPlanIdMonthly`,
    NULL as `razorpayPlanIdYearly`,
    NULL as `paypalPlanIdMonthly`,
    NULL as `paypalPlanIdYearly`,
    1 as `isActive`,
    NOW(3) as `createdAt`,
    NOW(3) as `updatedAt`
WHERE NOT EXISTS (SELECT 1 FROM `Plan` WHERE `name` = 'Scale');

-- Insert Enterprise Plan
INSERT INTO `Plan` (`id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `stripePriceIdMonthly`, `stripePriceIdYearly`, `razorpayPlanIdMonthly`, `razorpayPlanIdYearly`, `paypalPlanIdMonthly`, `paypalPlanIdYearly`, `isActive`, `createdAt`, `updatedAt`)
SELECT 
    REPLACE(UUID(), '-', '') as `id`,
    'Enterprise' as `name`,
    100000 as `dailyLimit`,
    999 as `botLimit`,
    10000 as `storageLimit`,
    999 as `teamMemberLimit`,
    999 as `price`,
    NULL as `stripePriceIdMonthly`,
    NULL as `stripePriceIdYearly`,
    NULL as `razorpayPlanIdMonthly`,
    NULL as `razorpayPlanIdYearly`,
    NULL as `paypalPlanIdMonthly`,
    NULL as `paypalPlanIdYearly`,
    1 as `isActive`,
    NOW(3) as `createdAt`,
    NOW(3) as `updatedAt`
WHERE NOT EXISTS (SELECT 1 FROM `Plan` WHERE `name` = 'Enterprise');

-- Verify plans were created
SELECT `id`, `name`, `dailyLimit`, `botLimit`, `storageLimit`, `teamMemberLimit`, `price`, `isActive` 
FROM `Plan` 
ORDER BY `price` ASC;

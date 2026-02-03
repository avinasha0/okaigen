-- CreateIndex: composite index for Chat pagination (botId + createdAt)
CREATE INDEX `Chat_botId_createdAt_idx` ON `Chat`(`botId`, `createdAt`);

-- CreateIndex: composite index for Lead pagination (botId + createdAt)
CREATE INDEX `Lead_botId_createdAt_idx` ON `Lead`(`botId`, `createdAt`);

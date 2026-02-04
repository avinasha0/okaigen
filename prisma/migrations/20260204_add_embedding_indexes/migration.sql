-- Composite index to accelerate embedding retrieval:
-- Queries commonly filter by botId and order by createdAt DESC with a LIMIT.
-- This index improves sorting and reduces filesort on large datasets.
CREATE INDEX `Embedding_botId_createdAt_idx` ON `Embedding`(`botId`, `createdAt`);

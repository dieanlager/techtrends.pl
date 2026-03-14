-- migrations/005_system_health.sql
CREATE TABLE IF NOT EXISTS system_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50), -- 'SCRAPER_RUN', 'INDEX_UPDATE', 'AFFILIATE_CLICK'
    source VARCHAR(50),     -- 'justjoin', 'nofluff', 'udemy'
    status VARCHAR(20),     -- 'SUCCESS', 'ERROR'
    payload JSONB,          -- Szczegóły (np. ilość zassanych ofert)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_logs_event ON system_logs(event_type, created_at);

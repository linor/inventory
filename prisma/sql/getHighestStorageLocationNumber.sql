SELECT MAX(CAST(name AS UNSIGNED)) AS maxName
FROM StorageLocation
WHERE name REGEXP '^[0-9]+$';

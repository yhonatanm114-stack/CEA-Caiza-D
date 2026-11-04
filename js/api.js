// Comunicación con el servidor (que guarda todo en SQLite: cea.db)
const api = (u, m = 'GET', b) => fetch('/api/' + u, { method: m, headers: { 'Content-Type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }).then(r => r.json());

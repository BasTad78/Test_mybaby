const db = require('./db');
(async () => {
    try {
        const { rows } = await db.query('SELECT count(*) FROM Utilisateurs');
        console.log('User count:', rows[0].count);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();

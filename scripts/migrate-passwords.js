import bcrypt from 'bcrypt';
import db from '../util/db.js'; 
import util from 'util';

const query = util.promisify(db.query).bind(db);

async function migratePasswords() {
  try {
    const users = await query(`SELECT id, password FROM users`);

    for (const user of users) {
      const { id, password } = user;

      if (!password.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(password, 10);
        await query(`UPDATE users SET password = ? WHERE id = ?`, [hashed, id]);
        console.log(`Mot de passe mis à jour pour l'utilisateur ${id}`);
      } else {
        console.log(`Mot de passe déjà haché pour l'utilisateur ${id}`);
      }
    }

    console.log(' Migration terminée.');
    process.exit(0);
  } catch (err) {
    console.error(' Erreur lors de la migration :', err);
    process.exit(1);
  }
}

migratePasswords();

import bcrypt from "bcrypt";

const password = ""; // <-- Ton mot de passe
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log("Mot de passe chiffré :", hash);
});

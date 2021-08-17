const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const { firstName, lastName, email, password } = req.body;
const hash = await hashPassword(password);
console.log("hash:", hash);

const user = { firstName, lastName, email, password:hash };
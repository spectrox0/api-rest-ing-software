const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    if (!username || !name || !email || !password ) {
      return res.status(422).send({ mesage: "faltan parametros" });
    }
    const usernameExist = await User.findOne({
      username: username.toLowerCase()
    });
    if (usernameExist) {
      return res.status(500).send({ message: "el usuario ya existe" });
    }
    const emailExist = await User.findOne({
      email: email.toLowerCase()
    });
    if (emailExist) return res.status(500).send({ message: "email exist" });
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username: username.toLowerCase(),
      name: name,
      email: email,
      password: hashedPassword,
      urlImg: urlImg
    });

    const result = await newUser.save();
    if (!result) return res.status("500");
    return res.status(200).json(result._doc);
  } catch (err) {
    return res.status(500).send({ message: "error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(422).send({ message: "error faltan parametros" });

    const user = await User.findOne({
      username: username.toLowerCase(),
      active: true
    });
    if (!user) {
      return res.status(404).send("no se encontro usuario");
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res
        .status(401)
        .send({ message: "Usuario o contraseña incorecta" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.CREDENTIALS_JWT, {
      expiresIn: "12h"
    });

    return res.json({
      _id: user.id,
      token: token
    });
  } catch (err) {
    throw err;
  }
};

exports.getCurrentUser = async (req, res) => {
  if (!req.isAuth) {
    return res.status(404).send("not user found");
  }

  const userId = req.userId;
  if (!userId) return res.status(404).send("not user found");
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ message: "EL usuario no existe" });
    return res.json(user._doc);
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "No Authorized" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, urlImg, password } = req.body;
  if (!name || !username || !urlImg || !password) {
    return res.status(422).send({ message: "falta parametros" });
  }
  if (!req.isAuth) {
    return res.status(404).send("not user found");
  }
  if (req.userId != id) {
    res.status(404).send({ message: "user not authorized" });
  }
  try {
    const user = await User.findById(id);
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res
        .status(401)
        .send({ message: "Usuario o contraseña incorecta" });
    }
    await User.updateOne(
      { _id: id },
      {
        $set: {
          name,
          username,
          urlImg
        }
      }
    );
    await user.save();
    return res.json(user._doc);
  } catch (err) {
    res.status(500).send({ message: "error" });
  }
};

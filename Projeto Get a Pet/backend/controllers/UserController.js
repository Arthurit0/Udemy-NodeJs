const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // Validações
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }

    if (!phone) {
      res
        .status(422)
        .json({ message: "O telefone para contato é obrigatório" });
      return;
    }

    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    if (!confirmpassword) {
      res
        .status(422)
        .json({ message: "A confirmação de senha é obrigatória!" });
      return;
    }

    if (password !== confirmpassword) {
      res.status(422).json({
        message: "A senha e confirmação de senha precisam ser iguais!",
      });
      return;
    }

    // check if user exists
    const userExists = await User.findOne({ email: email });

    if (userExists) {
      res.status(422).json({
        message: "Já existe um usuário com este e-mail cadastrado.",
      });
      return;
    }

    // criptografar a senha no BD

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      //   res.status(201).json({
      //     message: "Usuário cadastrado com sucesso!",
      //     newUser,
      //   });

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "A senha é obrigatória" });
      return;
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(422).json({
        message: "Não há usuário cadastrado com este e-mail.",
      });
      return;
    }

    // Checar se a senha passada no login bate com a salva no BD
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: "Senha Incorreta!",
      });
      return;
    }

    createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "nossoSecret");

      currentUser = await User.findById(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    //   res.status(200).json({
    //     message: "Update bem sucedido!",
    //   });
    //   return;

    const token = getToken(req);
    const user = await getUserByToken(token);

    // Checar se o usuário existe
    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado!",
      });
      return;
    }

    const { name, email, phone, password, confirmpassword } = req.body;

    // Em req.file vem os arquivos que fizemos upload
    // Como temos o Mutter como middleware deste arquivo, ele irá alterar o filename
    if (req.file) {
      user.image = req.file.filename;
    }

    // Validações
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório" });
      return;
    }

    user.name = name;

    if (!email) {
      res.status(422).json({ message: "O e-mail é obrigatório" });
      return;
    }

    // check if email is alredy taken
    const userExists = await User.findOne({ email: email });

    if (user.email != email && userExists) {
      res.status(422).json({
        message: "Já existe um usuário com este e-mail cadastrado.",
      });
      return;
    }

    user.email = email;

    if (!phone) {
      res
        .status(422)
        .json({ message: "O telefone para contato é obrigatório" });
      return;
    }

    user.phone = phone;

    if (password !== confirmpassword) {
      res.status(422).json({
        message: "A senha e confirmação de senha precisam ser iguais!",
      });
      return;
    } else if (password === confirmpassword && password != null) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.password = passwordHash;
    }

    try {
      // Retorna os dados atualizados do usuário
      await User.findOneAndUpdate(
        { _id: user.id },
        { $set: user },
        { new: true }
      );

      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
};

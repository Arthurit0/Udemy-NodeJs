const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const Pet = require("../models/Pet");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  // Criar Pet
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;

    const available = true;

    // Images Upload

    // Validation
    if (!name) {
      res.status(422).json({ message: "O nome do animal é obrigatório!" });
      return;
    }
    if (!age) {
      res.status(422).json({ message: "A idade do animal é obrigatória!" });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso do animal é obrigatório!" });
      return;
    }
    if (!color) {
      res.status(422).json({ message: "A cor do animal é obrigatória!" });
      return;
    }
    if (images.length === 0) {
      res
        .status(422)
        .json({ message: "É obrigatório ao menos uma imagem do animal!" });
      return;
    }

    // Coletando dono do Pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    // Criando Objeto Pet
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Pet cadastrado com sucesso!", newPet });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({
      pets: pets,
    });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets });
  }

  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({ pets });
  }

  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    // Coletar Pet por ID, e checar se existe
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    res.status(200).json({ pet });
  }

  static async removePetById(req, res) {
    const id = req.params.id;

    // Checar se o ID é válido
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    // Coletar Pet por ID, e checar se existe
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    // Checar se o usuário logado foi quem registrou o pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    await Pet.findByIdAndRemove(id);

    res.status(200).json({ message: "Pet removido com sucesso!" });
  }

  static async updatePet(req, res) {
    const id = req.params.id;

    const { name, age, weight, color, available } = req.body;
    const images = req.files;

    const updateData = {};

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    // Checar se o usuário logado foi quem registrou o pet, caso não, enviar erro
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    if (!name) {
      res.status(422).json({ message: "O nome do animal é obrigatório!" });
      return;
    } else {
      updateData.name = name;
    }
    if (!age) {
      res.status(422).json({ message: "A idade do animal é obrigatória!" });
      return;
    } else {
      updateData.age = age;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso do animal é obrigatório!" });
      return;
    } else {
      updateData.weight = weight;
    }
    if (!color) {
      res.status(422).json({ message: "A cor do animal é obrigatória!" });
      return;
    } else {
      updateData.color = color;
    }
    if (images.length === 0) {
      res
        .status(422)
        .json({ message: "É obrigatório ao menos uma imagem do animal!" });
      return;
    } else {
      updateData.images = [];
      images.map((image) => {
        updateData.images.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updateData);
    res.status(200).json({ message: "Pet atualizado com sucesso!" });
  }

  static async schedule(req, res) {
    const id = req.params.id;

    // Coletar Pet por ID, e checar se existe
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }
    // Checar se o usuário logado foi quem cadastrou o pet, caso sim, enviar erro
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: "Você não pode agendar uma visita com seu próprio pet!",
      });
      return;
    }

    // Checar se uma visita já foi agendada
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: "Você já agendou uma visita a este pet!",
        });
        return;
      }
    }

    // Adicionar pet ao usuário
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: `A visita foi agendada com sucesso. Entre em contato com o usuário ${pet.user.name} pelo telefone ${pet.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    // Coletar Pet por ID, e checar se existe
    const id = req.params.id;

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    // Checar se o usuário logado foi quem registrou o pet, caso não, enviar erro
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    pet.available = false;

    await Pet.findOneAndUpdate(id, pet);

    res
      .status(200)
      .json({ message: "Parabéns! O seu pet foi adotado com sucesso!" });
  }
};

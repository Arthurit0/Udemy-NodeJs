import { Link } from "react-router-dom";
import { useState, useContext } from "react";

import Input from "../../form/Input";
import styles from "../../form/Form.module.css";

// Contexts
import { Context } from "../../../context/UserContext";

function Register() {
  const [user, setUser] = useState({});
  const { register } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Enviar usuário para o banco
    register(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Nome"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleOnChange={handleChange}
        />
        <Input
          text="Telefone"
          type="text"
          name="phone"
          placeholder="Digite o seu telefone"
          handleOnChange={handleChange}
        />
        <Input
          text="E-mail"
          type="text"
          name="email"
          placeholder="Digite o seu Email"
          handleOnChange={handleChange}
        />
        <Input
          text="Senha"
          type="password"
          name="password"
          placeholder="Digite sua senha"
          handleOnChange={handleChange}
        />
        <Input
          text="Confirme sua Senha"
          type="password"
          name="confirmpassword"
          placeholder="Digite novamente sua senha"
          handleOnChange={handleChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já possui uma conta? <Link to="/login">Clique aqui</Link>
      </p>
    </section>
  );
}

export default Register;

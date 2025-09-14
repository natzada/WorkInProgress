function Register() {
  return (
    <div className="register">
        <h1>Cadastre-se</h1>
        <div className="form">
            <label htmlFor="">Nome Completo <span>*</span></label>
            <input type="text" />
            <label htmlFor="">Email <span>*</span></label>
            <input type="text" />
            <label htmlFor="">CPF/CNPJ <span>*</span></label>
            <input type="text" />
            <label htmlFor="">Senha <span>*</span></label>
            <input type="text" />
            <label htmlFor="">Confirmar Senha <span>*</span></label>
            <input type="text" />

            <button type="submit">Próximo</button>
        </div>
    </div>
  )
}

export default Register
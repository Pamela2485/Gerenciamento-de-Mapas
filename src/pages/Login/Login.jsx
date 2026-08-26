import {
  useState,
} from 'react'

import {
  supabase,
} from '../../supabaseClient'

import './Login.css'


function Login({
  onLogin,
}) {

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    senha,
    setSenha,
  ] = useState('')

  const [
    carregando,
    setCarregando,
  ] = useState(false)


  async function entrar(
    evento
  ) {

    evento.preventDefault()


    if (
      !email.trim() ||
      !senha.trim()
    ) {

      window.alert(
        'Informe e-mail e senha.'
      )

      return
    }


    try {

      setCarregando(true)


      const {
        data,
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              email.trim(),

            password:
              senha,
          })


      if (error) {

        window.alert(
          'E-mail ou senha inválidos.'
        )

        return
      }


      if (
        data?.session
      ) {

        onLogin?.(
          data.session
        )

      }


    } catch (error) {

      console.error(
        'Erro ao realizar login:',
        error
      )


      window.alert(
        'Não foi possível realizar o login.'
      )


    } finally {

      setCarregando(false)

    }
  }

  async function recuperarSenha() {

  if (!email.trim()) {

    window.alert(
      'Digite seu e-mail primeiro para redefinir a senha.'
    )

    return
  }


  try {

    const {
      error,
    } =
      await supabase.auth
        .resetPasswordForEmail(
          email.trim(),
          {
            redirectTo:
              window.location.hostname === 'localhost'
                ? 'http://localhost:5173/redefinir-senha'
                : 'https://gerencamento-de-mapa.vercel.app/redefinir-senha',
          }
        )


    if (error) {

      console.error(
        'Erro do Supabase:',
        error
      )

      window.alert(
        'Não foi possível enviar o e-mail de recuperação.'
      )

      return
    }


    window.alert(
      'E-mail enviado! Verifique sua caixa de entrada para redefinir sua senha.'
    )


  } catch (error) {

    console.error(
      'Erro ao recuperar senha:',
      error
    )

    window.alert(
      'Não foi possível enviar o e-mail de recuperação.'
    )

  }
}


  return (

    <div className="pagina-login">

      <form
        className="card-login"
        onSubmit={
          entrar
        }
      >

        <img
          src="/icone.png"
          alt="Gerenciamento de Mapa"
          className="logo-login"
        />


        <h1>
          Mapa Operacional
        </h1>


        <p>
          Acesso ao sistema
        </p>


        <label className="login-label">
  E-mail
</label>

<input
  type="email"
  placeholder="Digite seu e-mail"
  value={email}
  onChange={(evento) =>
    setEmail(
      evento.target.value
    )
  }
/>

<label className="login-label">
  Senha
</label>

<input
  type="password"
  placeholder="Digite sua senha"
  value={senha}
  onChange={(evento) =>
    setSenha(
      evento.target.value
    )
  }
/>

        <button
  type="button"
  className="esqueci-senha"
  onClick={
    recuperarSenha
  }
>
  Esqueci minha senha
</button>


        <button
          type="submit"
          disabled={
            carregando
          }
        >

          {carregando
            ? 'Entrando...'
            : 'Entrar'}

        </button>

      </form>

    </div>
  )
}

export default Login
import {
  useState,
} from 'react'

import {
  supabase,
} from '../../supabaseClient'


function RedefinirSenha() {

  const [
    novaSenha,
    setNovaSenha,
  ] = useState('')

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState('')

  const [
    carregando,
    setCarregando,
  ] = useState(false)


  async function salvarNovaSenha(
    evento
  ) {

    evento.preventDefault()


    if (
      !novaSenha ||
      !confirmarSenha
    ) {

      window.alert(
        'Preencha os dois campos.'
      )

      return
    }


    if (
      novaSenha !==
      confirmarSenha
    ) {

      window.alert(
        'As senhas não são iguais.'
      )

      return
    }


    if (
      novaSenha.length < 6
    ) {

      window.alert(
        'A senha deve possuir pelo menos 6 caracteres.'
      )

      return
    }


    try {

      setCarregando(true)


      const {
        error,
      } =
        await supabase.auth
          .updateUser({
            password:
              novaSenha,
          })


      if (error) {

        console.error(
          'Erro ao alterar senha:',
          error
        )

        window.alert(
          'Não foi possível alterar a senha.'
        )

        return
      }


      window.alert(
        'Senha alterada com sucesso!'
      )


      await supabase.auth
        .signOut()


      window.location.href = '/'


    } catch (error) {

      console.error(
        'Erro ao redefinir senha:',
        error
      )

      window.alert(
        'Não foi possível alterar a senha.'
      )


    } finally {

      setCarregando(false)

    }
  }


  return (

    <div className="pagina-login">

      <form
        className="card-login"
        onSubmit={
          salvarNovaSenha
        }
      >

        <img
          src="/icone.png"
          alt="Mapa Operacional"
          className="logo-login"
        />


        <h1>
          Nova senha
        </h1>


        <p>
          Digite sua nova senha
        </p>


        <input
          type="password"
          placeholder="Nova senha"
          value={
            novaSenha
          }
          onChange={(evento) =>
            setNovaSenha(
              evento.target.value
            )
          }
        />


        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={
            confirmarSenha
          }
          onChange={(evento) =>
            setConfirmarSenha(
              evento.target.value
            )
          }
        />


        <button
          type="submit"
          disabled={
            carregando
          }
        >

          {carregando
            ? 'Salvando...'
            : 'Redefinir senha'}

        </button>

      </form>

    </div>

  )
}


export default RedefinirSenha
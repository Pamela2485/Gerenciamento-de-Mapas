import { supabase } from '../supabaseClient'


export async function buscarPerfilUsuario() {

  const {
    data: usuarioAtual,
    error: erroUsuario,
  } =
    await supabase.auth
      .getUser()


  if (erroUsuario) {

    console.error(
      'Erro ao buscar usuário autenticado:',
      erroUsuario
    )

    throw erroUsuario
  }


  const usuario =
    usuarioAtual?.user


  if (!usuario) {
    return null
  }


  const {
    data,
    error,
  } =
    await supabase
      .from('perfis')
      .select(
        `
          id,
          nome,
          email,
          tipo
        `
      )
      .eq(
        'id',
        usuario.id
      )
      .single()


  if (error) {

    console.error(
      'Erro ao buscar perfil:',
      error
    )

    throw error
  }


  return data
}
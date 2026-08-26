import { supabase } from '../supabaseClient'

export async function iniciarSessaoAnonima() {
  const {
    data: sessaoAtual,
    error: erroSessao,
  } = await supabase.auth.getSession()

  if (erroSessao) {
    console.error(
      'Erro ao verificar sessão:',
      erroSessao
    )

    throw erroSessao
  }

  if (!sessaoAtual?.session) {
    const {
      error,
    } = await supabase.auth.signInAnonymously()

    if (error) {
      console.error(
        'Erro ao iniciar sessão:',
        error
      )

      throw error
    }
  }

  return true
}
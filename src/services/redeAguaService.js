import { supabase } from '../supabaseClient'

export async function salvarTrechoRede({
  setor,
  localidade,
  diametro,
  material,
  tipo,
  observacao,
  pontos,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('rede_agua')
    .insert([
      {
        setor,
        localidade,
        diametro: diametro || null,
        material: material || null,
        tipo: tipo || null,
        observacao: observacao || null,
        pontos,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao salvar trecho da rede:',
      error
    )

    throw error
  }

  return data
}

export async function carregarTrechosRede({
  setor,
  localidade,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('rede_agua')
    .select('*')
    .eq('setor', setor)
    .eq('localidade', localidade)
    .order('id', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Erro ao carregar trechos da rede:',
      error
    )

    throw error
  }

  return data || []
}

export async function excluirTrechoRede(id) {
  const {
    error,
  } = await supabase
    .from('rede_agua')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(
      'Erro ao excluir trecho da rede:',
      error
    )

    throw error
  }

  return true
}

export async function atualizarTrechoRede(
  id,
  dados
) {
  const {
    data,
    error,
  } = await supabase
    .from('rede_agua')
    .update({
      diametro:
        dados.diametro || null,

      material:
        dados.material || null,

      tipo:
        dados.tipo || null,

      observacao:
        dados.observacao || null,

        ...(dados.pontos && {
    pontos: dados.pontos,
  }),
  
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar trecho:',
      error
    )

    throw error
  }

  return data
}
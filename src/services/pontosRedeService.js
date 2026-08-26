import { supabase } from '../supabaseClient'

export async function carregarPontosRede({
  setor,
  localidade,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('pontos_rede')
    .select('*')
    .eq('setor', setor)
    .eq('localidade', localidade)
    .order('id', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Erro ao carregar pontos da rede:',
      error
    )

    throw error
  }

  return data || []
}


export async function salvarPontoRede({
  setor,
  localidade,
  nome,
  latitude,
  longitude,
  diametro,
  material,
  situacao,
  observacao,
  cor,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('pontos_rede')
    .insert([
      {
        setor,
        localidade,
        nome,
        latitude,
        longitude,

        diametro:
          diametro || null,

        material:
          material || null,

        situacao:
          situacao || 'operacional',

        observacao:
          observacao || null,

        cor:
          cor || '#2563eb',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao salvar ponto da rede:',
      error
    )

    throw error
  }

  return data
}


export async function atualizarPontoRede(
  id,
  dados
) {
  const {
    data,
    error,
  } = await supabase
    .from('pontos_rede')
    .update({
      nome:
        dados.nome,

      latitude:
        dados.latitude,

      longitude:
        dados.longitude,

      diametro:
        dados.diametro || null,

      material:
        dados.material || null,

      situacao:
        dados.situacao || 'operacional',

      observacao:
        dados.observacao || null,

      cor:
        dados.cor || '#2563eb',
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar ponto da rede:',
      error
    )

    throw error
  }

  return data
}


export async function excluirPontoRede(
  id
) {
  const {
    error,
  } = await supabase
    .from('pontos_rede')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(
      'Erro ao excluir ponto da rede:',
      error
    )

    throw error
  }

  return true
}

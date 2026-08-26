import { supabase } from '../supabaseClient'

export async function carregarRegistrosRede({
  setor,
  localidade,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('registros_rede')
    .select('*')
    .eq('setor', setor)
    .eq('localidade', localidade)
    .order('id', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Erro ao carregar registros:',
      error
    )

    throw error
  }

  return data || []
}


export async function salvarRegistroRede({
  setor,
  localidade,
  latitude,
  longitude,
  diametro,
  material,
  situacao,
  observacao,
}) {
  const {
    data,
    error,
  } = await supabase
    .from('registros_rede')
    .insert([
      {
        setor,
        localidade,
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
      },
    ])
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao salvar registro:',
      error
    )

    throw error
  }

  return data
}


export async function atualizarRegistroRede(
  id,
  dados
) {
  const {
    data,
    error,
  } = await supabase
    .from('registros_rede')
    .update({
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
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao atualizar registro:',
      error
    )

    throw error
  }

  return data
}


export async function excluirRegistroRede(
  id
) {
  const {
    error,
  } = await supabase
    .from('registros_rede')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(
      'Erro ao excluir registro:',
      error
    )

    throw error
  }

  return true
}

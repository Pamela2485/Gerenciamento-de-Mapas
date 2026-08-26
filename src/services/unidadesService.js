import { supabase } from '../supabaseClient'

export async function carregarUnidades() {
  const {
    data,
    error,
  } = await supabase
    .from('unidades')
    .select('*')
    .order('id', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Erro ao carregar unidades:',
      error
    )

    throw error
  }

  const unidadesFormatadas =
    (data || []).map((item) => ({
      ...item,

      numero: String(item.id).padStart(
        3,
        '0'
      ),

      posicao: [
        Number(item.latitude),
        Number(item.longitude),
      ],
    }))

  return unidadesFormatadas
}
export async function atualizarSituacaoUnidade(
  id,
  novaSituacao
) {
  const {
    error,
  } = await supabase
    .from('unidades')
    .update({
      situacao: novaSituacao,
    })
    .eq('id', id)

  if (error) {
    console.error(
      'Erro ao alterar situação:',
      error
    )

    throw error
  }

  return true
}
export async function buscarFotosDaUnidade(
  unidadeId
) {
  const {
    data,
    error,
  } = await supabase
    .from('fotos_unidades')
    .select('*')
    .eq('unidade_id', unidadeId)

  if (error) {
    console.error(
      'Erro ao buscar fotos da unidade:',
      error
    )

    throw error
  }

  return data || []
}
export async function apagarFotosDoStorage(
  fotos
) {
  if (!fotos || fotos.length === 0) {
    return
  }

  const caminhos = fotos
    .map((foto) => {
      if (!foto.url_foto) {
        return null
      }

      const url = new URL(foto.url_foto)

      const parteStorage =
        '/storage/v1/object/public/fotos-unidades/'

      const indice =
        url.pathname.indexOf(
          parteStorage
        )

      if (indice === -1) {
        return null
      }

      return decodeURIComponent(
        url.pathname.substring(
          indice + parteStorage.length
        )
      )
    })
    .filter(Boolean)

  if (caminhos.length === 0) {
    return
  }

  const {
    error,
  } = await supabase.storage
    .from('fotos-unidades')
    .remove(caminhos)

  if (error) {
    console.error(
      'Erro ao apagar fotos do Storage:',
      error
    )

    throw error
  }
}
export async function apagarRegistrosFotos(
  unidadeId
) {
  const {
    error,
  } = await supabase
    .from('fotos_unidades')
    .delete()
    .eq('unidade_id', unidadeId)

  if (error) {
    console.error(
      'Erro ao apagar registros das fotos:',
      error
    )

    throw error
  }
}
export async function excluirUnidadePorId(
  unidadeId
) {
  const {
    data,
    error,
  } = await supabase
    .from('unidades')
    .delete()
    .eq('id', unidadeId)
    .select()

  if (error) {
    console.error(
      'Erro ao excluir unidade:',
      error
    )

    throw error
  }

  if (!data || data.length === 0) {
    throw new Error(
      'Nenhuma unidade foi excluída.'
    )
  }

  return data
}
export async function cadastrarUnidadeNoBanco(
  formulario
) {
  const {
    data,
    error,
  } = await supabase
    .from('unidades')
    .insert([
      {
        setor: formulario.setor,
        localidade:
        formulario.localidade || null,
        quadra: formulario.quadra,
        lote: formulario.lote,
        hidrometro:
          formulario.hidrometro || null,
        matricula:
          formulario.matricula || null,
        situacao: formulario.situacao,
        latitude:
          Number(formulario.latitude),
        longitude:
          Number(formulario.longitude),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error(
      'Erro ao cadastrar unidade:',
      error
    )

    throw error
  }

  return data
}
export async function excluirUnidadeCompleta(
  unidade
) {
  if (!unidade) {
    throw new Error(
      'Unidade inválida.'
    )
  }

  // 1. Buscar fotos da unidade
  const fotos =
    await buscarFotosDaUnidade(
      unidade.id
    )

  // 2. Apagar arquivos do Storage
  await apagarFotosDoStorage(
    fotos
  )

  // 3. Apagar registros da tabela fotos_unidades
  await apagarRegistrosFotos(
    unidade.id
  )

  // 4. Apagar a própria unidade
  await excluirUnidadePorId(
    unidade.id
  )

  return true
}
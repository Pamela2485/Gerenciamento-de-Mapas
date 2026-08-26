import { supabase } from '../supabaseClient'


// =====================================================
// VERIFICAR QUAIS HIDRÔMETROS JÁ EXISTEM
// =====================================================

export async function verificarImportacaoKml({
  unidades,
  setor,
  localidade,
}) {

  const hidrometrosKml =
    unidades
      .map((unidade) =>
        unidade.hidrometro
          ?.trim()
          ?.toLowerCase()
      )
      .filter(Boolean)


  if (hidrometrosKml.length === 0) {

    return {
      total: unidades.length,
      novas: unidades,
      duplicadas: [],
    }
  }


  // Busca os hidrômetros já cadastrados
  // somente do setor/localidade selecionados.

  const {
    data,
    error,
  } = await supabase
    .from('unidades')
    .select(
      'id, hidrometro, setor, localidade'
    )
    .eq('setor', setor)
    .eq('localidade', localidade)


  if (error) {

    console.error(
      'Erro ao verificar hidrômetros existentes:',
      error
    )

    throw error
  }


  const hidrometrosExistentes =
    new Set(
      (data || [])
        .map((item) =>
          item.hidrometro
            ?.trim()
            ?.toLowerCase()
        )
        .filter(Boolean)
    )


  const novas = []
  const duplicadas = []


  unidades.forEach(
    (unidade) => {

      const hidrometro =
        unidade.hidrometro
          ?.trim()
          ?.toLowerCase()


      if (
        hidrometro &&
        hidrometrosExistentes.has(
          hidrometro
        )
      ) {

        duplicadas.push(
          unidade
        )

      } else {

        novas.push(
          unidade
        )

      }

    }
  )


  return {
    total:
      unidades.length,

    novas,

    duplicadas,
  }
}


// =====================================================
// IMPORTAR UNIDADES EM LOTES
// =====================================================

export async function importarUnidadesKml(
  unidades
) {

  const TAMANHO_LOTE = 200

  let importadas = 0
  let erros = 0


  for (
    let inicio = 0;
    inicio < unidades.length;
    inicio += TAMANHO_LOTE
  ) {

    const lote =
      unidades.slice(
        inicio,
        inicio + TAMANHO_LOTE
      )


    const registros =
      lote.map((unidade) => ({

        setor:
          unidade.setor,

        localidade:
          unidade.localidade,

        hidrometro:
          unidade.hidrometro
            ?.trim() || null,

        matricula:
          unidade.matricula
            ?.trim() || null,

        quadra:
          unidade.quadra
            ?.trim() || null,

        lote:
          unidade.lote
            ?.trim() || null,

        situacao:
          unidade.situacao ||
          'ativa',

        latitude:
          Number(
            unidade.latitude
          ),

        longitude:
          Number(
            unidade.longitude
          ),

      }))


    const {
      data,
      error,
    } = await supabase
      .from('unidades')
      .insert(registros)
      .select('id')


    if (error) {

      console.error(
        `Erro ao importar lote iniciado em ${inicio}:`,
        error
      )

      erros +=
        lote.length

      continue
    }


    importadas +=
      data?.length ||
      lote.length
  }


  return {

    total:
      unidades.length,

    importadas,

    erros,

  }
}
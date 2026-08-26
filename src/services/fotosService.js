import { supabase } from '../supabaseClient'

export async function comprimirFoto(arquivo) {
  if (!arquivo?.type?.startsWith('image/')) {
    return arquivo
  }

  return new Promise((resolve, reject) => {
    const imagem = new Image()
    const urlTemporaria =
      URL.createObjectURL(arquivo)

    imagem.onload = () => {
      try {
        const larguraMaxima = 1600
        const alturaMaxima = 1600

        let largura = imagem.width
        let altura = imagem.height

        if (
          largura > larguraMaxima ||
          altura > alturaMaxima
        ) {
          const proporcao = Math.min(
            larguraMaxima / largura,
            alturaMaxima / altura
          )

          largura = Math.round(
            largura * proporcao
          )

          altura = Math.round(
            altura * proporcao
          )
        }

        const canvas =
          document.createElement('canvas')

        canvas.width = largura
        canvas.height = altura

        const contexto =
          canvas.getContext('2d')

        contexto.drawImage(
          imagem,
          0,
          0,
          largura,
          altura
        )

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(
              urlTemporaria
            )

            if (!blob) {
              reject(
                new Error(
                  'Não foi possível reduzir a foto.'
                )
              )
              return
            }

            const nomeOriginal =
              arquivo.name
                .replace(/\.[^/.]+$/, '')

            const fotoComprimida =
              new File(
                [blob],
                `${nomeOriginal}.jpg`,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              )

            resolve(fotoComprimida)
          },
          'image/jpeg',
          0.75
        )

      } catch (error) {
        URL.revokeObjectURL(
          urlTemporaria
        )

        reject(error)
      }
    }

    imagem.onerror = () => {
      URL.revokeObjectURL(
        urlTemporaria
      )

      reject(
        new Error(
          'Não foi possível carregar a foto.'
        )
      )
    }

    imagem.src = urlTemporaria
  })
}

export async function enviarFoto({
  arquivo,
  unidadeId,
  tipo,
  matricula,
}) {

  const arquivoReduzido =
    await comprimirFoto(arquivo)

  const extensao = 'jpg'

  const caminho =
    `unidade-${unidadeId}/${tipo}.${extensao}`

  const {
    error: erroUpload,
  } = await supabase.storage
    .from('fotos-unidades')
    .upload(
      caminho,
      arquivoReduzido,
      {
        upsert: true,
        contentType:
          arquivoReduzido.type,
      }
    )

  if (erroUpload) {
    console.error(
      `Erro ao enviar foto ${tipo}:`,
      erroUpload
    )

    throw erroUpload
  }

  const {
    data: urlPublica,
  } = supabase.storage
    .from('fotos-unidades')
    .getPublicUrl(caminho)

  const urlFoto =
    urlPublica?.publicUrl || null

  const {
    error: erroRegistro,
  } = await supabase
    .from('fotos_unidades')
    .insert([
      {
        unidade_id: unidadeId,
        matricula: matricula || null,
        tipo,
        url_foto: urlFoto,
      },
    ])

  if (erroRegistro) {
    console.error(
      'Foto enviada, mas não foi possível registrar na tabela:',
      erroRegistro
    )

    throw erroRegistro
  }

  return urlFoto
}
export async function carregarFotosUnidades() {
  const {
    data,
    error,
  } = await supabase
    .from('fotos_unidades')
    .select('*')
    .order('id', {
      ascending: true,
    })

  if (error) {
    console.error(
      'Erro ao carregar fotos das unidades:',
      error
    )

    throw error
  }

  return data || []
}
// =====================================================
// IMPORTADOR DE KML - UNIDADES / HIDRÔMETROS
// =====================================================

export function lerArquivoKml(
  arquivo,
  setor,
  localidade
) {
  return new Promise(
    (resolve, reject) => {

      const leitor =
        new FileReader()

      leitor.onload = (
        evento
      ) => {
        try {

          const texto =
            evento.target.result

          const parser =
            new DOMParser()

          const xml =
            parser.parseFromString(
              texto,
              'text/xml'
            )


          // =========================================
          // VERIFICAR ERRO NO XML
          // =========================================

          const erroXml =
            xml.querySelector(
              'parsererror'
            )

          if (erroXml) {
            throw new Error(
              'Arquivo KML inválido.'
            )
          }


          // =========================================
          // LOCALIZAR PLACEMARKS
          // =========================================

          const placemarks =
            Array.from(
              xml.querySelectorAll(
                'Placemark'
              )
            )

          const unidades = []


          placemarks.forEach(
            (
              placemark,
              index
            ) => {

              // =====================================
              // ACEITAR SOMENTE PONTOS
              // =====================================

              const ponto =
                placemark.querySelector(
                  'Point'
                )

              if (!ponto) {
                return
              }


              // =====================================
              // COORDENADAS
              // =====================================

              const elementoCoordenadas =
                ponto.querySelector(
                  'coordinates'
                )

              if (
                !elementoCoordenadas
              ) {
                return
              }


              const coordenadas =
                elementoCoordenadas
                  .textContent
                  .trim()
                  .split(',')


              if (
                coordenadas.length < 2
              ) {
                return
              }


              const longitude =
                Number(
                  coordenadas[0]
                )

              const latitude =
                Number(
                  coordenadas[1]
                )


              if (
                !Number.isFinite(
                  latitude
                ) ||
                !Number.isFinite(
                  longitude
                )
              ) {
                return
              }


              // =====================================
              // NOME DO PONTO
              //
              // Exemplo:
              // L14 Q500
              // =====================================

              const nome =
                placemark
                  .querySelector(
                    'name'
                  )
                  ?.textContent
                  ?.trim() || ''


              let lote = ''
              let quadra = ''


              const resultadoNome =
                nome.match(
                  /L\s*([^\s]+)\s+Q\s*([^\s]+)/i
                )


              if (resultadoNome) {

                lote =
                  resultadoNome[1]
                    ?.trim() || ''

                quadra =
                  resultadoNome[2]
                    ?.trim() || ''

              }


              // =====================================
              // DESCRIÇÃO
              //
              // Exemplo:
              // A17N070386
              // Matricula (2638-7)
              // =====================================

              const descricao =
                placemark
                  .querySelector(
                    'description'
                  )
                  ?.textContent || ''


              // Remove HTML simples
              const descricaoLimpa =
                descricao
                  .replace(
                    /<br\s*\/?>/gi,
                    ' '
                  )
                  .replace(
                    /&nbsp;/gi,
                    ' '
                  )
                  .replace(
                    /\s+/g,
                    ' '
                  )
                  .trim()


              // =====================================
              // MATRÍCULA
              // =====================================

              let matricula = ''

              const resultadoMatricula =
                descricaoLimpa.match(
                  /matr[ií]cula\s*\(\s*([^)]+)\s*\)/i
                )

              if (
                resultadoMatricula
              ) {
                matricula =
                  resultadoMatricula[1]
                    ?.trim() || ''
              }


              // =====================================
              // HIDRÔMETRO
              //
              // Pega o texto antes de "Matricula"
              // =====================================

              let hidrometro = ''

              const parteAntesMatricula =
                descricaoLimpa
                  .split(
                    /matr[ií]cula/i
                  )[0]
                  ?.trim()


              if (
                parteAntesMatricula
              ) {

                const possivelHidrometro =
                  parteAntesMatricula
                    .split(/\s+/)[0]
                    ?.trim()


                if (
                  possivelHidrometro
                ) {
                  hidrometro =
                    possivelHidrometro
                }
              }


              // =====================================
              // OBJETO PARA O SISTEMA
              // =====================================

              unidades.push({
                idTemporario:
                  `kml-${index}`,

                setor,

                localidade,

                lote,

                quadra,

                hidrometro,

                matricula,

                situacao:
                  'ativa',

                latitude,

                longitude,
              })

            }
          )


          resolve(unidades)

        } catch (error) {

          reject(error)

        }
      }


      leitor.onerror = () => {
        reject(
          new Error(
            'Não foi possível ler o arquivo KML.'
          )
        )
      }


      leitor.readAsText(
        arquivo
      )
    }
  )
}
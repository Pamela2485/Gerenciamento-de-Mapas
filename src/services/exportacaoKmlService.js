// =====================================================
// EXPORTAÇÃO KML - MAPA GERENCIAL
// =====================================================

function escaparXml(valor) {
  return String(
    valor ?? ''
  )
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}


// =====================================================
// GERAR CONTEÚDO KML
// =====================================================

export function gerarKmlUnidades({
  unidades,
  setor,
  localidade,
}) {

  const nomeDocumento =
    localidade
      ? `${setor} - ${localidade}`
      : setor


  const placemarks =
    unidades
      .filter((unidade) => {

        const latitude =
          Number(
            unidade.latitude ??
            unidade.posicao?.[0]
          )

        const longitude =
          Number(
            unidade.longitude ??
            unidade.posicao?.[1]
          )

        return (
          Number.isFinite(latitude) &&
          Number.isFinite(longitude)
        )
      })
      .map((unidade) => {

        const latitude =
          Number(
            unidade.latitude ??
            unidade.posicao?.[0]
          )

        const longitude =
          Number(
            unidade.longitude ??
            unidade.posicao?.[1]
          )


        const hidrometro =
          unidade.hidrometro || ''

        const matricula =
          unidade.matricula || ''

        const quadra =
          unidade.quadra || ''

        const lote =
          unidade.lote || ''

        const situacao =
          unidade.situacao || ''


        const nomePonto =
          hidrometro ||
          matricula ||
          `Unidade ${unidade.id || ''}`


        const descricao = `
          <strong>Hidrômetro:</strong> ${escaparXml(hidrometro)}<br/>
          <strong>Matrícula:</strong> ${escaparXml(matricula)}<br/>
          <strong>Quadra:</strong> ${escaparXml(quadra)}<br/>
          <strong>Lote:</strong> ${escaparXml(lote)}<br/>
          <strong>Situação:</strong> ${escaparXml(situacao)}
        `


        return `
    <Placemark>

      <name>
        ${escaparXml(nomePonto)}
      </name>

      <description>
        <![CDATA[
          ${descricao}
        ]]>
      </description>

      <ExtendedData>

        <Data name="hidrometro">
          <value>
            ${escaparXml(hidrometro)}
          </value>
        </Data>

        <Data name="matricula">
          <value>
            ${escaparXml(matricula)}
          </value>
        </Data>

        <Data name="quadra">
          <value>
            ${escaparXml(quadra)}
          </value>
        </Data>

        <Data name="lote">
          <value>
            ${escaparXml(lote)}
          </value>
        </Data>

        <Data name="situacao">
          <value>
            ${escaparXml(situacao)}
          </value>
        </Data>

      </ExtendedData>

      <Point>
        <coordinates>
          ${longitude},${latitude},0
        </coordinates>
      </Point>

    </Placemark>
        `
      })
      .join('\n')


  return `<?xml version="1.0" encoding="UTF-8"?>

<kml xmlns="http://www.opengis.net/kml/2.2">

  <Document>

    <name>
      ${escaparXml(nomeDocumento)}
    </name>

    ${placemarks}

  </Document>

</kml>`
}


// =====================================================
// BAIXAR ARQUIVO KML
// =====================================================

export function exportarKmlUnidades({
  unidades,
  setor,
  localidade,
}) {

  if (
    !unidades ||
    unidades.length === 0
  ) {

    window.alert(
      'Não existem unidades para exportar.'
    )

    return
  }


  const conteudo =
    gerarKmlUnidades({
      unidades,
      setor,
      localidade,
    })


  const blob =
    new Blob(
      [conteudo],
      {
        type:
          'application/vnd.google-earth.kml+xml;charset=utf-8',
      }
    )


  const url =
    URL.createObjectURL(
      blob
    )


  const link =
    document.createElement(
      'a'
    )


  const nomeLocalidade =
    String(
      localidade ||
      setor ||
      'mapa'
    )
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-zA-Z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )
      .toLowerCase()


  link.href =
    url

  link.download =
    `${nomeLocalidade}-unidades.kml`


  document.body.appendChild(
    link
  )

  link.click()

  document.body.removeChild(
    link
  )


  URL.revokeObjectURL(
    url
  )
}
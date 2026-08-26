import {
  useState,
} from 'react'

import {
  lerArquivoKml,
} from '../../services/kmlService'

import {
  verificarImportacaoKml,
  importarUnidadesKml,
} from '../../services/importacaoKmlService'

import './ImportarKml.css'


function ImportarKml({
  setor,
  localidade,
  onCancelar,
}) {

  // ===================================================
  // ESTADOS
  // ===================================================

  const [
    arquivo,
    setArquivo,
  ] = useState(null)

  const [
    unidadesEncontradas,
    setUnidadesEncontradas,
  ] = useState([])

  const [
    lendo,
    setLendo,
  ] = useState(false)

  const [
    verificando,
    setVerificando,
  ] = useState(false)

  const [
    importando,
    setImportando,
  ] = useState(false)

  const [
    resultadoVerificacao,
    setResultadoVerificacao,
  ] = useState(null)


  // ===================================================
  // ANALISAR KML
  // ===================================================

  async function analisarArquivo() {

    if (!arquivo) {

      window.alert(
        'Selecione um arquivo KML.'
      )

      return
    }


    try {

      setLendo(true)

      setResultadoVerificacao(
        null
      )


      const unidades =
        await lerArquivoKml(
          arquivo,
          setor,
          localidade
        )


      setUnidadesEncontradas(
        unidades
      )


      if (
        unidades.length === 0
      ) {

        window.alert(
          'Nenhum ponto válido foi encontrado no KML.'
        )

      }

    } catch (error) {

      console.error(
        'Erro ao analisar KML:',
        error
      )


      window.alert(
        'Não foi possível analisar o arquivo KML.'
      )

    } finally {

      setLendo(false)

    }
  }


  // ===================================================
  // VERIFICAR DUPLICIDADES
  // ===================================================

  async function verificarPontos() {

    if (
      unidadesEncontradas.length === 0
    ) {

      window.alert(
        'Analise primeiro o arquivo KML.'
      )

      return
    }


    try {

      setVerificando(true)


      const resultado =
        await verificarImportacaoKml({
          unidades:
            unidadesEncontradas,

          setor,

          localidade,
        })


      setResultadoVerificacao(
        resultado
      )


    } catch (error) {

      console.error(
        'Erro ao verificar importação:',
        error
      )


      window.alert(
        'Não foi possível verificar os pontos existentes.'
      )

    } finally {

      setVerificando(false)

    }
  }


  // ===================================================
  // IMPORTAR UNIDADES
  // ===================================================

  async function importarPontos() {

    if (!resultadoVerificacao) {

      window.alert(
        'Verifique os pontos antes de importar.'
      )

      return
    }


    const quantidade =
      resultadoVerificacao
        .novas
        .length


    if (quantidade === 0) {

      window.alert(
        'Não existem pontos novos para importar.'
      )

      return
    }


    const confirmar =
      window.confirm(
        `Deseja importar ${quantidade} pontos para ${setor} — ${localidade}?`
      )


    if (!confirmar) {
      return
    }


    try {

      setImportando(true)


      const resultado =
        await importarUnidadesKml(
          resultadoVerificacao.novas
        )


      window.alert(
        `Importação concluída!\n\n` +
        `Importados: ${resultado.importadas}\n` +
        `Erros: ${resultado.erros}`
      )


      if (
        resultado.importadas > 0
      ) {

        onCancelar()

      }


    } catch (error) {

      console.error(
        'Erro durante a importação:',
        error
      )


      window.alert(
        'Não foi possível concluir a importação.'
      )


    } finally {

      setImportando(false)

    }
  }


  // ===================================================
  // PRIMEIRO PONTO PARA PRÉVIA
  // ===================================================

  const exemplo =
    unidadesEncontradas[0]


  // ===================================================
  // TELA
  // ===================================================

  return (

    <div className="pagina-importar-kml">


      {/* ============================================
          CABEÇALHO
      ============================================ */}

      <div className="cabecalho-importar-kml">

        <span className="titulo-pequeno">
          {setor} — {localidade}
        </span>

        <h2>
          📥 Importar KML
        </h2>

      </div>


      {/* ============================================
          CARD
      ============================================ */}

      <div className="card-importar-kml">

        <label>
          Arquivo KML
        </label>


        <input
          type="file"
          accept=".kml"

          disabled={
            lendo ||
            verificando ||
            importando
          }

          onChange={(e) => {

            const selecionado =
              e.target.files?.[0]


            setArquivo(
              selecionado || null
            )

            setUnidadesEncontradas(
              []
            )

            setResultadoVerificacao(
              null
            )

          }}
        />


        {/* ==========================================
            ANALISAR
        ========================================== */}

        <button
          type="button"

          onClick={
            analisarArquivo
          }

          disabled={
            !arquivo ||
            lendo ||
            verificando ||
            importando
          }
        >

          {lendo
            ? '⏳ Analisando...'
            : '🔎 Analisar arquivo'}

        </button>


        {/* ==========================================
            RESULTADO DA LEITURA
        ========================================== */}

        {unidadesEncontradas.length > 0 && (

          <div className="resultado-kml">

            <h3>
              ✅ Arquivo analisado
            </h3>


            <p>
              <strong>
                Pontos encontrados:
              </strong>{' '}
              {
                unidadesEncontradas.length
              }
            </p>


            {/* ======================================
                EXEMPLO DO PRIMEIRO PONTO
            ====================================== */}

            {exemplo && (

              <div className="exemplo-kml">

                <h4>
                  Exemplo do primeiro ponto
                </h4>


                <p>
                  <strong>
                    Hidrômetro:
                  </strong>{' '}
                  {
                    exemplo.hidrometro ||
                    '-'
                  }
                </p>


                <p>
                  <strong>
                    Matrícula:
                  </strong>{' '}
                  {
                    exemplo.matricula ||
                    '-'
                  }
                </p>


                <p>
                  <strong>
                    Quadra:
                  </strong>{' '}
                  {
                    exemplo.quadra ||
                    '-'
                  }
                </p>


                <p>
                  <strong>
                    Lote:
                  </strong>{' '}
                  {
                    exemplo.lote ||
                    '-'
                  }
                </p>


                <p>
                  <strong>
                    Situação:
                  </strong>{' '}
                  {
                    exemplo.situacao ||
                    'ativa'
                  }
                </p>


                <p>
                  <strong>
                    Latitude:
                  </strong>{' '}
                  {
                    exemplo.latitude
                  }
                </p>


                <p>
                  <strong>
                    Longitude:
                  </strong>{' '}
                  {
                    exemplo.longitude
                  }
                </p>

              </div>

            )}


            {/* ======================================
                VERIFICAR NO SUPABASE
            ====================================== */}

            {!resultadoVerificacao && (

              <button
                type="button"

                onClick={
                  verificarPontos
                }

                disabled={
                  verificando ||
                  importando
                }
              >

                {verificando
                  ? '⏳ Verificando...'
                  : '🔍 Verificar pontos existentes'}

              </button>

            )}


            {/* ======================================
                RESULTADO DA VERIFICAÇÃO
            ====================================== */}

            {resultadoVerificacao && (

              <div className="resumo-importacao-kml">

                <h3>
                  📊 Resultado da verificação
                </h3>


                <p>
                  <strong>
                    Pontos analisados:
                  </strong>{' '}
                  {
                    resultadoVerificacao
                      .total
                  }
                </p>


                <p>
                  <strong>
                    Novos:
                  </strong>{' '}
                  {
                    resultadoVerificacao
                      .novas
                      .length
                  }
                </p>


                <p>
                  <strong>
                    Já existentes:
                  </strong>{' '}
                  {
                    resultadoVerificacao
                      .duplicadas
                      .length
                  }
                </p>


                <div className="botoes-importar-kml">


                  {/* CANCELAR */}

                  <button
                    type="button"

                    disabled={
                      importando
                    }

                    onClick={
                      onCancelar
                    }
                  >
                    Cancelar
                  </button>


                  {/* IMPORTAR */}

                  <button
                    type="button"

                    onClick={
                      importarPontos
                    }

                    disabled={
                      importando ||
                      resultadoVerificacao
                        .novas
                        .length === 0
                    }
                  >

                    {importando
                      ? '⏳ Importando...'
                      : `📥 Importar ${resultadoVerificacao.novas.length} pontos`}

                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  )
}

export default ImportarKml
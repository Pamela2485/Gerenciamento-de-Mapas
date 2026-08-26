import {
  useMemo,
  useState,
} from 'react'

import './Inicio.css'


function Inicio({
  unidades = [],
  onVerMapa,
}) {

  const [
    pesquisa,
    setPesquisa,
  ] = useState('')

  const [
    pesquisou,
    setPesquisou,
  ] = useState(false)


  // ===================================================
  // LOCALIDADES
  // ===================================================

  const localidades = [
    {
      setor: 'SETOR 02',
      localidade: 'TORNEIRO',
    },
    {
      setor: 'SETOR 03',
      localidade: 'ESPLANADA',
    },
    {
      setor: 'SETOR 04',
      localidade: 'JANAÍNA',
    },
    {
      setor: 'SETOR 04',
      localidade: 'COPA 70',
    },
    {
      setor: 'SETOR 05',
      localidade: 'ALBATROZ',
    },
    {
      setor: 'SETOR 05',
      localidade: 'CATARINENSE',
    },
    {
      setor: 'SETOR 05',
      localidade: 'MONTREAL',
    },
    {
      setor: 'SETOR 06',
      localidade: "OLHO D'ÁGUA",
    },
  ]


  // ===================================================
  // RESULTADO DA PESQUISA
  // ===================================================

  const resultado =
    useMemo(() => {

      const termo =
        pesquisa
          .trim()
          .toLowerCase()


      if (!termo) {
        return null
      }


      return (
        unidades.find(
          (unidade) =>
            unidade.hidrometro
              ?.toString()
              .trim()
              .toLowerCase() === termo
        ) || null
      )

    }, [
      pesquisa,
      unidades,
    ])


  // ===================================================
  // PESQUISAR
  // ===================================================

  function pesquisarHidrometro(
    evento
  ) {

    evento.preventDefault()

    if (!pesquisa.trim()) {
      return
    }

    setPesquisou(true)
  }


  // ===================================================
  // RESUMO DAS LOCALIDADES
  // ===================================================

  const resumoLocalidades =
    localidades.map(
      (item) => {

        const unidadesLocalidade =
          unidades.filter(
            (unidade) =>
              unidade.setor ===
                item.setor &&
              unidade.localidade ===
                item.localidade
          )


        const ativas =
          unidadesLocalidade.filter(
            (unidade) =>
              unidade.situacao ===
              'ativa'
          ).length


        const cortadas =
          unidadesLocalidade.filter(
            (unidade) =>
              unidade.situacao ===
              'cortada'
          ).length


        return {
          ...item,

          total:
            unidadesLocalidade.length,

          ativas,

          cortadas,
        }
      }
    )


  return (

    <div className="pagina-inicio">


      {/* ============================================
          CABEÇALHO
      ============================================ */}

      <div className="inicio-cabecalho">

        <h1>
          Gerenciamento de Mapa
        </h1>

        <p>
          Visão geral das localidades
        </p>

      </div>


      {/* ============================================
          PESQUISA
      ============================================ */}

      <form
        className="pesquisa-hidrometro"
        onSubmit={
          pesquisarHidrometro
        }
      >

        <span>
          🔎
        </span>

        <input
          type="text"
          placeholder="Pesquisar hidrômetro..."
          value={
            pesquisa
          }
          onChange={(evento) => {

            setPesquisa(
              evento.target.value
            )

            setPesquisou(false)

          }}
        />

        <button type="submit">
          Pesquisar
        </button>

      </form>


      {/* ============================================
          RESULTADO
      ============================================ */}

      {pesquisou &&
  resultado && (

  <div className="resultado-pesquisa">

    <div className="resultado-titulo">

      <span>
        📍
      </span>

      <strong>
        Unidade encontrada
      </strong>

    </div>


    <div className="resultado-linha-principal">

      <div>
        <span>
          Hidrômetro
        </span>

        <strong>
          {
            resultado.hidrometro ||
            '-'
          }
        </strong>
      </div>


      <div>
        <span>
          Matrícula
        </span>

        <strong>
          {
            resultado.matricula ||
            '-'
          }
        </strong>
      </div>


      <div>
        <span>
          Quadra
        </span>

        <strong>
          {
            resultado.quadra ||
            '-'
          }
        </strong>
      </div>


      <div>
        <span>
          Lote
        </span>

        <strong>
          {
            resultado.lote ||
            '-'
          }
        </strong>
      </div>

    </div>


    <div className="resultado-rodape">

      <div className="resultado-localidade">

        <span>
          Localidade:
        </span>

        <strong>
          {
            resultado.localidade ||
            '-'
          }
        </strong>

      </div>


      <strong
        className={
          resultado.situacao ===
          'cortada'
            ? 'situacao-cortada'
            : 'situacao-ativa'
        }
      >
        {resultado.situacao ===
        'cortada'
          ? '🔴 Cortada'
          : '🟢 Ativa'}
      </strong>


      <button
        type="button"
        className="botao-ver-mapa"
        onClick={() =>
          onVerMapa?.(
            resultado
          )
        }
      >
        📍 Ver no mapa
      </button>

    </div>

  </div>

)}


      {pesquisou &&
        !resultado && (

        <div className="resultado-nao-encontrado">

          Hidrômetro não encontrado.

        </div>

      )}


      {/* ============================================
          CARDS DAS LOCALIDADES
      ============================================ */}

      <div className="titulo-localidades">

        <h2>
          Localidades
        </h2>

      </div>


      <div className="cards-localidades">

        {resumoLocalidades.map(
          (item) => (

            <div
              className="card-localidade"
              key={
                `${item.setor}-${item.localidade}`
              }
            >

              <div className="card-localidade-topo">

                <div>

                  <span className="card-setor">
                    {item.setor}
                  </span>

                  <h3>
                    {item.localidade}
                  </h3>

                </div>

                <span className="icone-localidade">
                  📍
                </span>

              </div>


              <div className="card-numeros">

                <div className="numero-ativa">

                  <span>
                    Ativas
                  </span>

                  <strong>
                    {item.ativas}
                  </strong>

                </div>


                <div className="numero-cortada">

                  <span>
                    Cortadas
                  </span>

                  <strong>
                    {item.cortadas}
                  </strong>

                </div>

              </div>


              <div className="card-total">

                Total de unidades:

                <strong>
                  {' '}
                  {item.total}
                </strong>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  )
}

export default Inicio
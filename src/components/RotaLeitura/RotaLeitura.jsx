import {
  Fragment,
  useEffect,
  useState,
} from 'react'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet'

import L from 'leaflet'

import 'leaflet-polylinedecorator'
import 'leaflet/dist/leaflet.css'

import { supabase } from '../../supabaseClient'

import './RotaLeitura.css'


// =====================================================
// ÍCONE DA ROTA
// =====================================================

function criarIconeRota(
  codigoRota
) {

  const temRota =
    Boolean(
      codigoRota?.trim()
    )


  const cor =
    temRota
      ? '#2563eb'
      : '#facc15'


  return L.divIcon({

    className:
      'icone-rota-leitura',

    html: `
      <div
        style="
          width: 14px;
          height: 14px;
          background: ${cor};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 1px 4px rgba(0,0,0,0.35);
        "
      ></div>
    `,

    iconSize: [
      18,
      18,
    ],

    iconAnchor: [
      9,
      9,
    ],

    popupAnchor: [
      0,
      -8,
    ],

  })
}


// =====================================================
// AJUSTAR MAPA AOS PONTOS
// =====================================================

function AjustarMapaAosPontos({
  unidades,
}) {

  const map =
    useMap()


  useEffect(() => {

    const pontosValidos =
      unidades
        .filter(
          (unidade) =>
            Number.isFinite(
              Number(
                unidade.latitude
              )
            ) &&
            Number.isFinite(
              Number(
                unidade.longitude
              )
            )
        )
        .map(
          (unidade) => [
            Number(
              unidade.latitude
            ),

            Number(
              unidade.longitude
            ),
          ]
        )


    if (
      pontosValidos.length === 0
    ) {
      return
    }


    const timer =
      setTimeout(() => {

        map.invalidateSize()


        if (
          pontosValidos.length === 1
        ) {

          map.setView(
            pontosValidos[0],
            18
          )

          return
        }


        map.fitBounds(
          pontosValidos,
          {
            padding: [
              30,
              30,
            ],

            maxZoom: 18,
          }
        )

      }, 300)


    return () =>
      clearTimeout(
        timer
      )

  }, [
    map,
    unidades,
  ])


  return null
}


// =====================================================
// SETAS DA ROTA
// =====================================================

function SetasRota({
  pontos,
}) {

  const map =
    useMap()


  useEffect(() => {

    if (
      !pontos ||
      pontos.length < 2
    ) {
      return
    }


    const linha =
      L.polyline(
        pontos
      )


    const decorator =
      L.polylineDecorator(
        linha,
        {
          patterns: [
            {
              offset:
                '10%',

              repeat:
                '15%',

              symbol:
                L.Symbol.arrowHead({

                  pixelSize:
                    10,

                  polygon:
                    false,

                  pathOptions: {

                    color:
                      '#000000',

                    weight:
                      3,

                    opacity:
                      1,

                  },

                }),
            },
          ],
        }
      )


    decorator.addTo(
      map
    )


    return () => {

      map.removeLayer(
        decorator
      )

    }

  }, [
    map,
    pontos,
  ])


  return null
}

// =====================================================
// LOCALIZAR UNIDADE PESQUISADA
// =====================================================

function LocalizarUnidadePesquisada({
  unidade,
}) {

  const map = useMap()


  useEffect(() => {

    if (!unidade) {
      return
    }


    const latitude =
      Number(
        unidade.latitude
      )


    const longitude =
      Number(
        unidade.longitude
      )


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return
    }


    map.flyTo(
      [
        latitude,
        longitude,
      ],
      19,
      {
        duration: 0.8,
      }
    )

  }, [
    map,
    unidade,
  ])


  return null
}

// =====================================================
// COMPONENTE
// =====================================================

function RotaLeitura({
  setor,
  localidade,
}) {

  const [
    unidades,
    setUnidades,
  ] = useState([])


  const [
    unidadeEmEdicao,
    setUnidadeEmEdicao,
  ] = useState(null)


  const [
    codigoRota,
    setCodigoRota,
  ] = useState('')


  const [
    salvando,
    setSalvando,
  ] = useState(false)


  const [
    tipoMapa,
    setTipoMapa,
  ] = useState('mapa')

  const [
  pesquisa,
  setPesquisa,
] = useState('')


const [
  unidadePesquisada,
  setUnidadePesquisada,
] = useState(null)


  const centroInicial = [
    -28.6775,
    -49.3697,
  ]


  // ===================================================
  // CARREGAR UNIDADES
  // ===================================================

  useEffect(() => {

    async function carregar() {

      try {

        const {
          data,
          error,
        } = await supabase
          .from(
            'unidades'
          )
          .select(
            `
              id,
              matricula,
              latitude,
              longitude,
              codigo_rota,
              setor,
              localidade
            `
          )
          .eq(
            'setor',
            setor
          )
          .eq(
            'localidade',
            localidade
          )


        if (error) {

          throw error

        }


        setUnidades(
          data || []
        )


      } catch (error) {

        console.error(
          'Erro ao carregar rota de leitura:',
          error
        )

      }
    }


    carregar()

  }, [
    setor,
    localidade,
  ])


  // ===================================================
  // EDITAR CÓDIGO DA ROTA
  // ===================================================

  function editarRota(
    unidade
  ) {

    setUnidadeEmEdicao(
      unidade
    )


    setCodigoRota(
      unidade.codigo_rota ||
      ''
    )

  }


  // ===================================================
  // SALVAR CÓDIGO DA ROTA
  // ===================================================

  async function salvarCodigoRota() {

    if (
      !unidadeEmEdicao
    ) {
      return
    }


    try {

      setSalvando(
        true
      )


      const codigoFinal =
        codigoRota
          .trim()


      const {
        error,
      } = await supabase
        .from(
          'unidades'
        )
        .update({
          codigo_rota:
            codigoFinal ||
            null,
        })
        .eq(
          'id',
          unidadeEmEdicao.id
        )


      if (error) {

        throw error

      }


      setUnidades(
        (anteriores) =>
          anteriores.map(
            (unidade) =>

              unidade.id ===
              unidadeEmEdicao.id

                ? {
                    ...unidade,

                    codigo_rota:
                      codigoFinal,
                  }

                : unidade

          )
      )


      window.alert(
        'Código da rota salvo com sucesso!'
      )


      setUnidadeEmEdicao(
        null
      )


      setCodigoRota(
        ''
      )


    } catch (error) {

      console.error(
        'Erro ao salvar código da rota:',
        error
      )


      window.alert(
        'Não foi possível salvar o código da rota.'
      )


    } finally {

      setSalvando(
        false
      )

    }
  }

  // ===================================================
// PESQUISAR UNIDADE
// ===================================================

function pesquisarUnidade(
  evento
) {

  evento.preventDefault()


  const termo =
    pesquisa
      .trim()
      .toLowerCase()


  if (!termo) {
    return
  }


  const encontrada =
    unidades.find(
      (unidade) => {

        const matricula =
          unidade.matricula
            ?.toString()
            .trim()
            .toLowerCase()


        const rota =
          unidade.codigo_rota
            ?.toString()
            .trim()
            .toLowerCase()


        return (
          matricula === termo ||
          rota === termo
        )
      }
    )


  if (!encontrada) {

    setUnidadePesquisada(null)

    window.alert(
      'Matrícula ou código de rota não encontrado.'
    )

    return
  }


  setUnidadePesquisada(
    encontrada
  )
}

  // ===================================================
  // UNIDADES COM ROTA
  // ===================================================

  const unidadesComRota =
    unidades
      .filter(
        (unidade) =>

          unidade.codigo_rota &&

          Number.isFinite(
            Number(
              unidade.latitude
            )
          ) &&

          Number.isFinite(
            Number(
              unidade.longitude
            )
          )
      )
      .sort(
        (a, b) =>
          a.codigo_rota
            .localeCompare(
              b.codigo_rota,
              undefined,
              {
                numeric: true,
              }
            )
      )


  // ===================================================
  // SEPARAR ROTAS POR RUA
  // ===================================================

  const rotasPorRua =
    unidadesComRota.reduce(
      (
        acumulador,
        unidade
      ) => {

        const partes =
          unidade
            .codigo_rota
            .split('.')


        const rua =
          partes[3] ||
          'sem-rua'


        if (
          !acumulador[rua]
        ) {

          acumulador[rua] =
            []

        }


        acumulador[
          rua
        ].push(
          unidade
        )


        return acumulador

      },
      {}
    )


  const ruasDaRota =
    Object.entries(
      rotasPorRua
    )


  // ===================================================
  // TELA
  // ===================================================

  return (

    <div className="pagina-rota-leitura">


      {/* CABEÇALHO */}

      <div className="cabecalho-rota-leitura">

        <span className="titulo-pequeno">

          {setor}
          {' — '}
          {localidade}

        </span>


        <h2>
          🧭 Rota de Leitura
        </h2>

      </div>

      {/* PESQUISA */}

<form
  className="pesquisa-rota-leitura"
  onSubmit={
    pesquisarUnidade
  }
>

  <span>
    🔎
  </span>

  <input
    type="text"
    placeholder="Pesquisar matrícula ou código da rota..."
    value={
      pesquisa
    }
    onChange={(evento) => {

      setPesquisa(
        evento.target.value
      )

      setUnidadePesquisada(
        null
      )

    }}
  />

  <button
    type="submit"
  >
    Pesquisar
  </button>

</form>


      {/* CONTROLES */}

      <div className="controles-rota-leitura">


        <button
          type="button"

          className={
            tipoMapa ===
            'mapa'
              ? 'ativo'
              : ''
          }

          onClick={() =>
            setTipoMapa(
              'mapa'
            )
          }
        >
          🗺️ Mapa
        </button>


        <button
          type="button"

          className={
            tipoMapa ===
            'satelite'
              ? 'ativo'
              : ''
          }

          onClick={() =>
            setTipoMapa(
              'satelite'
            )
          }
        >
          🛰️ Satélite
        </button>


      </div>


      {/* MAPA */}

      <div className="mapa-rota-leitura">


        <MapContainer
          center={
            centroInicial
          }

          zoom={16}

          scrollWheelZoom={
            true
          }

          style={{
            width:
              '100%',

            height:
              '100%',
          }}
        >


          <AjustarMapaAosPontos
            unidades={
              unidades
            }
          />

          <LocalizarUnidadePesquisada
  unidade={
    unidadePesquisada
  }
/>


          {tipoMapa ===
          'mapa' ? (

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"

              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

          ) : (

            <TileLayer
              attribution="Tiles &copy; Esri"

              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

          )}


          {/* LINHAS E SETAS POR RUA */}

          {ruasDaRota.map(
            (
              [
                rua,
                unidadesRua,
              ]
            ) => {

              const pontosRua =
                unidadesRua.map(
                  (unidade) => [

                    Number(
                      unidade.latitude
                    ),

                    Number(
                      unidade.longitude
                    ),

                  ]
                )


              if (
                pontosRua.length <
                2
              ) {

                return null

              }


              return (

                <Fragment
                  key={
                    rua
                  }
                >


                  <Polyline
                    positions={
                      pontosRua
                    }

                    pathOptions={{
                      color:
                        '#000000',

                      weight:
                        4,

                      opacity:
                        0.9,
                    }}
                  />


                  <SetasRota
                    pontos={
                      pontosRua
                    }
                  />


                </Fragment>

              )
            }
          )}


          {/* MARCADORES */}

          {unidades.map(
            (unidade) => {

              const latitude =
                Number(
                  unidade.latitude
                )


              const longitude =
                Number(
                  unidade.longitude
                )


              if (
                !Number.isFinite(
                  latitude
                ) ||
                !Number.isFinite(
                  longitude
                )
              ) {

                return null

              }


              return (

                <Marker
  key={
    unidade.id
  }

  position={[
    latitude,
    longitude,
  ]}

  icon={
    criarIconeRota(
      unidade.codigo_rota
    )
  }

  ref={(marker) => {

    if (
      marker &&
      unidadePesquisada?.id ===
        unidade.id
    ) {

      setTimeout(() => {

        marker.openPopup()

      }, 850)

    }

  }}
>


                  <Popup>


                    <div className="popup-rota-leitura">


                      <p>

                        <strong>
                          Matrícula:
                        </strong>{' '}

                        {
                          unidade.matricula ||
                          '-'
                        }

                      </p>


                      <p>

                        <strong>
                          Rota:
                        </strong>{' '}

                        {
                          unidade.codigo_rota ||
                          'Não informada'
                        }

                      </p>


                      <button
                        type="button"

                        onClick={() =>
                          editarRota(
                            unidade
                          )
                        }
                      >
                        ✏️ Editar rota
                      </button>


                    </div>


                  </Popup>


                </Marker>

              )
            }
          )}


        </MapContainer>


        {/* FORMULÁRIO */}

        {unidadeEmEdicao && (

          <div className="formulario-rota-leitura">


            <h3>
              ✏️ Editar rota
            </h3>


            <p>

              <strong>
                Matrícula:
              </strong>{' '}

              {
                unidadeEmEdicao
                  .matricula ||
                '-'
              }

            </p>


            <label>
              Código da rota
            </label>


            <input
              type="text"

              placeholder=
                "Ex.: 01.01.0002.001.0010.0001"

              value={
                codigoRota
              }

              onChange={(e) =>
                setCodigoRota(
                  e.target.value
                )
              }
            />


            <div className="botoes-rota-leitura">


              <button
                type="button"

                disabled={
                  salvando
                }

                onClick={() => {

                  setUnidadeEmEdicao(
                    null
                  )

                  setCodigoRota(
                    ''
                  )

                }}
              >
                Cancelar
              </button>


              <button
                type="button"

                disabled={
                  salvando
                }

                onClick={
                  salvarCodigoRota
                }
              >

                {salvando
                  ? 'Salvando...'
                  : '💾 Salvar'}

              </button>


            </div>


          </div>

        )}


      </div>


    </div>
  )
}

export default RotaLeitura
import {
  useEffect,
  useState,
} from 'react'

import {
  MapContainer,
  TileLayer,
  Polyline,
  Popup,
  Marker,
  useMapEvents,
} from 'react-leaflet'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-rotate'

import {
  salvarTrechoRede,
  carregarTrechosRede,
  excluirTrechoRede,
  atualizarTrechoRede,
} from '../../services/redeAguaService'

import {
  carregarRegistrosRede,
  salvarRegistroRede,
  atualizarRegistroRede,
  excluirRegistroRede,
} from '../../services/registrosRedeService'

import {
  carregarPontosRede,
  salvarPontoRede,
  atualizarPontoRede,
  excluirPontoRede,
} from '../../services/pontosRedeService'

import './RedeAgua.css'


// =====================================================
// DESENHAR TRECHO
// =====================================================

function DesenharTrecho({
  ativo,
  onAdicionarPonto,
}) {
  useMapEvents({
    click(evento) {
      if (!ativo) {
        return
      }

      onAdicionarPonto([
        evento.latlng.lat,
        evento.latlng.lng,
      ])
    },
  })

  return null
}


// =====================================================
// POSICIONAR REGISTRO
// =====================================================

function SelecionarPosicaoRegistro({
  ativo,
  onSelecionar,
}) {
  useMapEvents({
    click(evento) {
      if (!ativo) {
        return
      }

      onSelecionar([
        evento.latlng.lat,
        evento.latlng.lng,
      ])
    },
  })

  return null
}


// =====================================================
// POSICIONAR PONTO DA REDE
// =====================================================

function SelecionarPosicaoPontoRede({
  ativo,
  onSelecionar,
}) {
  useMapEvents({
    click(evento) {
      if (!ativo) {
        return
      }

      onSelecionar([
        evento.latlng.lat,
        evento.latlng.lng,
      ])
    },
  })

  return null
}


// =====================================================
// ÍCONES
// =====================================================

const iconePontoTracado = L.divIcon({
  className: 'ponto-tracado-rede',

  html: `
    <div
      style="
        width: 12px;
        height: 12px;
        background: #0b6fa4;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      "
    ></div>
  `,

  iconSize: [16, 16],
  iconAnchor: [8, 8],
})


const iconeRegistro = L.divIcon({
  className: 'icone-registro-rede',

  html: `
    <div
      style="
        width: 18px;
        height: 18px;
        background: #f59e0b;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "
    ></div>
  `,

  iconSize: [24, 24],
  iconAnchor: [12, 12],
})


function criarIconePontoRede(cor) {
  return L.divIcon({
    className: 'icone-ponto-rede',

    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          background: ${cor || '#2563eb'};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.45);
        "
      ></div>
    `,

    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  })
}


// =====================================================
// REDE DE ÁGUA
// =====================================================

function RedeAgua({
  setor,
  localidade,
}) {

  // ===================================================
  // MAPA
  // ===================================================

  const centroInicial = [
    -28.6775,
    -49.3697,
  ]

  const [tipoMapa, setTipoMapa] =
    useState('mapa')


  // ===================================================
  // TRECHOS
  // ===================================================

  const [desenhando, setDesenhando] =
    useState(false)

  const [pontosTrecho, setPontosTrecho] =
    useState([])

  const [
    trechosSalvos,
    setTrechosSalvos,
  ] = useState([])

  const [
    trechoEmEdicao,
    setTrechoEmEdicao,
  ] = useState(null)

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [
    dadosTrecho,
    setDadosTrecho,
  ] = useState({
    diametro: '',
    material: '',
    tipo: 'Distribuição',
    observacao: '',
  })


  // ===================================================
  // REGISTROS
  // ===================================================

  const [registros, setRegistros] =
    useState([])

  const [
    adicionandoRegistro,
    setAdicionandoRegistro,
  ] = useState(false)

  const [
    posicaoNovoRegistro,
    setPosicaoNovoRegistro,
  ] = useState(null)

  const [
    mostrarFormularioRegistro,
    setMostrarFormularioRegistro,
  ] = useState(false)

  const [
    registroEmEdicao,
    setRegistroEmEdicao,
  ] = useState(null)

  const [
    dadosRegistro,
    setDadosRegistro,
  ] = useState({
    diametro: '',
    material: '',
    situacao: 'operacional',
    observacao: '',
  })


  // ===================================================
  // PONTOS TÉCNICOS
  // ===================================================

  const [pontosRede, setPontosRede] =
    useState([])

  const [
    adicionandoPontoRede,
    setAdicionandoPontoRede,
  ] = useState(false)

  const [
    posicaoNovoPontoRede,
    setPosicaoNovoPontoRede,
  ] = useState(null)

  const [
    mostrarFormularioPontoRede,
    setMostrarFormularioPontoRede,
  ] = useState(false)

  const [
    pontoRedeEmEdicao,
    setPontoRedeEmEdicao,
  ] = useState(null)

  const [
    dadosPontoRede,
    setDadosPontoRede,
  ] = useState({
    nome: '',
    diametro: '',
    material: '',
    situacao: 'operacional',
    observacao: '',
    cor: '#2563eb',
  })


  // ===================================================
  // CARREGAR DADOS
  // ===================================================

  useEffect(() => {

    async function carregar() {
      try {

        const [
          trechos,
          listaRegistros,
          listaPontos,
        ] = await Promise.all([
          carregarTrechosRede({
            setor,
            localidade,
          }),

          carregarRegistrosRede({
            setor,
            localidade,
          }),

          carregarPontosRede({
            setor,
            localidade,
          }),
        ])

        setTrechosSalvos(
          trechos
        )

        setRegistros(
          listaRegistros
        )

        setPontosRede(
          listaPontos
        )

      } catch (error) {

        console.error(
          'Erro ao carregar rede:',
          error
        )
      }
    }

    carregar()

  }, [setor, localidade])


  // ===================================================
  // TRECHO - EXCLUIR
  // ===================================================

  async function excluirTrecho(
    trecho
  ) {
    const confirmar =
      window.confirm(
        'Deseja excluir este trecho da rede?\n\n' +
        'Essa ação não pode ser desfeita.'
      )

    if (!confirmar) {
      return
    }

    try {

      await excluirTrechoRede(
        trecho.id
      )

      setTrechosSalvos(
        (anteriores) =>
          anteriores.filter(
            (item) =>
              item.id !== trecho.id
          )
      )

      window.alert(
        'Trecho excluído com sucesso!'
      )

    } catch (error) {

      console.error(
        'Erro ao excluir trecho:',
        error
      )

      window.alert(
        'Não foi possível excluir o trecho.'
      )
    }
  }


  // ===================================================
  // TRECHO - EDITAR DADOS
  // ===================================================

  function iniciarEdicaoTrecho(
    trecho
  ) {
    setTrechoEmEdicao(
      trecho
    )

    setDadosTrecho({
      diametro:
        trecho.diametro || '',

      material:
        trecho.material || '',

      tipo:
        trecho.tipo ||
        'Distribuição',

      observacao:
        trecho.observacao || '',
    })

    setMostrarFormulario(
      true
    )
  }


  // ===================================================
  // TRECHO - EDITAR TRAÇADO
  // ===================================================

  function iniciarEdicaoTracado(
    trecho
  ) {
    setTrechoEmEdicao(
      trecho
    )

    setPontosTrecho(
      trecho.pontos || []
    )

    setDesenhando(
      true
    )

    setMostrarFormulario(
      false
    )
  }


  // ===================================================
  // TRECHO - CANCELAR FORMULÁRIO
  // ===================================================

  function cancelarFormulario() {
    setMostrarFormulario(false)
    setPontosTrecho([])
    setTrechoEmEdicao(null)

    setDadosTrecho({
      diametro: '',
      material: '',
      tipo: 'Distribuição',
      observacao: '',
    })
  }


  // ===================================================
  // TRECHO - SALVAR / ATUALIZAR
  // ===================================================

  async function salvarTrecho() {
    try {

      if (trechoEmEdicao) {

        const trechoAtualizado =
          await atualizarTrechoRede(
            trechoEmEdicao.id,
            dadosTrecho
          )

        setTrechosSalvos(
          (anteriores) =>
            anteriores.map(
              (trecho) =>
                trecho.id ===
                trechoAtualizado.id
                  ? trechoAtualizado
                  : trecho
            )
        )

        window.alert(
          'Trecho atualizado com sucesso!'
        )

      } else {

        const trechoSalvo =
          await salvarTrechoRede({
            setor,
            localidade,
            diametro:
              dadosTrecho.diametro,
            material:
              dadosTrecho.material,
            tipo:
              dadosTrecho.tipo,
            observacao:
              dadosTrecho.observacao,
            pontos:
              pontosTrecho,
          })

        setTrechosSalvos(
          (anteriores) => [
            ...anteriores,
            trechoSalvo,
          ]
        )

        window.alert(
          'Trecho salvo com sucesso!'
        )
      }

      setMostrarFormulario(false)
      setPontosTrecho([])
      setTrechoEmEdicao(null)

      setDadosTrecho({
        diametro: '',
        material: '',
        tipo: 'Distribuição',
        observacao: '',
      })

    } catch (error) {

      console.error(
        'Erro ao salvar trecho:',
        error
      )

      window.alert(
        'Não foi possível salvar o trecho.'
      )
    }
  }


  // ===================================================
  // REGISTRO - EDITAR
  // ===================================================

  function iniciarEdicaoRegistro(
    registro
  ) {
    setRegistroEmEdicao(
      registro
    )

    setPosicaoNovoRegistro([
      registro.latitude,
      registro.longitude,
    ])

    setDadosRegistro({
      diametro:
        registro.diametro || '',

      material:
        registro.material || '',

      situacao:
        registro.situacao ||
        'operacional',

      observacao:
        registro.observacao || '',
    })

    setMostrarFormularioRegistro(
      true
    )
  }


  // ===================================================
  // REGISTRO - EXCLUIR
  // ===================================================

  async function excluirRegistro(
    registro
  ) {
    const confirmar =
      window.confirm(
        'Deseja excluir este registro?\n\n' +
        'Essa ação não pode ser desfeita.'
      )

    if (!confirmar) {
      return
    }

    try {

      await excluirRegistroRede(
        registro.id
      )

      setRegistros(
        (anteriores) =>
          anteriores.filter(
            (item) =>
              item.id !== registro.id
          )
      )

      window.alert(
        'Registro excluído com sucesso!'
      )

    } catch (error) {

      console.error(
        'Erro ao excluir registro:',
        error
      )

      window.alert(
        'Não foi possível excluir o registro.'
      )
    }
  }


  // ===================================================
  // REGISTRO - SALVAR / ATUALIZAR
  // ===================================================

  async function salvarRegistro() {
    if (!posicaoNovoRegistro) {
      return
    }

    try {

      if (registroEmEdicao) {

        const registroAtualizado =
          await atualizarRegistroRede(
            registroEmEdicao.id,
            {
              latitude:
                posicaoNovoRegistro[0],

              longitude:
                posicaoNovoRegistro[1],

              diametro:
                dadosRegistro.diametro,

              material:
                dadosRegistro.material,

              situacao:
                dadosRegistro.situacao,

              observacao:
                dadosRegistro.observacao,
            }
          )

        setRegistros(
          (anteriores) =>
            anteriores.map(
              (registro) =>
                registro.id ===
                registroAtualizado.id
                  ? registroAtualizado
                  : registro
            )
        )

        window.alert(
          'Registro atualizado com sucesso!'
        )

      } else {

        const registroSalvo =
          await salvarRegistroRede({
            setor,
            localidade,

            latitude:
              posicaoNovoRegistro[0],

            longitude:
              posicaoNovoRegistro[1],

            diametro:
              dadosRegistro.diametro,

            material:
              dadosRegistro.material,

            situacao:
              dadosRegistro.situacao,

            observacao:
              dadosRegistro.observacao,
          })

        setRegistros(
          (anteriores) => [
            ...anteriores,
            registroSalvo,
          ]
        )

        window.alert(
          'Registro salvo com sucesso!'
        )
      }

      setMostrarFormularioRegistro(false)
      setAdicionandoRegistro(false)
      setPosicaoNovoRegistro(null)
      setRegistroEmEdicao(null)

      setDadosRegistro({
        diametro: '',
        material: '',
        situacao: 'operacional',
        observacao: '',
      })

    } catch (error) {

      console.error(
        'Erro ao salvar registro:',
        error
      )

      window.alert(
        'Não foi possível salvar o registro.'
      )
    }
  }


  // ===================================================
  // PONTO - EDITAR
  // ===================================================

  function iniciarEdicaoPontoRede(
    ponto
  ) {
    setPontoRedeEmEdicao(
      ponto
    )

    setPosicaoNovoPontoRede([
      ponto.latitude,
      ponto.longitude,
    ])

    setDadosPontoRede({
      nome:
        ponto.nome || '',

      diametro:
        ponto.diametro || '',

      material:
        ponto.material || '',

      situacao:
        ponto.situacao ||
        'operacional',

      observacao:
        ponto.observacao || '',

      cor:
        ponto.cor ||
        '#2563eb',
    })

    setAdicionandoPontoRede(
      false
    )

    setMostrarFormularioPontoRede(
      true
    )
  }


  // ===================================================
  // PONTO - EXCLUIR
  // ===================================================

  async function excluirPonto(
    ponto
  ) {
    const confirmar =
      window.confirm(
        `Deseja excluir o ponto "${ponto.nome}"?\n\n` +
        'Essa ação não pode ser desfeita.'
      )

    if (!confirmar) {
      return
    }

    try {

      await excluirPontoRede(
        ponto.id
      )

      setPontosRede(
        (anteriores) =>
          anteriores.filter(
            (item) =>
              item.id !== ponto.id
          )
      )

      window.alert(
        'Ponto excluído com sucesso!'
      )

    } catch (error) {

      console.error(
        'Erro ao excluir ponto:',
        error
      )

      window.alert(
        'Não foi possível excluir o ponto.'
      )
    }
  }


  // ===================================================
  // PONTO - CANCELAR
  // ===================================================

  function cancelarPontoRede() {
    setMostrarFormularioPontoRede(
      false
    )

    setAdicionandoPontoRede(
      false
    )

    setPosicaoNovoPontoRede(
      null
    )

    setPontoRedeEmEdicao(
      null
    )

    setDadosPontoRede({
      nome: '',
      diametro: '',
      material: '',
      situacao: 'operacional',
      observacao: '',
      cor: '#2563eb',
    })
  }


  // ===================================================
  // PONTO - SALVAR / ATUALIZAR
  // ===================================================

  async function salvarPonto() {

    if (!posicaoNovoPontoRede) {
      window.alert(
        'Posicione o ponto no mapa.'
      )

      return
    }

    if (
      !dadosPontoRede.nome.trim()
    ) {
      window.alert(
        'Informe o nome do ponto.'
      )

      return
    }

    try {

      if (pontoRedeEmEdicao) {

        const pontoAtualizado =
          await atualizarPontoRede(
            pontoRedeEmEdicao.id,
            {
              nome:
                dadosPontoRede.nome,

              latitude:
                posicaoNovoPontoRede[0],

              longitude:
                posicaoNovoPontoRede[1],

              diametro:
                dadosPontoRede.diametro,

              material:
                dadosPontoRede.material,

              situacao:
                dadosPontoRede.situacao,

              observacao:
                dadosPontoRede.observacao,

              cor:
                dadosPontoRede.cor,
            }
          )

        setPontosRede(
          (anteriores) =>
            anteriores.map(
              (ponto) =>
                ponto.id ===
                pontoAtualizado.id
                  ? pontoAtualizado
                  : ponto
            )
        )

        window.alert(
          'Ponto atualizado com sucesso!'
        )

      } else {

        const pontoSalvo =
          await salvarPontoRede({
            setor,
            localidade,

            nome:
              dadosPontoRede.nome,

            latitude:
              posicaoNovoPontoRede[0],

            longitude:
              posicaoNovoPontoRede[1],

            diametro:
              dadosPontoRede.diametro,

            material:
              dadosPontoRede.material,

            situacao:
              dadosPontoRede.situacao,

            observacao:
              dadosPontoRede.observacao,

            cor:
              dadosPontoRede.cor,
          })

        setPontosRede(
          (anteriores) => [
            ...anteriores,
            pontoSalvo,
          ]
        )

        window.alert(
          'Ponto salvo com sucesso!'
        )
      }

      cancelarPontoRede()

    } catch (error) {

      console.error(
        'Erro ao salvar ponto:',
        error
      )

      window.alert(
        'Não foi possível salvar o ponto.'
      )
    }
  }


  // ===================================================
  // TELA
  // ===================================================

  return (
    <div className="pagina-rede-agua">

      {/* =============================================
          CABEÇALHO
      ============================================= */}

      <div className="cabecalho-rede-agua">

        <span className="titulo-pequeno">
          {setor} — {localidade}
        </span>

        <h2>
          💧 Rede de Água
        </h2>

      </div>


      {/* =============================================
          CONTROLES
      ============================================= */}

      <div className="controles-rede">

        <div className="controle-camadas-rede">

          <button
            type="button"
            className={
              tipoMapa === 'mapa'
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setTipoMapa('mapa')
            }
          >
            🗺️ Mapa
          </button>

          <button
            type="button"
            className={
              tipoMapa === 'satelite'
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setTipoMapa('satelite')
            }
          >
            🛰️ Satélite
          </button>

        </div>


        {/* NOVO TRECHO */}

        {!desenhando &&
          !mostrarFormulario &&
          !adicionandoRegistro &&
          !adicionandoPontoRede &&
          !mostrarFormularioRegistro &&
          !mostrarFormularioPontoRede && (

          <button
            type="button"
            onClick={() => {
              setTrechoEmEdicao(null)
              setPontosTrecho([])
              setDesenhando(true)
            }}
          >
            ➕ Novo trecho
          </button>

        )}


        {/* NOVO REGISTRO */}

        {!desenhando &&
          !mostrarFormulario &&
          !adicionandoRegistro &&
          !adicionandoPontoRede &&
          !mostrarFormularioRegistro &&
          !mostrarFormularioPontoRede && (

          <button
            type="button"
            onClick={() => {
              setRegistroEmEdicao(null)
              setAdicionandoRegistro(true)
              setPosicaoNovoRegistro(null)
            }}
          >
            🔧 Novo registro
          </button>

        )}


        {/* NOVO PONTO */}

        {!desenhando &&
          !mostrarFormulario &&
          !adicionandoRegistro &&
          !adicionandoPontoRede &&
          !mostrarFormularioRegistro &&
          !mostrarFormularioPontoRede && (

          <button
            type="button"
            onClick={() => {
              setPontoRedeEmEdicao(null)

              setDadosPontoRede({
                nome: '',
                diametro: '',
                material: '',
                situacao: 'operacional',
                observacao: '',
                cor: '#2563eb',
              })

              setPosicaoNovoPontoRede(
                null
              )

              setAdicionandoPontoRede(
                true
              )
            }}
          >
            📍 Novo ponto
          </button>

        )}


        {/* AVISO REGISTRO */}

        {adicionandoRegistro && (
          <div className="aviso-registro">
            📍 Toque no mapa para posicionar o registro.
          </div>
        )}


        {/* AVISO PONTO */}

        {adicionandoPontoRede && (
          <div className="aviso-registro">
            📍 Toque no mapa para posicionar o ponto.
          </div>
        )}


        {/* ===========================================
            DESENHO / EDIÇÃO DO TRAÇADO
        =========================================== */}

        {desenhando && (
          <>

            <button
              type="button"
              onClick={() =>
                setPontosTrecho(
                  (anteriores) =>
                    anteriores.slice(
                      0,
                      -1
                    )
                )
              }
              disabled={
                pontosTrecho.length === 0
              }
            >
              ↩️ Desfazer ponto
            </button>


            {trechoEmEdicao ? (
              <>

                <button
                  type="button"
                  onClick={() => {
                    setPontosTrecho([])
                    setTrechoEmEdicao(null)
                    setDesenhando(false)
                  }}
                >
                  ❌ Cancelar edição
                </button>


                <button
                  type="button"
                  onClick={async () => {

                    if (
                      pontosTrecho.length < 2
                    ) {
                      window.alert(
                        'O trecho precisa ter pelo menos dois pontos.'
                      )

                      return
                    }

                    try {

                      const trechoAtualizado =
                        await atualizarTrechoRede(
                          trechoEmEdicao.id,
                          {
                            diametro:
                              trechoEmEdicao.diametro,

                            material:
                              trechoEmEdicao.material,

                            tipo:
                              trechoEmEdicao.tipo,

                            observacao:
                              trechoEmEdicao.observacao,

                            pontos:
                              pontosTrecho,
                          }
                        )

                      setTrechosSalvos(
                        (anteriores) =>
                          anteriores.map(
                            (trecho) =>
                              trecho.id ===
                              trechoAtualizado.id
                                ? trechoAtualizado
                                : trecho
                          )
                      )

                      setPontosTrecho([])
                      setTrechoEmEdicao(null)
                      setDesenhando(false)

                      window.alert(
                        'Traçado atualizado com sucesso!'
                      )

                    } catch (error) {

                      console.error(
                        'Erro ao atualizar traçado:',
                        error
                      )

                      window.alert(
                        'Não foi possível atualizar o traçado.'
                      )
                    }
                  }}
                >
                  💾 Salvar traçado
                </button>

              </>
            ) : (
              <>

                <button
                  type="button"
                  onClick={() =>
                    setPontosTrecho([])
                  }
                  disabled={
                    pontosTrecho.length === 0
                  }
                >
                  🗑️ Excluir trecho
                </button>


                <button
                  type="button"
                  onClick={() => {

                    if (
                      pontosTrecho.length < 2
                    ) {
                      window.alert(
                        'Marque pelo menos dois pontos para finalizar o trecho.'
                      )

                      return
                    }

                    setDesenhando(false)
                    setMostrarFormulario(true)
                  }}
                >
                  ✓ Finalizar trecho
                </button>

              </>
            )}

          </>
        )}


        {/* ===========================================
            FORMULÁRIO DO TRECHO
        =========================================== */}

        {mostrarFormulario && (

          <div className="formulario-trecho">

            <h3>
              {trechoEmEdicao
                ? '✏️ Editar trecho'
                : '💧 Dados do trecho'}
            </h3>


            <div className="campo-trecho">
              <label>
                Diâmetro
              </label>

              <input
                type="text"
                placeholder="Ex.: 60 mm"
                value={
                  dadosTrecho.diametro
                }
                onChange={(e) =>
                  setDadosTrecho(
                    (anterior) => ({
                      ...anterior,
                      diametro:
                        e.target.value,
                    })
                  )
                }
              />
            </div>


            <div className="campo-trecho">
              <label>
                Material
              </label>

              <select
                value={
                  dadosTrecho.material
                }
                onChange={(e) =>
                  setDadosTrecho(
                    (anterior) => ({
                      ...anterior,
                      material:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="">
                  Selecione
                </option>
                <option value="PVC">
                  PVC
                </option>
                <option value="PEAD">
                  PEAD
                </option>
                <option value="Ferro Fundido">
                  Ferro Fundido
                </option>
                <option value="Outro">
                  Outro
                </option>
              </select>
            </div>


            <div className="campo-trecho">
              <label>
                Tipo
              </label>

              <select
                value={
                  dadosTrecho.tipo
                }
                onChange={(e) =>
                  setDadosTrecho(
                    (anterior) => ({
                      ...anterior,
                      tipo:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="Distribuição">
                  Distribuição
                </option>
                <option value="Adutora">
                  Adutora
                </option>
                <option value="Ramal">
                  Ramal
                </option>
              </select>
            </div>


            <div className="campo-trecho">
              <label>
                Observação
              </label>

              <textarea
                rows="2"
                placeholder="Informações sobre o trecho..."
                value={
                  dadosTrecho.observacao
                }
                onChange={(e) =>
                  setDadosTrecho(
                    (anterior) => ({
                      ...anterior,
                      observacao:
                        e.target.value,
                    })
                  )
                }
              />
            </div>


            <div className="botoes-trecho">

              <button
                type="button"
                onClick={
                  cancelarFormulario
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  salvarTrecho
                }
              >
                {trechoEmEdicao
                  ? '💾 Salvar alterações'
                  : '💾 Salvar trecho'}
              </button>

            </div>

          </div>
        )}


        {/* ===========================================
            FORMULÁRIO DO REGISTRO
        =========================================== */}

        {mostrarFormularioRegistro &&
          posicaoNovoRegistro && (

          <div className="formulario-registro">

            <h3>
              {registroEmEdicao
                ? '✏️ Editar registro'
                : '🔧 Novo registro'}
            </h3>

            <div className="campo-registro">
              <label>Diâmetro</label>

              <input
                type="text"
                placeholder="Ex.: 60 mm"
                value={
                  dadosRegistro.diametro
                }
                onChange={(e) =>
                  setDadosRegistro(
                    (anterior) => ({
                      ...anterior,
                      diametro:
                        e.target.value,
                    })
                  )
                }
              />
            </div>


            <div className="campo-registro">
              <label>Material</label>

              <select
                value={
                  dadosRegistro.material
                }
                onChange={(e) =>
                  setDadosRegistro(
                    (anterior) => ({
                      ...anterior,
                      material:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="">
                  Selecione
                </option>
                <option value="PVC">
                  PVC
                </option>
                <option value="PEAD">
                  PEAD
                </option>
                <option value="Ferro Fundido">
                  Ferro Fundido
                </option>
                <option value="Outro">
                  Outro
                </option>
              </select>
            </div>


            <div className="campo-registro">
              <label>Situação</label>

              <select
                value={
                  dadosRegistro.situacao
                }
                onChange={(e) =>
                  setDadosRegistro(
                    (anterior) => ({
                      ...anterior,
                      situacao:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="operacional">
                  Operacional
                </option>
                <option value="fechado">
                  Fechado
                </option>
                <option value="travado">
                  Travado
                </option>
              </select>
            </div>


            <div className="campo-registro">
              <label>Observação</label>

              <textarea
                rows="2"
                placeholder="Informações sobre o registro..."
                value={
                  dadosRegistro.observacao
                }
                onChange={(e) =>
                  setDadosRegistro(
                    (anterior) => ({
                      ...anterior,
                      observacao:
                        e.target.value,
                    })
                  )
                }
              />
            </div>


            <div className="botoes-registro">

              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioRegistro(false)
                  setAdicionandoRegistro(false)
                  setPosicaoNovoRegistro(null)
                  setRegistroEmEdicao(null)

                  setDadosRegistro({
                    diametro: '',
                    material: '',
                    situacao: 'operacional',
                    observacao: '',
                  })
                }}
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  salvarRegistro
                }
              >
                {registroEmEdicao
                  ? '💾 Salvar alterações'
                  : '💾 Salvar registro'}
              </button>

            </div>

          </div>
        )}

      </div>


      {/* =============================================
          MAPA
      ============================================= */}

      <div className="mapa-rede-agua">

        <MapContainer
          center={centroInicial}
          zoom={16}
          rotate={false}
          touchRotate={false}
          bearing={0}
          scrollWheelZoom={true}
          style={{
            width: '100%',
            height: '100%',
          }}
        >

          {/* CAMADA */}

          {tipoMapa === 'mapa' ? (

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


          {/* =========================================
              SELEÇÃO DE POSIÇÃO
          ========================================= */}

          <SelecionarPosicaoRegistro
            ativo={adicionandoRegistro}
            onSelecionar={(posicao) => {

              setPosicaoNovoRegistro(
                posicao
              )

              setAdicionandoRegistro(
                false
              )

              setMostrarFormularioRegistro(
                true
              )
            }}
          />


          <SelecionarPosicaoPontoRede
            ativo={adicionandoPontoRede}
            onSelecionar={(posicao) => {

              setPosicaoNovoPontoRede(
                posicao
              )

              setAdicionandoPontoRede(
                false
              )

              setMostrarFormularioPontoRede(
                true
              )
            }}
          />


          {/* =========================================
              REGISTROS
          ========================================= */}

          {registros.map(
            (registro) => (

              <Marker
                key={
                  `registro-${registro.id}`
                }
                position={[
                  registro.latitude,
                  registro.longitude,
                ]}
                icon={iconeRegistro}
              >

                <Popup className="popup-registro-rede">

                  <div className="conteudo-popup-registro">

                    <h3>
                      🔧 Registro
                    </h3>

                    <p>
                      <strong>
                        Diâmetro:
                      </strong>{' '}
                      {registro.diametro ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Material:
                      </strong>{' '}
                      {registro.material ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Situação:
                      </strong>{' '}
                      {registro.situacao ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Observação:
                      </strong>{' '}
                      {registro.observacao ||
                        '-'}
                    </p>


                    <div className="botoes-popup-registro">

                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicaoRegistro(
                            registro
                          )
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          excluirRegistro(
                            registro
                          )
                        }
                      >
                        🗑️ Excluir
                      </button>

                    </div>

                  </div>

                </Popup>

              </Marker>
            )
          )}


          {/* REGISTRO TEMPORÁRIO */}

          {posicaoNovoRegistro &&
            mostrarFormularioRegistro &&
            !registroEmEdicao && (

            <Marker
              position={
                posicaoNovoRegistro
              }
              icon={iconeRegistro}
            />

          )}


          {/* =========================================
              PONTOS TÉCNICOS SALVOS
          ========================================= */}

          {pontosRede.map(
            (ponto) => (

              <Marker
                key={
                  `ponto-${ponto.id}`
                }
                position={[
                  ponto.latitude,
                  ponto.longitude,
                ]}
                icon={
                  criarIconePontoRede(
                    ponto.cor
                  )
                }
              >

                <Popup
                  className="popup-ponto-rede"
                >

                  <div className="conteudo-popup-ponto">

                    <h3>
                      📍 {ponto.nome}
                    </h3>

                    <p>
                      <strong>
                        Diâmetro:
                      </strong>{' '}
                      {ponto.diametro ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Material:
                      </strong>{' '}
                      {ponto.material ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Situação:
                      </strong>{' '}
                      {ponto.situacao ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Observação:
                      </strong>{' '}
                      {ponto.observacao ||
                        '-'}
                    </p>


                    <div className="botoes-popup-ponto">

                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicaoPontoRede(
                            ponto
                          )
                        }
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          excluirPonto(
                            ponto
                          )
                        }
                      >
                        🗑️ Excluir
                      </button>

                    </div>

                  </div>

                </Popup>

              </Marker>
            )
          )}


          {/* PONTO TEMPORÁRIO */}

          {posicaoNovoPontoRede &&
            mostrarFormularioPontoRede &&
            !pontoRedeEmEdicao && (

            <Marker
              position={
                posicaoNovoPontoRede
              }
              icon={
                criarIconePontoRede(
                  dadosPontoRede.cor
                )
              }
            />

          )}


          {/* =========================================
              DESENHO DO TRECHO
          ========================================= */}

          <DesenharTrecho
            ativo={desenhando}
            onAdicionarPonto={
              (ponto) =>
                setPontosTrecho(
                  (anteriores) => [
                    ...anteriores,
                    ponto,
                  ]
                )
            }
          />


          {/* =========================================
              TRECHOS SALVOS
          ========================================= */}

          {trechosSalvos.map(
            (trecho) => (

              <Polyline
                key={trecho.id}
                positions={
                  trecho.pontos
                }
                pathOptions={{
                  weight: 5,
                }}
              >

                <Popup
                  className="popup-rede-agua"
                >

                  <div className="conteudo-popup-rede">

                    <h3>
                      💧 Dados do trecho
                    </h3>

                    <p>
                      <strong>
                        Diâmetro:
                      </strong>{' '}
                      {trecho.diametro ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Material:
                      </strong>{' '}
                      {trecho.material ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Tipo:
                      </strong>{' '}
                      {trecho.tipo ||
                        '-'}
                    </p>

                    <p>
                      <strong>
                        Observação:
                      </strong>{' '}
                      {trecho.observacao ||
                        '-'}
                    </p>


                    <div className="botoes-popup-rede">

                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicaoTrecho(
                            trecho
                          )
                        }
                      >
                        ✏️ Dados
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          iniciarEdicaoTracado(
                            trecho
                          )
                        }
                      >
                        📍 Traçado
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          excluirTrecho(
                            trecho
                          )
                        }
                      >
                        🗑️ Excluir
                      </button>

                    </div>

                  </div>

                </Popup>

              </Polyline>
            )
          )}


          {/* TRECHO EM DESENHO */}

          {pontosTrecho.length >= 2 && (

            <Polyline
              positions={
                pontosTrecho
              }
              pathOptions={{
                weight: 5,
              }}
            />

          )}


          {/* PONTOS ARRASTÁVEIS DO TRAÇADO */}

          {trechoEmEdicao &&
            desenhando &&
            pontosTrecho.map(
              (ponto, index) => (

                <Marker
                  key={
                    `${index}-${ponto[0]}-${ponto[1]}`
                  }
                  position={ponto}
                  icon={
                    iconePontoTracado
                  }
                  draggable={true}
                  eventHandlers={{
                    dragend:
                      (evento) => {

                        const novaPosicao =
                          evento.target
                            .getLatLng()

                        setPontosTrecho(
                          (anteriores) =>
                            anteriores.map(
                              (item, i) =>
                                i === index
                                  ? [
                                      novaPosicao.lat,
                                      novaPosicao.lng,
                                    ]
                                  : item
                            )
                        )
                      },
                  }}
                />

              )
            )}

        </MapContainer>


        {/* ============================================
            FORMULÁRIO FLUTUANTE DO PONTO
        ============================================ */}

        {mostrarFormularioPontoRede &&
          posicaoNovoPontoRede && (

          <div className="formulario-ponto-rede formulario-ponto-flutuante">

            <h3>
              {pontoRedeEmEdicao
                ? '✏️ Editar ponto'
                : '📍 Novo ponto da rede'}
            </h3>


            <div className="campo-ponto-rede">

              <label>
                Nome
              </label>

              <input
                type="text"
                placeholder="Ex.: Booster, Descarte, Adutora..."
                value={
                  dadosPontoRede.nome
                }
                onChange={(e) =>
                  setDadosPontoRede(
                    (anterior) => ({
                      ...anterior,
                      nome:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="campo-ponto-rede">

              <label>
                Diâmetro
              </label>

              <input
                type="text"
                placeholder="Ex.: 100 mm"
                value={
                  dadosPontoRede.diametro
                }
                onChange={(e) =>
                  setDadosPontoRede(
                    (anterior) => ({
                      ...anterior,
                      diametro:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="campo-ponto-rede">

              <label>
                Material
              </label>

              <select
                value={
                  dadosPontoRede.material
                }
                onChange={(e) =>
                  setDadosPontoRede(
                    (anterior) => ({
                      ...anterior,
                      material:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="">
                  Selecione
                </option>
                <option value="PVC">
                  PVC
                </option>
                <option value="PEAD">
                  PEAD
                </option>
                <option value="Ferro Fundido">
                  Ferro Fundido
                </option>
                <option value="Outro">
                  Outro
                </option>
              </select>

            </div>


            <div className="campo-ponto-rede">

              <label>
                Situação
              </label>

              <select
                value={
                  dadosPontoRede.situacao
                }
                onChange={(e) =>
                  setDadosPontoRede(
                    (anterior) => ({
                      ...anterior,
                      situacao:
                        e.target.value,
                    })
                  )
                }
              >
                <option value="operacional">
                  Operacional
                </option>

                <option value="fechado">
                  Fechado
                </option>

                <option value="inativo">
                  Inativo
                </option>

                <option value="manutencao">
                  Em manutenção
                </option>
              </select>

            </div>


            <div className="campo-ponto-rede">

              <label>
                Observação
              </label>

              <textarea
                rows="2"
                placeholder="Informações sobre o ponto..."
                value={
                  dadosPontoRede.observacao
                }
                onChange={(e) =>
                  setDadosPontoRede(
                    (anterior) => ({
                      ...anterior,
                      observacao:
                        e.target.value,
                    })
                  )
                }
              />

            </div>


            <div className="campo-ponto-rede">

              <label>
                Cor do ponto
              </label>

              <div className="cores-ponto-rede">

                {[
                  '#2563eb',
                  '#dc2626',
                  '#16a34a',
                  '#f59e0b',
                  '#7c3aed',
                  '#111827',
                ].map((cor) => (

                  <button
                    key={cor}
                    type="button"
                    aria-label={
                      `Selecionar cor ${cor}`
                    }
                    onClick={() =>
                      setDadosPontoRede(
                        (anterior) => ({
                          ...anterior,
                          cor,
                        })
                      )
                    }
                    style={{
                      width: '28px',
                      height: '28px',
                      padding: 0,
                      borderRadius: '50%',
                      background: cor,

                      border:
                        dadosPontoRede.cor === cor
                          ? '3px solid white'
                          : '2px solid #d1d5db',

                      boxShadow:
                        dadosPontoRede.cor === cor
                          ? '0 0 0 2px #0b6fa4'
                          : 'none',

                      cursor: 'pointer',
                    }}
                  />

                ))}

              </div>

            </div>


            <div className="botoes-ponto-rede">

              <button
                type="button"
                onClick={
                  cancelarPontoRede
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  salvarPonto
                }
              >
                {pontoRedeEmEdicao
                  ? '💾 Salvar alterações'
                  : '💾 Salvar ponto'}
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  )
}

export default RedeAgua
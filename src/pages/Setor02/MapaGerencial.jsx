import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import '../../components/MapaGerencial/MapaGerencial.css'

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'

import 'leaflet-rotate'

import 'leaflet/dist/leaflet.css'

import criarIconeUnidade from '../../components/Mapas/MarcadorUnidade'
import CentralizarMapa from '../../components/Mapas/CentralizarMapa'
import PopupUnidade from '../../components/Unidades/PopupUnidade'
import AjustarLocalizacao from '../../components/Unidades/AjustarLocalizacao'
import { supabase } from '../../supabaseClient'

import {
  exportarKmlUnidades,
} from '../../services/exportacaoKmlService'

function AtivarRotacaoMapa() {
  const map = useMap()

  useEffect(() => {
    if (!map) {
      return
    }

    if (map.touchRotate) {
      map.touchRotate.enable()
    }
  }, [map])

  return null
}

function LocalizarPesquisa({
  unidade,
  marcadoresRef,
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


    const timer =
      setTimeout(() => {

        const marcador =
          marcadoresRef.current[
            unidade.id
          ]


        if (marcador) {
          marcador.openPopup()
        }

      }, 850)


    return () =>
      clearTimeout(timer)

  }, [
    unidade,
    map,
    marcadoresRef,
  ])


  return null
}

function MemorizarPosicaoMapa({ chave }) {
  const map = useMap()

  useEffect(() => {
    const salvarPosicao = () => {
      const centro = map.getCenter()
      const zoom = map.getZoom()

      sessionStorage.setItem(
        chave,
        JSON.stringify({
          lat: centro.lat,
          lng: centro.lng,
          zoom,
        })
      )
    }

    map.on('moveend', salvarPosicao)
    map.on('zoomend', salvarPosicao)

    return () => {
      map.off('moveend', salvarPosicao)
      map.off('zoomend', salvarPosicao)
    }
  }, [map, chave])

  return null
}

function MapaGerencial({
  setor = 'SETOR 02',
  nomeSetor = '',
  localidade = '',
  unidades = [],
  fotosUnidades = [],
  alterarSituacao,
  excluirUnidade,
}) {

    const [unidadeEmAjuste, setUnidadeEmAjuste] =
  useState(null)

const [novaPosicao, setNovaPosicao] =
  useState(null)

const [salvandoLocalizacao, setSalvandoLocalizacao] =
  useState(false)

    const [fotoAmpliada, setFotoAmpliada] =
  useState(null)

  const [modoMapa, setModoMapa] =
    useState('mapa')

  const [pesquisa, setPesquisa] =
    useState('')

  const marcadoresRef =
    useRef({})

const unidadesDoSetor =
  unidades.filter((unidade) => {

    const mesmoSetor =
      unidade.setor === setor

    const mesmaLocalidade =
      !localidade ||
      unidade.localidade === localidade

    return (
      mesmoSetor &&
      mesmaLocalidade
    )
  })

  const unidadesAtivas =
    unidadesDoSetor.filter(
      (unidade) =>
        unidade.situacao === 'ativa'
    ).length

  const unidadesCortadas =
    unidadesDoSetor.filter(
      (unidade) =>
        unidade.situacao === 'cortada'
    ).length

  const unidadesLigadas =
    unidadesAtivas +
    unidadesCortadas

const unidadesPesquisadas =
  useMemo(() => {

    const termo =
      pesquisa
        .trim()
        .toLowerCase()

    if (!termo) {
      return unidadesDoSetor
    }

    const correspondencia =
      termo.match(
        /^l\s*(\S+)\s+q\s*(\S+)$/
      ) ||
      termo.match(
        /^l\s*(\S+)q\s*(\S+)$/
      )

    if (correspondencia) {

      const lotePesquisado =
        correspondencia[1]
          .trim()

      const quadraPesquisada =
        correspondencia[2]
          .trim()

      return unidadesDoSetor.filter(
        (unidade) => {

          const lote =
            String(
              unidade.lote ?? ''
            )
              .trim()
              .toLowerCase()

          const quadra =
            String(
              unidade.quadra ?? ''
            )
              .trim()
              .toLowerCase()

          return (
            lote === lotePesquisado &&
            quadra === quadraPesquisada
          )
        }
      )
    }

    return unidadesDoSetor.filter(
      (unidade) => {

        return [
          unidade.id,
          unidade.numero,
          unidade.setor,
          unidade.hidrometro,
          unidade.matricula,
        ]
          .filter(
            (valor) =>
              valor !== null &&
              valor !== undefined
          )
          .map((valor) =>
            String(valor)
              .trim()
              .toLowerCase()
          )
          .some((valor) =>
            valor.includes(termo)
          )
      }
    )

  }, [
    pesquisa,
    unidadesDoSetor,
  ])

  function iniciarAjusteLocalizacao(unidade) {
  setUnidadeEmAjuste(unidade)

  setNovaPosicao(
    unidade.posicao
  )

  const marcador =
    marcadoresRef.current[
      unidade.id
    ]

  if (marcador) {
    marcador.closePopup()
  }
}

function cancelarAjusteLocalizacao() {
  setUnidadeEmAjuste(null)
  setNovaPosicao(null)
}

async function salvarLocalizacao() {
  if (!unidadeEmAjuste || !novaPosicao) {
    return
  }

  const confirmar = window.confirm(
    'Deseja salvar esta nova localização para esta unidade?'
  )

  if (!confirmar) {
    return
  }

  setSalvandoLocalizacao(true)

  try {
    const latitude = Number(novaPosicao[0])
    const longitude = Number(novaPosicao[1])

    const { error } = await supabase
      .from('unidades')
      .update({
        latitude: latitude,
        longitude: longitude,
      })
      .eq('id', unidadeEmAjuste.id)

    if (error) {
      console.error(
        'Erro ao salvar localização:',
        error
      )

      window.alert(
        'Não foi possível salvar a nova localização.'
      )

      return
    }

    unidadeEmAjuste.latitude = latitude
    unidadeEmAjuste.longitude = longitude
    unidadeEmAjuste.posicao = [
      latitude,
      longitude,
    ]

    setUnidadeEmAjuste(null)
    setNovaPosicao(null)

    window.alert(
      'Localização atualizada com sucesso!'
    )

  } catch (error) {
    console.error(
      'Erro ao atualizar localização:',
      error
    )

    window.alert(
      'Ocorreu um erro ao salvar a localização.'
    )

  } finally {
    setSalvandoLocalizacao(false)
  }
}

async function editarDadosUnidade(
  unidade,
  novosDados
) {
  try {
    const dadosAtualizados = {
      matricula:
        novosDados.matricula || null,

      hidrometro:
        novosDados.hidrometro || null,

      lote:
        novosDados.lote || null,

      quadra:
        novosDados.quadra || null,
    }

    const { error } = await supabase
      .from('unidades')
      .update(dadosAtualizados)
      .eq('id', unidade.id)

    if (error) {
      console.error(
        'Erro ao atualizar dados da unidade:',
        error
      )

      window.alert(
        'Não foi possível atualizar os dados da unidade.'
      )

      return false
    }

    unidade.matricula =
      dadosAtualizados.matricula

    unidade.hidrometro =
      dadosAtualizados.hidrometro

    unidade.lote =
      dadosAtualizados.lote

    unidade.quadra =
      dadosAtualizados.quadra

    window.alert(
      'Dados atualizados com sucesso!'
    )

    return true

  } catch (error) {
    console.error(
      'Erro ao editar unidade:',
      error
    )

    window.alert(
      'Ocorreu um erro ao atualizar os dados.'
    )

    return false
  }
}
  const chavePosicaoMapa =
    `mapa-${setor}-${localidade}`

  const posicaoSalva = (() => {
    try {
      const salva = sessionStorage.getItem(
        chavePosicaoMapa
      )

      return salva
        ? JSON.parse(salva)
        : null
    } catch {
      return null
    }
  })()

  return (
    <div className="pagina-mapa">

      <div className="cabecalho-mapa">

        <span className="titulo-pequeno">
          {nomeSetor
          ? `${setor} — ${nomeSetor}`
          : setor}
        </span>

        <h2>
          🗺️ Mapa Gerencial
        </h2>

      </div>

      <div className="cards-resumo">

        <div className="card-resumo card-ligadas">
          <span>
            🔵 Unidades ligadas
          </span>

          <strong>
            {unidadesLigadas}
          </strong>
        </div>

        <div className="card-resumo card-ativas">
          <span>
            🟢 Unidades ativas
          </span>

          <strong>
            {unidadesAtivas}
          </strong>
        </div>

        <div className="card-resumo card-cortadas">
          <span>
            🔴 Unidades cortadas
          </span>

          <strong>
            {unidadesCortadas}
          </strong>
        </div>

      </div>

      <div className="pesquisa-mapa">

        <span>
          🔎
        </span>

        <input
          type="text"
          value={pesquisa}
          onChange={(e) =>
            setPesquisa(
              e.target.value
            )
          }
          placeholder="Pesquisar lote, quadra, hidrômetro ou matrícula..."
        />

      </div>

      <div className="area-mapa">

        <div className="controles-mapa">

          <button
            type="button"
            className={
              modoMapa === 'mapa'
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setModoMapa('mapa')
            }
          >
            🗺️ Mapa
          </button>

          <button
            type="button"
            className={
              modoMapa === 'satellite'
                ? 'ativo'
                : ''
            }
            onClick={() =>
              setModoMapa(
                'satellite'
              )
            }
          >
            🛰️ Satélite
          </button>

          <button
  type="button"
  className="botao-exportar-kml"
  onClick={() =>
    exportarKmlUnidades({
      unidades: unidadesDoSetor,
      setor,
      localidade,
    })
  }
>
  📤 Ex KML
</button>

        </div>

{unidadeEmAjuste && (
  <AjustarLocalizacao
    salvando={salvandoLocalizacao}
    onSalvar={salvarLocalizacao}
    onCancelar={cancelarAjusteLocalizacao}
  />
)}

        <MapContainer
          center={
            posicaoSalva
              ? [
                  posicaoSalva.lat,
                  posicaoSalva.lng,
                ]
              : [
                  -28.68,
                  -49.37,
                ]
          }
          zoom={
            posicaoSalva?.zoom ?? 15
          }
          rotate={true}
          touchRotate={true}
          bearing={0}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <AtivarRotacaoMapa />

          <MemorizarPosicaoMapa
            chave={chavePosicaoMapa}
          />

          {!posicaoSalva && (
            <CentralizarMapa
              unidades={
                unidadesDoSetor
              }
            />
          )}

          <LocalizarPesquisa
  unidade={
    pesquisa.trim() &&
    unidadesPesquisadas.length === 1
      ? unidadesPesquisadas[0]
      : null
  }

  marcadoresRef={
    marcadoresRef
  }
/>

          <TileLayer
            attribution={
              modoMapa === 'mapa'
                ? '&copy; OpenStreetMap contributors'
                : '&copy; Esri'
            }
            url={
              modoMapa === 'satellite'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
          />

{unidadesPesquisadas.map(
  (unidade) => {

    const estaEmAjuste =
      unidadeEmAjuste?.id === unidade.id

      
    return (

      <Marker
        key={unidade.id}

                key={unidade.id}

                position={
                    estaEmAjuste && novaPosicao
                    ? novaPosicao
                    : unidade.posicao
                
                }

                draggable={estaEmAjuste}

                icon={
                  criarIconeUnidade(
                    unidade.situacao
                  )
                }

                ref={(marker) => {
                  if (marker) {
                    marcadoresRef.current[
                      unidade.id
                    ] = marker
                  }
                }}

                eventHandlers={{
          dragend: (evento) => {

            if (!estaEmAjuste) {
              return
            }

            const marker =
              evento.target

            const posicao =
              marker.getLatLng()

            setNovaPosicao([
              posicao.lat,
              posicao.lng,
            ])
          },
        }}
              >

<Popup className="popup-azul-bebe">

<PopupUnidade
  unidade={unidade}
  fotosUnidades={fotosUnidades}
  onAmpliarFoto={setFotoAmpliada}
  onAjustarLocalizacao={iniciarAjusteLocalizacao}
  onEditarDados={editarDadosUnidade}
  alterarSituacao={alterarSituacao}
  excluirUnidade={excluirUnidade}
/>

</Popup>

              </Marker>

            )
             }

          )}

        </MapContainer>

      </div>

      {fotoAmpliada && (
        <div
          onClick={() =>
            setFotoAmpliada(null)
          }
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor:
              'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            cursor: 'zoom-out',
          }}
        >

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setFotoAmpliada(null)
            }}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              width: '45px',
              height: '45px',
              border: 'none',
              borderRadius: '50%',
              backgroundColor: 'white',
              color: '#222',
              fontSize: '30px',
              cursor: 'pointer',
              zIndex: 100000,
            }}
          >
            ×
          </button>

          <img
            src={fotoAmpliada}
            alt="Foto ampliada"
            onClick={(e) =>
              e.stopPropagation()
            }
            style={{
              maxWidth: '95vw',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow:
                '0 10px 40px rgba(0,0,0,0.5)',
              cursor: 'default',
            }}
          />

        </div>
      )}

    </div>
  )
}

export default MapaGerencial
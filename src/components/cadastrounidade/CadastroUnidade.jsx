import { useState, useEffect } from 'react'

import './CadastroUnidade.css'

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from 'react-leaflet'

import 'leaflet-rotate'

import L from 'leaflet'

import 'leaflet/dist/leaflet.css'


// =====================================================
// MARCADOR ARRASTÁVEL
// =====================================================

function MarcadorArrastavel({
  posicao,
  onMover,
}) {

  if (
    !posicao ||
    !Array.isArray(posicao) ||
    posicao.length !== 2
  ) {
    return null
  }

  const latitude = Number(posicao[0])
  const longitude = Number(posicao[1])

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  const icone = L.divIcon({

    className: 'marcador-cadastro',

    html: `
      <div
        style="
          width: 16px;
          height: 16px;
          background: #1683d8;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        "
      ></div>
    `,

    iconSize: [22, 22],

    iconAnchor: [11, 11],
  })

  return (
    <Marker
      position={[
        latitude,
        longitude,
      ]}

      icon={icone}

      draggable={true}

      eventHandlers={{
        dragend: (e) => {

          const marcador = e.target

          const novaPosicao =
            marcador.getLatLng()

          if (!novaPosicao) {
            return
          }

          onMover([
            novaPosicao.lat,
            novaPosicao.lng,
          ])
        },
      }}
    />
  )
}


// =====================================================
// CLIQUE NO MAPA
// =====================================================

function CliqueNoMapa({
  onMover,
}) {

  const map = useMap()

  useEffect(() => {

    if (!map) {
      return
    }

    function aoClicar(e) {

      if (!e?.latlng) {
        return
      }

      onMover([
        e.latlng.lat,
        e.latlng.lng,
      ])
    }

    map.on(
      'click',
      aoClicar
    )

    return () => {

      map.off(
        'click',
        aoClicar
      )

    }

  }, [map, onMover])

  return null
}


// =====================================================
// ATUALIZAR CENTRO DO MAPA
// =====================================================

function AtualizarCentroMapa({
  posicao,
}) {

  const map = useMap()

  useEffect(() => {

    if (
      !map ||
      !posicao ||
      !Array.isArray(posicao) ||
      posicao.length !== 2
    ) {
      return
    }

    const latitude = Number(posicao[0])
    const longitude = Number(posicao[1])

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return
    }

    const novaPosicao = [
      latitude,
      longitude,
    ]

    // Atualiza o tamanho do mapa
    map.invalidateSize()

    // Centraliza
    map.setView(
      novaPosicao,
      18
    )

    // No celular, o mapa pode precisar
    // de uma segunda atualização
    const timer = setTimeout(() => {

      map.invalidateSize()

      map.setView(
        novaPosicao,
        18
      )

    }, 300)

    return () => {
      clearTimeout(timer)
    }

  }, [map, posicao])

  return null
}

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

// =====================================================
// MAPA DE CADASTRO
// =====================================================

function MapaCadastro({
  posicao,
  onMover,
  onFechar,
}) {

  const [modoMapa, setModoMapa] =
    useState('mapa')


  // Segurança adicional
  if (
    !posicao ||
    !Array.isArray(posicao) ||
    posicao.length !== 2
  ) {
    return null
  }

  const latitude = Number(posicao[0])
  const longitude = Number(posicao[1])

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null
  }

  const posicaoValida = [
    latitude,
    longitude,
  ]


  return (

    <div
      style={{
        position: 'relative',
        width: '100%',
      }}
    >

      {/* ============================================
          CONTROLES
      ============================================ */}

      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '10px',
          background: '#fff',
          borderBottom: '1px solid #ddd',
          flexWrap: 'wrap',
        }}
      >

        <button
          type="button"
          onClick={() =>
            setModoMapa('mapa')
          }
          style={{
            background:
              modoMapa === 'mapa'
                ? '#1683d8'
                : '#f1f1f1',

            color:
              modoMapa === 'mapa'
                ? 'white'
                : '#333',

            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🗺️ Mapa
        </button>


        <button
          type="button"
          onClick={() =>
            setModoMapa('satellite')
          }
          style={{
            background:
              modoMapa === 'satellite'
                ? '#1683d8'
                : '#f1f1f1',

            color:
              modoMapa === 'satellite'
                ? 'white'
                : '#333',

            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          🛰️ Satélite
        </button>

      </div>


      {/* ============================================
          INSTRUÇÃO
      ============================================ */}

      <div
        style={{
          background: '#1683d8',
          color: 'white',
          padding: '10px 14px',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        📍 Clique no mapa ou arraste o ponto azul para
        posicionar a unidade.
      </div>


      {/* ============================================
          MAPA
      ============================================ */}

      <MapContainer

        center={posicaoValida}

        zoom={18}
        rotate={true}
        touchRotate={true}
        bearing={0}

        style={{
          width: '100%',
          height: '350px',
        }}

        scrollWheelZoom={true}
      >
        <AtivarRotacaoMapa />

        <AtualizarCentroMapa
          posicao={posicaoValida}
        />


        <CliqueNoMapa
          onMover={onMover}
        />


        {/* ==========================================
            MAPA NORMAL
        ========================================== */}

        {modoMapa === 'mapa' && (

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"

            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        )}


        {/* ==========================================
            SATÉLITE
        ========================================== */}

        {modoMapa === 'satellite' && (

          <TileLayer
            attribution="&copy; Esri"

            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />

        )}


        {/* ==========================================
            MARCADOR
        ========================================== */}

        <MarcadorArrastavel

          posicao={posicaoValida}

          onMover={onMover}

        />

      </MapContainer>


      {/* ============================================
          CONFIRMAR
      ============================================ */}

      <div
        style={{
          padding: '10px',
          background: '#fff',
          borderTop: '1px solid #ddd',
          textAlign: 'right',
        }}
      >

        <button
          type="button"

          onClick={onFechar}

          style={{
            background: '#198754',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          ✓ Confirmar localização
        </button>

      </div>

    </div>
  )
}

// =====================================================
// REDUZIR / COMPRIMIR FOTO
// =====================================================

async function comprimirFoto(arquivo) {
  if (!arquivo) {
    return null
  }

  // Se não for imagem, mantém o arquivo original
  if (!arquivo.type?.startsWith('image/')) {
    return arquivo
  }

  const MAX_LADO = 1600
  const QUALIDADE = 0.8

  return new Promise((resolve, reject) => {
    const imagem = new Image()
    const urlTemporaria =
      URL.createObjectURL(arquivo)

    imagem.onload = () => {
      try {
        let largura = imagem.width
        let altura = imagem.height

        // Redimensiona mantendo a proporção
        if (
          largura > MAX_LADO ||
          altura > MAX_LADO
        ) {
          if (largura >= altura) {
            altura = Math.round(
              altura * (MAX_LADO / largura)
            )

            largura = MAX_LADO
          } else {
            largura = Math.round(
              largura * (MAX_LADO / altura)
            )

            altura = MAX_LADO
          }
        }

        const canvas =
          document.createElement('canvas')

        canvas.width = largura
        canvas.height = altura

        const contexto =
          canvas.getContext('2d')

        if (!contexto) {
          URL.revokeObjectURL(
            urlTemporaria
          )

          reject(
            new Error(
              'Não foi possível processar a foto.'
            )
          )

          return
        }

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
                  'Não foi possível comprimir a foto.'
                )
              )

              return
            }

            const nomeOriginal =
              arquivo.name ||
              'foto.jpg'

            const nomeSemExtensao =
              nomeOriginal.replace(
                /\.[^/.]+$/,
                ''
              )

            const arquivoComprimido =
              new File(
                [blob],
                `${nomeSemExtensao}.jpg`,
                {
                  type: 'image/jpeg',
                  lastModified:
                    Date.now(),
                }
              )

            console.log(
              'Foto original:',
              (
                arquivo.size /
                1024 /
                1024
              ).toFixed(2),
              'MB'
            )

            console.log(
              'Foto comprimida:',
              (
                arquivoComprimido.size /
                1024 /
                1024
              ).toFixed(2),
              'MB'
            )

            resolve(
              arquivoComprimido
            )
          },
          'image/jpeg',
          QUALIDADE
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
          'Não foi possível abrir a foto selecionada.'
        )
      )
    }

    imagem.src = urlTemporaria
  })
}

const localidadesPorSetor = {
  'SETOR 02': ['TORNEIRO'],
  'SETOR 03': ['ESPLANADA'],
  'SETOR 04': ['JANAÍNA', 'COPA 70'],
  'SETOR 05': ['ALBATROZ', 'CATARINENSE', 'MONTREAL'],
  'SETOR 06': ["OLHO D'ÁGUA"],
}

// =====================================================
// CADASTRO DE UNIDADE
// =====================================================

function CadastroUnidade({
  setores,
  onSalvar,
  onCancelar,
  salvando = false,
}) {

  const [formulario, setFormulario] =
    useState({

      setor: 'SETOR 02',

      localidade: 'TORNEIRO',

      quadra: '',

      lote: '',

      hidrometro: '',

      matricula: '',

      situacao: 'ativa',

      latitude: '',

      longitude: '',

    })


  const [fotoFrente, setFotoFrente] =
    useState(null)


  const [fotoHidrometro, setFotoHidrometro] =
    useState(null)


  const [mostrarMapa, setMostrarMapa] =
    useState(false)


  // ===================================================
  // OBTER POSIÇÃO
  // ===================================================

  function obterPosicao() {

    const latitude =
      Number(formulario.latitude)

    const longitude =
      Number(formulario.longitude)


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return null
    }


    return [
      latitude,
      longitude,
    ]
  }


  // ===================================================
  // MOVER MARCADOR
  // ===================================================

  function moverMarcador(posicao) {

    if (
      !posicao ||
      posicao.length !== 2
    ) {
      return
    }


    const latitude =
      Number(posicao[0])

    const longitude =
      Number(posicao[1])


    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      return
    }


    setFormulario((anterior) => ({

      ...anterior,

      latitude:
        latitude.toFixed(7),

      longitude:
        longitude.toFixed(7),

    }))
  }


  // ===================================================
  // ALTERAR CAMPO
  // ===================================================

  function alterarCampo(
  campo,
  valor
) {
  setFormulario((anterior) => {

    if (campo === 'setor') {
      const localidades =
        localidadesPorSetor[valor] || []

      return {
        ...anterior,
        setor: valor,
        localidade:
          localidades[0] || '',
      }
    }

    return {
      ...anterior,
      [campo]: valor,
    }
  })
}

  // ===================================================
  // LOCALIZAÇÃO
  // ===================================================

  function usarMinhaLocalizacao() {

    console.log(
      'Solicitando localização...'
    )


    if (
      !navigator.geolocation
    ) {

      window.alert(
        'Seu navegador não oferece suporte à localização.'
      )

      return
    }


    navigator.geolocation.getCurrentPosition(

      // ===============================================
      // SUCESSO
      // ===============================================

      (posicao) => {

        const {
          latitude,
          longitude,
          accuracy,
        } = posicao.coords


        console.log(
          '=============================='
        )

        console.log(
          'LOCALIZAÇÃO OBTIDA'
        )

        console.log(
          'Latitude:',
          latitude
        )

        console.log(
          'Longitude:',
          longitude
        )

        console.log(
          'Precisão:',
          accuracy,
          'metros'
        )

        console.log(
          '=============================='
        )


        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {

          window.alert(
            'O aparelho retornou uma localização inválida.'
          )

          return
        }


        setFormulario((anterior) => ({

          ...anterior,

          latitude:
            latitude.toFixed(7),

          longitude:
            longitude.toFixed(7),

        }))


        // Abrir mapa somente depois
        // que a posição foi obtida

        setMostrarMapa(true)

      },


      // ===============================================
      // ERRO
      // ===============================================

      (erro) => {

        console.error(
          '================================'
        )

        console.error(
          'ERRO DE GEOLOCALIZAÇÃO'
        )

        console.error(
          'Código:',
          erro.code
        )

        console.error(
          'Mensagem:',
          erro.message
        )

        console.error(
          '================================'
        )


        let mensagem = ''


        switch (erro.code) {

          case 1:

            mensagem =
              'A permissão de localização foi negada pelo navegador.\n\n' +

              'No celular, toque no ícone de cadeado ou configurações ao lado do endereço do site e permita a localização.\n\n' +

              'Depois recarregue a página e tente novamente.'

            break


          case 2:

            mensagem =
              'O celular não conseguiu determinar sua localização.\n\n' +

              'Verifique se a localização/GPS está ativada e tente novamente.'

            break


          case 3:

            mensagem =
              'O tempo para obter sua localização terminou.\n\n' +

              'Tente novamente em um local com melhor sinal de GPS.'

            break


          default:

            mensagem =
              'Não foi possível obter sua localização.'
        }


        window.alert(
          mensagem
        )

      },


      // ===============================================
      // CONFIGURAÇÕES
      // ===============================================

      {
        enableHighAccuracy: true,

        timeout: 60000,

        maximumAge: 0,
      }

    )
  }


  // ===================================================
  // ENVIAR FORMULÁRIO
  // ===================================================

  function enviarFormulario(event) {

    event.preventDefault()


    onSalvar({

      formulario,

      fotoFrente,

      fotoHidrometro,

    })
  }


  // ===================================================
  // POSIÇÃO ATUAL
  // ===================================================

  const posicaoMapa =
    obterPosicao()


  // ===================================================
  // TELA
  // ===================================================

  return (

    <div className="pagina-mapa pagina-cadastro">


      {/* =============================================
          CABEÇALHO
      ============================================= */}

      <div className="cabecalho-mapa">

        <span className="titulo-pequeno">

          NOVO CADASTRO

        </span>


        <h2>

          ➕ Cadastro de Unidade

        </h2>

      </div>


      {/* =============================================
          FORMULÁRIO
      ============================================= */}

      <form

        className="formulario-unidade"

        onSubmit={enviarFormulario}

      >


        {/* ==========================================
            SETOR
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Setor
          </label>


          <select

            value={formulario.setor}

            onChange={(e) =>
              alterarCampo(
                'setor',
                e.target.value
              )
            }

          >

            {setores.map(
              (setor) => (

                <option
                  key={setor.nome}
                  value={setor.nome}
                >

                  {setor.nome}

                </option>

              )
            )}

          </select>

        </div>

{/* LOCALIDADE */}

<div className="campo-formulario">
  <label>
    Localidade
  </label>

  <select
    value={formulario.localidade}
    onChange={(e) =>
      alterarCampo(
        'localidade',
        e.target.value
      )
    }
  >
    {(
      localidadesPorSetor[
        formulario.setor
      ] || []
    ).map((localidade) => (
      <option
        key={localidade}
        value={localidade}
      >
        {localidade}
      </option>
    ))}
  </select>
</div>

        {/* ==========================================
            QUADRA
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Quadra
          </label>


          <input

            type="text"

            value={formulario.quadra}

            onChange={(e) =>
              alterarCampo(
                'quadra',
                e.target.value
              )
            }

            placeholder="Ex.: 03"

          />

        </div>


        {/* ==========================================
            LOTE
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Lote
          </label>


          <input

            type="text"

            value={formulario.lote}

            onChange={(e) =>
              alterarCampo(
                'lote',
                e.target.value
              )
            }

            placeholder="Ex.: 12"

          />

        </div>


        {/* ==========================================
            HIDRÔMETRO
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Hidrômetro
          </label>


          <input

            type="text"

            value={formulario.hidrometro}

            onChange={(e) =>
              alterarCampo(
                'hidrometro',
                e.target.value
              )
            }

            placeholder="Número do hidrômetro"

          />

        </div>


        {/* ==========================================
            MATRÍCULA
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Matrícula
          </label>


          <input

            type="text"

            value={formulario.matricula}

            onChange={(e) =>
              alterarCampo(
                'matricula',
                e.target.value
              )
            }

            placeholder="Número da matrícula"

          />

        </div>


        {/* ==========================================
            SITUAÇÃO
        ========================================== */}

        <div className="campo-formulario">

          <label>
            Situação
          </label>


          <select

            value={formulario.situacao}

            onChange={(e) =>
              alterarCampo(
                'situacao',
                e.target.value
              )
            }

          >

            <option value="ativa">
              Ativa
            </option>


            <option value="cortada">
              Cortada
            </option>

          </select>

        </div>


        {/* ==========================================
            LOCALIZAÇÃO
        ========================================== */}

        <div className="bloco-localizacao">

          <h3>
            📍 Localização
          </h3>


          <button

            type="button"

            onClick={
              usarMinhaLocalizacao
            }

          >

            📍 Usar minha localização

          </button>


          {/* ========================================
              MAPA
          ======================================== */}

          {mostrarMapa && posicaoMapa && (

            <div
              style={{
                marginTop: '15px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #ddd',
                width: '100%',
              }}
            >

              <MapaCadastro

                posicao={posicaoMapa}

                onMover={
                  moverMarcador
                }

                onFechar={() =>
                  setMostrarMapa(false)
                }

              />

            </div>

          )}


          {/* ========================================
              COORDENADAS
          ======================================== */}

          <div className="linha-localizacao">


            <div className="campo-formulario">

              <label>
                Latitude
              </label>


              <input

                type="text"

                value={
                  formulario.latitude
                }

                onChange={(e) =>
                  alterarCampo(
                    'latitude',
                    e.target.value
                  )
                }

                placeholder="-28.680000"

              />

            </div>


            <div className="campo-formulario">

              <label>
                Longitude
              </label>


              <input

                type="text"

                value={
                  formulario.longitude
                }

                onChange={(e) =>
                  alterarCampo(
                    'longitude',
                    e.target.value
                  )
                }

                placeholder="-49.370000"

              />

            </div>


          </div>

        </div>


        {/* ==========================================
            FOTOS
        ========================================== */}

        <div className="bloco-fotos">

          <h3>
            📷 Fotos da unidade
          </h3>


          <div className="campo-formulario">

            <label>
              Foto da frente
            </label>


            <input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const arquivo =
      e.target.files?.[0]

    if (!arquivo) {
      setFotoFrente(null)
      return
    }

    try {
      const fotoComprimida =
        await comprimirFoto(arquivo)

      setFotoFrente(
        fotoComprimida
      )
    } catch (error) {
      console.error(
        'Erro ao processar foto da frente:',
        error
      )

      window.alert(
        'Não foi possível processar a foto da frente. Tente tirar a foto novamente.'
      )

      setFotoFrente(null)
    }
  }}
/>


            {fotoFrente && (

              <small>

                Foto selecionada:{' '}

                {fotoFrente.name}

              </small>

            )}

          </div>


          <div className="campo-formulario">

            <label>
              Foto do hidrômetro
            </label>


            <input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const arquivo =
      e.target.files?.[0]

    if (!arquivo) {
      setFotoHidrometro(null)
      return
    }

    try {
      const fotoComprimida =
        await comprimirFoto(arquivo)

      setFotoHidrometro(
        fotoComprimida
      )
    } catch (error) {
      console.error(
        'Erro ao processar foto do hidrômetro:',
        error
      )

      window.alert(
        'Não foi possível processar a foto do hidrômetro. Tente tirar a foto novamente.'
      )

      setFotoHidrometro(null)
    }
  }}
/>


            {fotoHidrometro && (

              <small>

                Foto selecionada:{' '}

                {fotoHidrometro.name}

              </small>

            )}

          </div>

        </div>


        {/* ==========================================
            BOTÕES
        ========================================== */}

        <div className="botoes-formulario">


          <button

            type="button"

            onClick={
              onCancelar
            }

          >

            Cancelar

          </button>


          <button

            type="submit"

            disabled={salvando}

          >

            {salvando
              ? 'Salvando...'
              : '💾 Salvar unidade'}

          </button>


        </div>


      </form>

    </div>
  )
}


export default CadastroUnidade
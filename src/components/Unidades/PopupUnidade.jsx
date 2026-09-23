import { useState } from 'react'
import { useMap } from 'react-leaflet'
import FotosPopupUnidade from './FotosPopupUnidade'
import './PopupUnidade.css'

function PopupUnidade({
  unidade,
  fotosUnidades = [],
  onAmpliarFoto,
  onAjustarLocalizacao,
  onEditarDados,
  alterarSituacao,
  excluirUnidade,
}) {
  const map = useMap()

  const [editando, setEditando] = useState(false)

  const [matricula, setMatricula] = useState(
    unidade.matricula || ''
  )

  const [hidrometro, setHidrometro] = useState(
    unidade.hidrometro || ''
  )

  const [lote, setLote] = useState(
    unidade.lote || ''
  )

  const [quadra, setQuadra] = useState(
    unidade.quadra || ''
  )

  const [salvando, setSalvando] = useState(false)

  function atualizarPopup() {
    setTimeout(() => {
      const popup = map._popup

      if (popup) {
        popup.update()
      }
    }, 0)
  }

  function abrirEdicao() {
    setMatricula(unidade.matricula || '')
    setHidrometro(unidade.hidrometro || '')
    setLote(unidade.lote || '')
    setQuadra(unidade.quadra || '')

    setEditando(true)

    atualizarPopup()
  }

  function cancelarEdicao() {
    setMatricula(unidade.matricula || '')
    setHidrometro(unidade.hidrometro || '')
    setLote(unidade.lote || '')
    setQuadra(unidade.quadra || '')

    setEditando(false)

    atualizarPopup()
  }

  async function salvarEdicao() {
    if (!onEditarDados) {
      return
    }

    setSalvando(true)

    try {
      const sucesso = await onEditarDados(
        unidade,
        {
          matricula: matricula.trim(),
          hidrometro: hidrometro.trim(),
          lote: lote.trim(),
          quadra: quadra.trim(),
        }
      )

      if (sucesso) {
        setEditando(false)
        atualizarPopup()
      }
    } finally {
      setSalvando(false)
    }
  }

  const estiloInput = {
    width: '100%',
    height: '32px',
    boxSizing: 'border-box',
    padding: '5px 7px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '13px',
    background: '#ffffff',
    color: '#222222',
    outline: 'none',
  }

  const estiloLabel = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '3px',
  }

  /*
    =====================================================
    MODO DE EDIÇÃO
    =====================================================
  */

  if (editando) {
    return (
      
      <div className="popup-unidade">
        
        <div
          style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
            paddingBottom: '6px',
            marginBottom: '7px',
            borderBottom:
              '1px solid rgba(255,255,255,0.35)',
          }}
        >
          ✏️ Editar unidade
        </div>

        {/* MATRÍCULA */}

        <div
          style={{
            marginBottom: '6px',
          }}
        >
          <label style={estiloLabel}>
            Matrícula
          </label>

          <input
            type="text"
            value={matricula}
            onChange={(e) =>
              setMatricula(e.target.value)
            }
            style={estiloInput}
          />
        </div>

        {/* HIDRÔMETRO */}

        <div
          style={{
            marginBottom: '6px',
          }}
        >
          <label style={estiloLabel}>
            Hidrômetro
          </label>

          <input
            type="text"
            value={hidrometro}
            onChange={(e) =>
              setHidrometro(e.target.value)
            }
            style={estiloInput}
          />
        </div>

        {/* LOTE E QUADRA */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          <div>
            <label style={estiloLabel}>
              Lote
            </label>

            <input
              type="text"
              value={lote}
              onChange={(e) =>
                setLote(e.target.value)
              }
              style={estiloInput}
            />
          </div>

          <div>
            <label style={estiloLabel}>
              Quadra
            </label>

            <input
              type="text"
              value={quadra}
              onChange={(e) =>
                setQuadra(e.target.value)
              }
              style={estiloInput}
            />
          </div>
        </div>

        {/* BOTÕES */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
          }}
        >
          <button
            type="button"
            onClick={cancelarEdicao}
            disabled={salvando}
            style={{
              border: '1px solid #d0d7de',
              borderRadius: '6px',
              padding: '7px 5px',
              background: '#ffffff',
              color: '#333333',
              fontSize: '12px',
              cursor: salvando
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={salvarEdicao}
            disabled={salvando}
            style={{
              border: '1px solid #198754',
              borderRadius: '6px',
              padding: '7px 5px',
              background: '#198754',
              color: 'white',
              fontSize: '12px',
              fontWeight: '700',
              cursor: salvando
                ? 'not-allowed'
                : 'pointer',
            }}
          >
            {salvando
              ? 'Salvando...'
              : '💾 Salvar'}
          </button>
        </div>
      </div>
    )
  }

  /*
    =====================================================
    POPUP NORMAL
    =====================================================
  */

  return (
    <div
      style={{
        width: '230px',
        fontFamily: 'Arial, sans-serif',
        borderRadius: '10px',
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >

      {/* CABEÇALHO */}

      <div
        style={{
          borderBottom: '1px solid #e5e5e5',
          paddingBottom: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: 'white',
          }}
        >
          📋 Matrícula {unidade.matricula || '-'}
        </div>

        <div
          style={{
            marginTop: '4px',
            fontSize: '13px',
            color: 'white',
          }}
        >
          {unidade.setor}
          {' • '}
          L{unidade.lote || '-'}
          {' • '}
          Q{unidade.quadra || '-'}
        </div>
      </div>

      {/* INFORMAÇÕES */}

      <div
        style={{
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            color: '#DCEAF5',
          }}
        >
          💧 <strong>Hidrômetro:</strong>{' '}
          {unidade.hidrometro || '-'}
        </div>

        <div
          style={{
            marginTop: '6px',
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            background:
              unidade.situacao === 'ativa'
                ? '#d1e7dd'
                : '#f8d7da',
            color:
              unidade.situacao === 'ativa'
                ? '#0f5132'
                : '#842029',
          }}
        >
          {unidade.situacao === 'ativa'
            ? '🟢 ATIVA'
            : '🔴 CORTADA'}
        </div>
      </div>

      {/* NAVEGAR */}

      <button
        type="button"
        onClick={() => {
          const latitude =
            Number(unidade.latitude)

          const longitude =
            Number(unidade.longitude)

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            window.alert(
              'Esta unidade não possui uma localização válida.'
            )

            return
          }

          const destino =
            `${latitude},${longitude}`

          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${destino}`,
            '_blank'
          )
        }}
        style={{
          width: '100%',
          border: '1px solid #d0d7de',
          borderRadius: '6px',
          padding: '7px',
          background: '#ffffff',
          color: '#333333',
          cursor: 'pointer',
          marginBottom: '6px',
        }}
      >
        🧭 Navegar até aqui
      </button>

      {/* AJUSTAR LOCALIZAÇÃO */}

      {onAjustarLocalizacao && (
        <button
          type="button"
          onClick={() =>
            onAjustarLocalizacao(unidade)
          }
          style={{
            width: '100%',
            border: '1px solid #1683d8',
            borderRadius: '6px',
            padding: '7px',
            background: '#ffffff',
            color: '#1683d8',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '6px',
          }}
        >
          📍 Ajustar localização
        </button>
      )}

      {/* FOTOS */}

      <FotosPopupUnidade
        unidade={unidade}
        fotosUnidades={fotosUnidades}
        onAmpliarFoto={onAmpliarFoto}
      />

      {/* MAIS OPÇÕES */}

      <details
        style={{
          marginTop: '5px',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            padding: '7px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'white',
          }}
        >
          ⋮ Mais opções
        </summary>

        <div
          style={{
            marginTop: '5px',
          }}
        >

          {/* EDITAR DADOS */}

          {onEditarDados && (
            <button
              type="button"
              onClick={abrirEdicao}
              style={{
                width: '100%',
                border: '1px solid #1683d8',
                borderRadius: '6px',
                padding: '7px',
                background: '#ffffff',
                color: '#1683d8',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              ✏️ Editar dados
            </button>
          )}

          {/* ALTERAR SITUAÇÃO */}

          {alterarSituacao && (
            <button
              type="button"
              onClick={() =>
                alterarSituacao(
                  unidade.id
                )
              }
              style={{
                width: '100%',
                border:
                  '1px solid #5572d1',
                borderRadius: '6px',
                padding: '7px',
                background: '#fafbff',
                color: '#0830b4',
                cursor: 'pointer',
                marginBottom: '5px',
              }}
            >
              🔄 Alterar situação
            </button>
          )}

          {/* EXCLUIR */}

          {excluirUnidade && (
            <button
              type="button"
              onClick={() =>
                excluirUnidade(
                  unidade
                )
              }
              style={{
                width: '100%',
                border:
                  '1px solid #ffffff',
                borderRadius: '6px',
                padding: '7px',
                background: '#cd3939',
                color: '#f6eeef',
                cursor: 'pointer',
              }}
            >
              🗑️ Excluir unidade
            </button>
          )}

        </div>
      </details>

    </div>
  )
}

export default PopupUnidade
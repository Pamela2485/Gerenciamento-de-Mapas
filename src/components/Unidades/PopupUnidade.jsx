import FotosPopupUnidade from './FotosPopupUnidade'

function PopupUnidade({
  unidade,
  fotosUnidades = [],
  onAmpliarFoto,
  onAjustarLocalizacao,
  alterarSituacao,
  excluirUnidade,
}) {
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
          {unidade.setor} • L{unidade.lote || '-'} • Q{unidade.quadra || '-'}
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
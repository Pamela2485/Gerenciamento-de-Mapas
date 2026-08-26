function AjustarLocalizacao({
  salvando,
  onSalvar,
  onCancelar,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'white',
        padding: '12px 18px',
        borderRadius: '10px',
        boxShadow:
          '0 3px 12px rgba(0,0,0,0.25)',
        textAlign: 'center',
        minWidth: '280px',
      }}
    >

      <strong>
        📍 Ajustando localização
      </strong>

      <div
        style={{
          marginTop: '5px',
          fontSize: '13px',
          color: '#555',
        }}
      >
        Arraste o ponto para o local correto.
      </div>

      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >

        <button
          type="button"
          onClick={onSalvar}
          disabled={salvando}
          style={{
            background: '#198754',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {salvando
            ? 'Salvando...'
            : '💾 Salvar localização'}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ❌ Cancelar
        </button>

      </div>

    </div>
  )
}

export default AjustarLocalizacao
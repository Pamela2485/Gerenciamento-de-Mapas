function FotosPopupUnidade({
  unidade,
  fotosUnidades = [],
  onAmpliarFoto,
}) {

  const fotosDaUnidade =
    fotosUnidades.filter(
      (foto) =>
        Number(foto.unidade_id) ===
        Number(unidade.id)
    )

  return (
    <details>

      <summary
        style={{
          cursor: 'pointer',
          padding: '7px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'white',
        }}
      >
        📷 Fotos da unidade
      </summary>

      <div
        style={{
          marginTop: '8px',
        }}
      >

        {fotosDaUnidade.length === 0 ? (

          <div
            style={{
              fontSize: '12px',
              color: 'white',
              padding: '5px',
            }}
          >
            Nenhuma foto cadastrada.
          </div>

        ) : (

          fotosDaUnidade.map(
            (foto) => (

              <div
                key={foto.id}
                style={{
                  marginBottom: '8px',
                }}
              >

                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  {foto.tipo === 'frente'
                    ? 'Foto da frente'
                    : foto.tipo === 'hidrometro'
                    ? 'Foto do hidrômetro'
                    : foto.tipo}
                </div>

                <img
                  src={String(
                    foto.url_foto
                  ).trim()}
                  alt={
                    foto.tipo === 'frente'
                      ? 'Foto da frente'
                      : 'Foto do hidrômetro'
                  }
                  onClick={() =>
                    onAmpliarFoto?.(
                      String(
                        foto.url_foto
                      ).trim()
                    )
                  }
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    marginTop: '4px',
                    cursor: 'pointer',
                    border: '1px solid #ddd',
                  }}
                />

              </div>

            )
          )

        )}

      </div>

    </details>
  )
}

export default FotosPopupUnidade
function Sidebar({
  setores,
  setorAberto,
  alternarSetor,
  abrirMapa,
  setPagina,
  menuAberto,
  setMenuAberto,
  perfil,
  onSair,
}) {

  // =====================================================
  // VERIFICAR SE ITEM É RESTRITO AO ADMINISTRADOR
  // =====================================================

  function itemRestrito(mapa) {

    return (
      mapa.startsWith('Importar KML') ||
      mapa === 'Rota de Leitura' ||
      mapa.startsWith('Rota ')
    )
  }


  // =====================================================
  // FILTRAR ITENS DO MENU CONFORME PERFIL
  // =====================================================

  function mapasPermitidos(
    mapas
  ) {

    if (
      perfil?.tipo ===
      'administrador'
    ) {

      return mapas

    }


    return mapas.filter(
      (mapa) =>
        !itemRestrito(
          mapa
        )
    )
  }


  // =====================================================
  // TELA
  // =====================================================

  return (
    <>

      {menuAberto && (

        <div
          className="fundo-menu-mobile"
          onClick={() =>
            setMenuAberto(
              false
            )
          }
        />

      )}


      <aside
        className={`sidebar ${
          menuAberto
            ? 'menu-aberto'
            : ''
        }`}
      >


        {/* =============================================
            LOGO
        ============================================= */}

        <div className="logo-area">

          <img
            src="/icone.png"
            alt="Gerenciamento de Mapa"
            className="logo-imagem"
          />

        </div>


        {/* =============================================
            MENU
        ============================================= */}

        <nav className="menu">


          {/* INÍCIO */}

          <button
            className="menu-item inicio"
            onClick={() => {

              setPagina(
                'inicio'
              )

              setMenuAberto(
                false
              )

            }}
          >

            <span>
              🏠
            </span>

            <span>
              Início
            </span>

          </button>


          {/* CADASTRO */}

          <button
            className="menu-item inicio"
            onClick={() => {

              setPagina(
                'cadastro'
              )

              setMenuAberto(
                false
              )

            }}
          >

            <span>
              ➕
            </span>

            <span>
              Cadastro de Unidades
            </span>

          </button>


          {/* =============================================
              SETORES
          ============================================= */}

          {setores.map(
            (
              setor,
              index
            ) => {

              const mapas =
                mapasPermitidos(
                  setor.mapas
                )


              return (

                <div
                  className="setor-container"
                  key={
                    setor.nome
                  }
                >


                  {/* BOTÃO DO SETOR */}

                  <button
                    className={`menu-item setor ${
                      setorAberto ===
                      index
                        ? 'ativo'
                        : ''
                    }`}

                    onClick={() =>
                      alternarSetor(
                        index
                      )
                    }
                  >

                    <span>
                      📍
                    </span>


                    <span>
                      {setor.nome}
                    </span>


                    <span className="seta">

                      {setorAberto ===
                      index
                        ? '⌄'
                        : '›'}

                    </span>

                  </button>


                  {/* =====================================
                      SUBMENU
                  ===================================== */}

                  {setorAberto ===
                    index && (

                    <div className="submenu">

                      {mapas.map(
                        (mapa) => (

                          <button
                            key={
                              mapa
                            }

                            onClick={() => {

                              abrirMapa(
                                setor.nome,
                                mapa
                              )

                              setMenuAberto(
                                false
                              )

                            }}
                          >


                            {/* ÍCONE */}

                            <span>

                              {
                                mapa ===
                                  'Mapa de Rede' ||
                                mapa.startsWith(
                                  'Rede '
                                )

                                  ? '💧'

                                  : mapa.startsWith(
                                      'Importar KML'
                                    )

                                  ? '📥'

                                  : mapa ===
                                      'Rota de Leitura' ||
                                    mapa.startsWith(
                                      'Rota '
                                    )

                                  ? '🧭'

                                  : '🗺️'
                              }

                            </span>


                            {/* TEXTO */}

                            <span>
                              {mapa}
                            </span>


                          </button>

                        )
                      )}

                    </div>

                  )}


                </div>

              )

            }
          )}


        </nav>


        {/* =============================================
            SAIR
        ============================================= */}

        <button
  type="button"
  className="sair"
  onClick={
    onSair
  }
>
  <span>
    🚪
  </span>

  <span>
    Sair
  </span>
</button>


      </aside>

    </>
  )
}

export default Sidebar
import Janaina from './Janaina'
import Copa70 from './Copa70'

function Setor04({
  mapaSelecionado,
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  if (mapaSelecionado === 'JANAINA') {
    return (
      <Janaina
        unidades={unidades}
        fotosUnidades={fotosUnidades}
        alterarSituacao={alterarSituacao}
        excluirUnidade={excluirUnidade}
      />
    )
  }

  if (mapaSelecionado === 'COPA 70') {
    return (
      <Copa70
        unidades={unidades}
        fotosUnidades={fotosUnidades}
        alterarSituacao={alterarSituacao}
        excluirUnidade={excluirUnidade}
      />
    )
  }

  return null
}

export default Setor04
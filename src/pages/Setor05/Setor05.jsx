import Albatroz from './Albatroz'
import Catarinense from './Catarinense'
import Montreal from './Montreal'

function Setor05({
  mapaSelecionado,
  unidades,
  fotosUnidades,
  alterarSituacao,
  excluirUnidade,
}) {
  if (mapaSelecionado === 'ALBATROZ') {
    return (
      <Albatroz
        unidades={unidades}
        fotosUnidades={fotosUnidades}
        alterarSituacao={alterarSituacao}
        excluirUnidade={excluirUnidade}
      />
    )
  }

  if (mapaSelecionado === 'CATARINENSE') {
    return (
      <Catarinense
        unidades={unidades}
        fotosUnidades={fotosUnidades}
        alterarSituacao={alterarSituacao}
        excluirUnidade={excluirUnidade}
      />
    )
  }

  if (mapaSelecionado === 'MONTREAL') {
    return (
      <Montreal
        unidades={unidades}
        fotosUnidades={fotosUnidades}
        alterarSituacao={alterarSituacao}
        excluirUnidade={excluirUnidade}
      />
    )
  }

  return null
}

export default Setor05
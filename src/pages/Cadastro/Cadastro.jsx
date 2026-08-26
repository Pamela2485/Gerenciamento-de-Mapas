import CadastroUnidade from '../../components/cadastrounidade/CadastroUnidade.jsx'

function Cadastro({
  setores,
  onSalvar,
  onCancelar,
  salvando,
}) {
  return (
    <CadastroUnidade
      setores={setores}
      onSalvar={onSalvar}
      onCancelar={onCancelar}
      salvando={salvando}
    />
  )
}

export default Cadastro
# Entregas do sistema

- [ ] **Dashboard operacional do veículo**
  - Mostrar quilometragem, consumo médio, gastos com combustível, gastos com pedágio, multas pendentes e registros recentes.
  - Permitir navegação simples entre os módulos e exibir estados vazios e feedbacks claros.

- [ ] **Diário de bordo**
  - Cadastrar, consultar, editar e excluir deslocamentos.
  - Registrar data, origem, destino, finalidade, hodômetro inicial e final, motorista e observações.
  - Calcular a distância percorrida a partir dos hodômetros.

- [ ] **Checklist do veículo**
  - Registrar verificações periódicas, condições dos itens, observações, pendências e fotos quando configurado o Storage.

- [ ] **Abastecimentos**
  - Registrar data, hodômetro, combustível, quantidade, valor, posto, observações e comprovante.
  - Calcular preço por litro, consumo médio e custo por quilômetro quando houver dados suficientes.

- [ ] **Pedágios**
  - Cadastrar, consultar, editar e excluir despesas com data, localização, valor, observações e comprovante.

- [ ] **Multas**
  - Registrar infração, vencimento, valor, situação, observações e anexos quando configurado o Storage.
  - Destacar multas pendentes no dashboard.

- [ ] **Relatórios e backup**
  - Filtrar registros por período e módulo, mostrar totais e indicadores básicos.
  - Exportar os dados em JSON e importar um arquivo JSON validado com mensagens claras.

- [ ] **Supabase e publicação**
  - Usar Supabase como fonte de dados privada, com credenciais públicas configuradas por ambiente e sem segredos no repositório.
  - Manter a interface compatível com build estático para GitHub Pages.

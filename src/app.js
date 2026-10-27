import { supabase, supabaseConfigured } from './supabase';
import './styles.css';

const STORAGE_KEY = 'frotapref-demo-v1';
const TABLES = {
  diario: 'diario_bordo',
  checklist: 'checklists',
  abastecimentos: 'abastecimentos',
  pedagios: 'pedagios',
  multas: 'multas'
};

const CHECK_ITEMS = [
  ['pneus', 'Pneus e estepe'],
  ['freios', 'Freios'],
  ['oleo', 'Óleo do motor'],
  ['agua', 'Água do radiador'],
  ['luzes', 'Luzes e sinalização'],
  ['documentos', 'Documentação'],
  ['extintor', 'Extintor e equipamentos'],
  ['limpeza', 'Limpeza interna e externa'],
  ['avarias', 'Avarias visíveis']
];

const MODULES = {
  diario: {
    label: 'Diário de bordo',
    singular: 'deslocamento',
    description: 'Registre cada saída do veículo e acompanhe a quilometragem percorrida.',
    icon: 'route',
    columns: [
      ['data', 'Data'], ['destino', 'Destino'], ['finalidade', 'Finalidade'], ['motorista', 'Motorista'], ['distancia', 'Distância']
    ],
    fields: [
      { name: 'data', label: 'Data', type: 'date', required: true },
      { name: 'hora_saida', label: 'Hora de saída', type: 'time' },
      { name: 'hora_retorno', label: 'Hora de retorno', type: 'time' },
      { name: 'origem', label: 'Origem', placeholder: 'Ex.: Garagem municipal' },
      { name: 'destino', label: 'Destino', required: true, placeholder: 'Local ou município visitado' },
      { name: 'finalidade', label: 'Finalidade', placeholder: 'Ex.: Transporte de equipe' },
      { name: 'motorista', label: 'Motorista', placeholder: 'Nome do condutor' },
      { name: 'hodometro_inicial', label: 'Hodômetro inicial', type: 'number', required: true, min: 0 },
      { name: 'hodometro_final', label: 'Hodômetro final', type: 'number', required: true, min: 0 },
      { name: 'observacoes', label: 'Observações', type: 'textarea', full: true, placeholder: 'Ocorrências ou informações adicionais' }
    ]
  },
  checklist: {
    label: 'Checklist',
    singular: 'checklist',
    description: 'Faça uma verificação rápida antes de colocar o veículo em circulação.',
    icon: 'clipboard',
    columns: [['data', 'Data'], ['hodometro', 'Hodômetro'], ['status', 'Resultado'], ['pendencias', 'Pendências']],
    fields: [
      { name: 'data', label: 'Data', type: 'date', required: true },
      { name: 'hodometro', label: 'Hodômetro', type: 'number', min: 0, required: true },
      { name: 'observacoes', label: 'Observações', type: 'textarea', full: true, placeholder: 'Observações gerais da vistoria' },
      { name: 'pendencias', label: 'Pendências identificadas', type: 'textarea', full: true, placeholder: 'Descreva o que precisa de atenção' }
    ]
  },
  abastecimentos: {
    label: 'Abastecimentos',
    singular: 'abastecimento',
    description: 'Acompanhe litros, custo e eficiência do veículo em cada abastecimento.',
    icon: 'fuel',
    columns: [['data', 'Data'], ['posto', 'Posto'], ['litros', 'Litros'], ['valor_total', 'Valor'], ['preco_litro', 'R$/L'], ['hodometro', 'Hodômetro']],
    fields: [
      { name: 'data', label: 'Data', type: 'date', required: true },
      { name: 'hodometro', label: 'Hodômetro', type: 'number', min: 0, required: true },
      { name: 'combustivel', label: 'Combustível', type: 'select', required: true, options: ['Gasolina', 'Etanol', 'Diesel', 'Flex'] },
      { name: 'litros', label: 'Quantidade (litros)', type: 'number', step: '0.01', min: 0, required: true },
      { name: 'valor_total', label: 'Valor total (R$)', type: 'number', step: '0.01', min: 0, required: true },
      { name: 'posto', label: 'Posto', placeholder: 'Nome do posto ou fornecedor' },
      { name: 'observacoes', label: 'Observações', type: 'textarea', full: true, placeholder: 'Número da nota, tipo de pagamento ou outra informação' }
    ]
  },
  pedagios: {
    label: 'Pedágios',
    singular: 'pedágio',
    description: 'Mantenha o histórico de despesas de pedágio associado às viagens.',
    icon: 'road',
    columns: [['data', 'Data'], ['local', 'Local'], ['valor', 'Valor'], ['observacoes', 'Observações']],
    fields: [
      { name: 'data', label: 'Data', type: 'date', required: true },
      { name: 'local', label: 'Praça ou rodovia', required: true, placeholder: 'Ex.: Rodovia BR-000, km 12' },
      { name: 'valor', label: 'Valor (R$)', type: 'number', step: '0.01', min: 0, required: true },
      { name: 'observacoes', label: 'Observações', type: 'textarea', full: true, placeholder: 'Viagem relacionada ou comprovante' }
    ]
  },
  multas: {
    label: 'Multas',
    singular: 'multa',
    description: 'Controle notificações, vencimentos e situação das infrações.',
    icon: 'alert',
    columns: [['data_infracao', 'Infração'], ['descricao', 'Descrição'], ['vencimento', 'Vencimento'], ['valor', 'Valor'], ['situacao', 'Situação']],
    fields: [
      { name: 'data_infracao', label: 'Data da infração', type: 'date', required: true },
      { name: 'vencimento', label: 'Vencimento', type: 'date' },
      { name: 'descricao', label: 'Descrição da infração', required: true, placeholder: 'Código ou descrição' },
      { name: 'valor', label: 'Valor (R$)', type: 'number', step: '0.01', min: 0, required: true },
      { name: 'pontuacao', label: 'Pontos', type: 'number', min: 0, step: '1' },
      { name: 'situacao', label: 'Situação', type: 'select', required: true, options: ['Pendente', 'Paga', 'Em recurso', 'Cancelada'] },
      { name: 'observacoes', label: 'Observações', type: 'textarea', full: true, placeholder: 'Auto de infração ou detalhes' }
    ]
  }
};

const initialState = () => ({
  config: { placa: '', marca: '', modelo: '', ano: '', combustivel: 'Flex', hodometro_referencia: 0 },
  records: { diario: [], checklist: [], abastecimentos: [], pedagios: [], multas: [] }
});

const state = {
  ...initialState(),
  view: getView(),
  session: null,
  user: null,
  loading: true,
  notice: null,
  authMode: 'login',
  modal: null,
  mode: supabaseConfigured ? 'supabase' : 'demo'
};

function getView() {
  const value = window.location.hash.replace('#/', '').split('?')[0];
  return ['diario', 'checklist', 'abastecimentos', 'pedagios', 'multas', 'relatorios', 'configuracoes'].includes(value) ? value : 'dashboard';
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num(value));
}

function number(value, digits = 1) {
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: digits }).format(num(value));
}

function date(value) {
  if (!value) return '—';
  const [year, month, day] = String(value).slice(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function monthLabel(value) {
  if (!value) return 'este período';
  const [year, month] = value.split('-');
  return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(Number(year), Number(month) - 1, 1));
}

function distance(item) {
  return Math.max(0, num(item.hodometro_final) - num(item.hodometro_inicial));
}

function pricePerLiter(item) {
  return num(item.litros) ? num(item.valor_total) / num(item.litros) : 0;
}

function statusTag(value) {
  const normalized = String(value || '').toLowerCase();
  const tone = normalized.includes('paga') || normalized.includes('conforme') ? 'success' : normalized.includes('cancel') ? 'muted' : normalized.includes('recurso') ? 'warning' : 'danger';
  return `<span class="tag tag-${tone}">${esc(value || 'Pendente')}</span>`;
}

function icon(name, size = 18) {
  const paths = {
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    route: '<circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 19h2a4 4 0 0 0 4-4v-2a4 4 0 0 1 4-4h0"/>',
    clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8M8 13h6M8 17h4"/>',
    fuel: '<path d="M6 21V4a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v17M4 21h15M17 7h2l2 2v7a2 2 0 0 1-2 2h-1M9 6h5v5H9z"/>',
    road: '<path d="M5 21 9 3M19 21 15 3M12 5v3M12 12v3M12 19v2"/>',
    alert: '<path d="M10.3 3.4 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="m19.4 15 .1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.9 1.9 0 0 0-3.2 1.4v.3a2 2 0 1 1-4 0v-.2A1.9 1.9 0 0 0 6.2 18l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.9 1.9 0 0 0 2 12a1.9 1.9 0 0 0-1.4-3.2h-.3a2 2 0 1 1 0-4h.2A1.9 1.9 0 0 0 2 1.6l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.9 1.9 0 0 0 8 0a1.9 1.9 0 0 0 3.2-1.4v-.3a2 2 0 1 1 4 0v.2A1.9 1.9 0 0 0 18 0l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.9 1.9 0 0 0 22 6a1.9 1.9 0 0 0 1.4 3.2h.3a2 2 0 1 1 0 4h-.2A1.9 1.9 0 0 0 22 15" transform="translate(1 1) scale(.83)"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
    upload: '<path d="M12 15V3M7 8l5-5 5 5M4 20h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="m4 16-.8 4.8L8 20l11-11a2.8 2.8 0 0 0-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V3h6v4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    logout: '<path d="M10 17l5-5-5-5M15 12H3M20 4v16"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    car: '<path d="m5 16-1-5 2-6h12l2 6-1 5M4 16h16M7 16v3M17 16v3M6 11h12"/><circle cx="7" cy="13" r="1"/><circle cx="17" cy="13" r="1"/>'
  };
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.dashboard}</svg>`;
}

function loadLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.records && saved?.config) return saved;
  } catch {
    // mantém estado inicial quando o armazenamento local estiver corrompido.
  }
  return initialState();
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ config: state.config, records: state.records }));
}

function setNotice(message, tone = 'success') {
  state.notice = { message, tone };
  render();
  window.setTimeout(() => {
    if (state.notice?.message === message) {
      state.notice = null;
      render();
    }
  }, 4500);
}

async function loadRemote() {
  if (!supabaseConfigured || !state.user) return;
  const responses = await Promise.all(Object.entries(TABLES).map(async ([key, table]) => {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return [key, data || []];
  }));
  const { data: config } = await supabase.from('vehicle_config').select('*').maybeSingle();
  state.records = Object.fromEntries(responses);
  state.config = config || initialState().config;
  state.mode = 'supabase';
}

async function createRecord(module, payload) {
  if (state.mode === 'supabase' && state.user) {
    const { data, error } = await supabase.from(TABLES[module]).insert({ ...payload, user_id: state.user.id }).select().single();
    if (error) throw error;
    state.records[module].unshift(data);
    return data;
  }
  const data = { ...payload, id: uuid(), created_at: new Date().toISOString() };
  state.records[module].unshift(data);
  saveLocal();
  return data;
}

async function updateRecord(module, id, payload) {
  if (state.mode === 'supabase' && state.user) {
    const { data, error } = await supabase.from(TABLES[module]).update(payload).eq('id', id).eq('user_id', state.user.id).select().single();
    if (error) throw error;
    state.records[module] = state.records[module].map((item) => item.id === id ? data : item);
    return data;
  }
  state.records[module] = state.records[module].map((item) => item.id === id ? { ...item, ...payload } : item);
  saveLocal();
}

async function deleteRecord(module, id) {
  if (state.mode === 'supabase' && state.user) {
    const { error } = await supabase.from(TABLES[module]).delete().eq('id', id).eq('user_id', state.user.id);
    if (error) throw error;
  }
  state.records[module] = state.records[module].filter((item) => item.id !== id);
  if (state.mode === 'demo') saveLocal();
}

async function saveConfig(form) {
  const payload = {
    placa: form.placa.value.trim(), marca: form.marca.value.trim(), modelo: form.modelo.value.trim(),
    ano: form.ano.value ? Number(form.ano.value) : null, combustivel: form.combustivel.value,
    hodometro_referencia: Number(form.hodometro_referencia.value || 0)
  };
  if (state.mode === 'supabase' && state.user) {
    const { data, error } = await supabase.from('vehicle_config').upsert({ ...payload, user_id: state.user.id }, { onConflict: 'user_id' }).select().single();
    if (error) throw error;
    state.config = data;
  } else {
    state.config = payload;
    saveLocal();
  }
  setNotice('Configurações do veículo salvas.');
}

function navItems() {
  return [
    ['dashboard', 'Painel', 'dashboard'], ['diario', 'Diário de bordo', 'route'], ['checklist', 'Checklist', 'clipboard'],
    ['abastecimentos', 'Abastecimentos', 'fuel'], ['pedagios', 'Pedágios', 'road'], ['multas', 'Multas', 'alert'],
    ['relatorios', 'Relatórios e backup', 'chart'], ['configuracoes', 'Configurações', 'settings']
  ];
}

function shell() {
  const vehicle = [state.config.marca, state.config.modelo].filter(Boolean).join(' ') || 'Veículo oficial';
  const active = state.view;
  return `<div class="app-shell">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><div class="brand-mark">${icon('car', 22)}</div><div><strong>Frota<span>Pref</span></strong><small>controle oficial</small></div></div>
      <div class="vehicle-mini"><span class="eyebrow">VEÍCULO ATIVO</span><strong>${esc(vehicle)}</strong><span>${esc(state.config.placa || 'Placa não cadastrada')}</span></div>
      <nav class="nav-list" aria-label="Navegação principal">${navItems().map(([id, label, ico]) => `<a href="#/${id === 'dashboard' ? '' : id}" class="nav-item ${active === id ? 'active' : ''}" data-nav="${id}">${icon(ico, 18)}<span>${label}</span>${id === 'multas' && pendingFines() ? `<b class="nav-count">${pendingFines()}</b>` : ''}</a>`).join('')}</nav>
      <div class="sidebar-footer"><div class="connection-dot ${state.mode === 'supabase' ? 'online' : 'local'}"></div><span>${state.mode === 'supabase' ? 'Supabase conectado' : 'Modo demonstração'}</span></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><button class="icon-button mobile-only" data-action="toggle-menu" aria-label="Abrir menu">${icon('menu')}</button><div class="breadcrumb"><span>Gestão de frota</span><b>/</b><strong>${pageTitle()}</strong></div><div class="top-actions"><span class="date-today">${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date())}</span>${state.mode === 'supabase' ? `<button class="user-chip" data-action="logout" title="Sair">${initials(state.user?.email)} <span>${esc(state.user?.email || '')}</span>${icon('logout', 14)}</button>` : '<span class="demo-chip">dados locais</span>'}</div></header>
      ${state.notice ? `<div class="notice notice-${state.notice.tone}">${state.notice.tone === 'success' ? icon('check', 17) : icon('alert', 17)}<span>${esc(state.notice.message)}</span><button class="notice-close" data-action="dismiss-notice">${icon('close', 15)}</button></div>` : ''}
      <section class="page-content">${renderView()}</section>
    </main>
  </div>${state.modal ? renderModal() : ''}`;
}

function initials(email = '') {
  return email.split('@')[0].split(/[. _-]/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'EU';
}

function pageTitle() {
  if (state.view === 'dashboard') return 'Painel do veículo';
  if (state.view === 'relatorios') return 'Relatórios e backup';
  if (state.view === 'configuracoes') return 'Configurações';
  return MODULES[state.view]?.label || 'Painel';
}

function pendingFines() {
  return state.records.multas.filter((item) => item.situacao === 'Pendente' || item.situacao === 'Em recurso').length;
}

function renderView() {
  if (state.loading) return '<div class="loading-state"><div class="spinner"></div><p>Carregando registros...</p></div>';
  if (state.view === 'dashboard') return renderDashboard();
  if (state.view === 'relatorios') return renderReports();
  if (state.view === 'configuracoes') return renderSettings();
  return renderModule(state.view);
}

function renderDashboard() {
  const diaries = state.records.diario;
  const fuels = state.records.abastecimentos;
  const tolls = state.records.pedagios;
  const totalDistance = diaries.reduce((sum, item) => sum + distance(item), 0);
  const fuelCost = fuels.reduce((sum, item) => sum + num(item.valor_total), 0);
  const tollCost = tolls.reduce((sum, item) => sum + num(item.valor), 0);
  const liters = fuels.reduce((sum, item) => sum + num(item.litros), 0);
  const consumption = totalDistance && liters ? totalDistance / liters : 0;
  const recent = [...diaries.map((item) => ({ ...item, kind: 'diario' })), ...fuels.map((item) => ({ ...item, kind: 'abastecimentos' }))].sort((a, b) => String(b.data).localeCompare(String(a.data))).slice(0, 5);
  const vehicleName = [state.config.marca, state.config.modelo].filter(Boolean).join(' ') || 'Seu veículo oficial';
  return `<div class="page-heading dashboard-heading"><div><span class="eyebrow">VISÃO GERAL</span><h1>${esc(vehicleName)}</h1><p>Acompanhe a operação, os custos e as pendências do veículo em um só lugar.</p></div><button class="button button-primary" data-action="open-modal" data-module="diario">${icon('plus', 17)} Novo deslocamento</button></div>
    <div class="metric-grid">
      ${metricCard('Quilometragem', `${number(totalDistance)} <small>km</small>`, 'desde o início do controle', 'route', 'blue')}
      ${metricCard('Consumo médio', consumption ? `${number(consumption, 2)} <small>km/L</small>` : '—', liters ? `${number(liters, 1)} litros registrados` : 'adicione abastecimentos', 'fuel', 'green')}
      ${metricCard('Combustível', money(fuelCost), `${fuels.length} abastecimento${fuels.length === 1 ? '' : 's'}`, 'fuel', 'gold')}
      ${metricCard('Pedágios', money(tollCost), `${tolls.length} lançamento${tolls.length === 1 ? '' : 's'}`, 'road', 'purple')}
    </div>
    <div class="dashboard-grid"><div class="panel recent-panel"><div class="panel-header"><div><span class="eyebrow">MOVIMENTAÇÕES</span><h2>Registros recentes</h2></div><a class="text-link" href="#/diario">Ver diário ${icon('arrow', 15)}</a></div>${recent.length ? `<div class="activity-list">${recent.map(activityRow).join('')}</div>` : emptyState('Ainda não há movimentações', 'Cadastre o primeiro deslocamento ou abastecimento para começar.', 'diario')}</div>
      <div class="panel attention-panel"><div class="panel-header"><div><span class="eyebrow">ATENÇÃO</span><h2>Pontos para conferir</h2></div>${pendingFines() ? `<span class="tag tag-danger">${pendingFines()} pendente${pendingFines() === 1 ? '' : 's'}</span>` : ''}</div>${attentionItems()}</div></div>
    <div class="quick-actions"><span class="eyebrow">LANÇAMENTO RÁPIDO</span><div>${[['checklist', 'Fazer checklist', 'clipboard'], ['abastecimentos', 'Registrar abastecimento', 'fuel'], ['pedagios', 'Adicionar pedágio', 'road'], ['multas', 'Registrar multa', 'alert']].map(([module, label, ico]) => `<button class="quick-action" data-action="open-modal" data-module="${module}">${icon(ico, 18)}<span>${label}</span>${icon('arrow', 15)}</button>`).join('')}</div></div>`;
}

function metricCard(label, value, hint, ico, color) {
  return `<article class="metric-card metric-${color}"><div class="metric-icon">${icon(ico, 20)}</div><div><span>${label}</span><strong>${value}</strong><small>${hint}</small></div></article>`;
}

function activityRow(item) {
  const isDiary = item.kind === 'diario';
  return `<div class="activity-row"><div class="activity-icon ${isDiary ? 'blue' : 'green'}">${icon(isDiary ? 'route' : 'fuel', 17)}</div><div class="activity-copy"><strong>${isDiary ? esc(item.destino || 'Deslocamento') : `Abastecimento em ${esc(item.posto || 'posto não informado')}`}</strong><span>${date(item.data)} ${isDiary ? `· ${number(distance(item))} km` : `· ${money(item.valor_total)}`}</span></div><span class="activity-kind">${isDiary ? 'Diário' : 'Combustível'}</span></div>`;
}

function attentionItems() {
  const items = [];
  if (!state.config.placa) items.push(`<a href="#/configuracoes" class="attention-row"><span class="attention-symbol">!</span><span><strong>Complete os dados do veículo</strong><small>Placa e hodômetro de referência ajudam nos relatórios.</small></span>${icon('arrow', 15)}</a>`);
  if (pendingFines()) items.push(`<a href="#/multas" class="attention-row"><span class="attention-symbol danger">!</span><span><strong>Há multas para acompanhar</strong><small>${pendingFines()} registro${pendingFines() === 1 ? '' : 's'} em situação pendente.</small></span>${icon('arrow', 15)}</a>`);
  const openChecks = state.records.checklist.filter((item) => item.pendencias).length;
  if (openChecks) items.push(`<a href="#/checklist" class="attention-row"><span class="attention-symbol warning">!</span><span><strong>Checklist com pendências</strong><small>${openChecks} verificação${openChecks === 1 ? '' : 'ões'} com observações de atenção.</small></span>${icon('arrow', 15)}</a>`);
  if (!items.length) return `<div class="all-clear"><div>${icon('check', 26)}</div><strong>Tudo em ordem por aqui</strong><span>As pendências do veículo aparecerão nesta área.</span></div>`;
  return `<div class="attention-list">${items.join('')}</div>`;
}

function renderModule(module) {
  const config = MODULES[module];
  const records = state.records[module] || [];
  return `<div class="page-heading"><div><span class="eyebrow">REGISTROS</span><h1>${config.label}</h1><p>${config.description}</p></div><button class="button button-primary" data-action="open-modal" data-module="${module}">${icon('plus', 17)} Novo ${config.singular}</button></div>
    <div class="module-toolbar"><div class="record-count"><strong>${records.length}</strong> registro${records.length === 1 ? '' : 's'}</div><div class="toolbar-actions"><input class="search-input" data-search="${module}" placeholder="Buscar nesta lista" aria-label="Buscar nesta lista" />${module === 'multas' ? `<select class="filter-select" data-filter-status><option value="">Todas as situações</option><option>Pendente</option><option>Paga</option><option>Em recurso</option><option>Cancelada</option></select>` : ''}</div></div>
    <div class="panel table-panel"><div class="table-scroll"><table class="data-table"><thead><tr>${config.columns.map(([, label]) => `<th>${label}</th>`).join('')}<th class="actions-col">Ações</th></tr></thead><tbody data-table-body="${module}">${renderRows(module, records)}</tbody></table></div></div>`;
}

function renderRows(module, records) {
  if (!records.length) return `<tr><td colspan="${MODULES[module].columns.length + 1}">${emptyState('Nenhum registro encontrado', 'Use o botão acima para adicionar o primeiro lançamento.', module)}</td></tr>`;
  return records.map((item) => {
    const cells = MODULES[module].columns.map(([field]) => `<td>${cellValue(module, field, item)}</td>`).join('');
    return `<tr data-row-id="${esc(item.id)}">${cells}<td class="row-actions"><button class="table-action" data-action="edit" data-module="${module}" data-id="${item.id}" title="Editar">${icon('edit', 16)}</button><button class="table-action danger-action" data-action="delete" data-module="${module}" data-id="${item.id}" title="Excluir">${icon('trash', 16)}</button></td></tr>`;
  }).join('');
}

function cellValue(module, field, item) {
  if (field === 'data' || field === 'data_infracao' || field === 'vencimento') return date(item[field]);
  if (field === 'distancia') return `<strong>${number(distance(item))} km</strong>`;
  if (field === 'valor' || field === 'valor_total') return money(item[field]);
  if (field === 'preco_litro') return item.litros ? money(pricePerLiter(item)) : '—';
  if (field === 'litros' || field === 'hodometro' || field === 'hodometro_inicial' || field === 'hodometro_final') return number(item[field]);
  if (field === 'situacao') return statusTag(item[field]);
  if (field === 'status') {
    const fails = (item.itens || []).filter((entry) => entry.status === 'Não conforme').length;
    return fails ? statusTag(`${fails} pendência${fails === 1 ? '' : 's'}`) : statusTag('Conforme');
  }
  const value = item[field];
  return value ? esc(value) : '<span class="muted">—</span>';
}

function renderReports() {
  const totalDistance = state.records.diario.reduce((sum, item) => sum + distance(item), 0);
  const fuel = state.records.abastecimentos.reduce((sum, item) => sum + num(item.valor_total), 0);
  const tolls = state.records.pedagios.reduce((sum, item) => sum + num(item.valor), 0);
  const fines = state.records.multas.reduce((sum, item) => sum + num(item.valor), 0);
  const exportData = JSON.stringify({ version: 1, exported_at: new Date().toISOString(), config: state.config, records: state.records }, null, 2);
  return `<div class="page-heading"><div><span class="eyebrow">ACOMPANHAMENTO</span><h1>Relatórios e backup</h1><p>Confira os totais do controle e mantenha uma cópia dos seus dados.</p></div><button class="button button-primary" data-action="export-json">${icon('download', 17)} Exportar JSON</button></div>
    <div class="report-cards"><div class="report-card"><span>Distância registrada</span><strong>${number(totalDistance)} km</strong><small>em ${state.records.diario.length} deslocamento${state.records.diario.length === 1 ? '' : 's'}</small></div><div class="report-card"><span>Combustível</span><strong>${money(fuel)}</strong><small>${state.records.abastecimentos.length} abastecimento${state.records.abastecimentos.length === 1 ? '' : 's'}</small></div><div class="report-card"><span>Pedágios</span><strong>${money(tolls)}</strong><small>${state.records.pedagios.length} lançamento${state.records.pedagios.length === 1 ? '' : 's'}</small></div><div class="report-card"><span>Multas</span><strong>${money(fines)}</strong><small>${pendingFines()} pendente${pendingFines() === 1 ? '' : 's'}</small></div></div>
    <div class="reports-grid"><div class="panel report-panel"><div class="panel-header"><div><span class="eyebrow">ANÁLISE</span><h2>Resumo por módulo</h2></div></div><div class="summary-list">${summaryLine('Diário de bordo', state.records.diario.length, `${number(totalDistance)} km`, 'route')}${summaryLine('Abastecimentos', state.records.abastecimentos.length, money(fuel), 'fuel')}${summaryLine('Pedágios', state.records.pedagios.length, money(tolls), 'road')}${summaryLine('Multas', state.records.multas.length, money(fines), 'alert')}</div></div>
      <div class="panel backup-panel"><div class="panel-header"><div><span class="eyebrow">PORTABILIDADE</span><h2>Backup dos dados</h2></div>${icon('download', 20)}</div><p>O arquivo JSON contém configurações e registros deste veículo. Guarde-o em local seguro e faça exportações periódicas.</p><div class="backup-actions"><button class="button button-secondary" data-action="export-json">${icon('download', 16)} Baixar backup</button><label class="button button-ghost">${icon('upload', 16)} Importar backup<input type="file" accept="application/json,.json" data-action="import-json" hidden /></label></div><pre class="json-preview">${esc(exportData.slice(0, 420))}${exportData.length > 420 ? '\n…' : ''}</pre></div></div>`;
}

function summaryLine(label, count, value, ico) {
  return `<div class="summary-line"><span class="summary-icon">${icon(ico, 17)}</span><span><strong>${label}</strong><small>${count} registro${count === 1 ? '' : 's'}</small></span><b>${value}</b></div>`;
}

function renderSettings() {
  return `<div class="page-heading"><div><span class="eyebrow">CONFIGURAÇÃO BASE</span><h1>Dados do veículo</h1><p>Essas informações alimentam o cabeçalho e os cálculos do painel.</p></div></div><div class="settings-layout"><div class="panel form-panel"><div class="panel-header"><div><span class="eyebrow">IDENTIFICAÇÃO</span><h2>Veículo oficial</h2></div>${icon('car', 21)}</div><form id="settings-form" class="form-grid"><label class="field"><span>Placa</span><input name="placa" value="${esc(state.config.placa)}" placeholder="ABC-1D23" /></label><label class="field"><span>Marca</span><input name="marca" value="${esc(state.config.marca)}" placeholder="Ex.: Fiat" /></label><label class="field"><span>Modelo</span><input name="modelo" value="${esc(state.config.modelo)}" placeholder="Ex.: Strada" /></label><label class="field"><span>Ano</span><input name="ano" type="number" min="1900" max="2200" value="${esc(state.config.ano)}" placeholder="2024" /></label><label class="field"><span>Combustível principal</span><select name="combustivel">${['Gasolina', 'Etanol', 'Diesel', 'Flex'].map((option) => `<option ${state.config.combustivel === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label><label class="field"><span>Hodômetro de referência</span><input name="hodometro_referencia" type="number" min="0" value="${esc(state.config.hodometro_referencia || 0)}" /></label><div class="form-footer"><span class="muted">${state.mode === 'supabase' ? 'Sincronizado no Supabase.' : 'Modo demonstração: salvo neste navegador.'}</span><button class="button button-primary" type="submit">${icon('check', 16)} Salvar dados</button></div></form></div><div class="panel guide-panel"><span class="eyebrow">COMO USAR</span><h2>Um registro por vez</h2><p>Comece preenchendo a identificação do veículo. Em seguida, registre as saídas e abastecimentos para que os indicadores de consumo ganhem precisão.</p><div class="guide-step"><b>01</b><span><strong>Identifique o veículo</strong><small>Placa, modelo e hodômetro inicial.</small></span></div><div class="guide-step"><b>02</b><span><strong>Registre a rotina</strong><small>Diário, checklist, combustível e pedágios.</small></span></div><div class="guide-step"><b>03</b><span><strong>Faça backup</strong><small>Exporte o JSON em uma frequência segura.</small></span></div></div></div>`;
}

function emptyState(title, text, module = '') {
  return `<div class="empty-state"><div class="empty-icon">${icon(MODULES[module]?.icon || 'chart', 22)}</div><strong>${title}</strong><span>${text}</span>${module ? `<button class="text-link" data-action="open-modal" data-module="${module}">Adicionar agora ${icon('arrow', 14)}</button>` : ''}</div>`;
}

function renderAuth() {
  return `<div class="auth-page"><div class="auth-decoration"><div class="auth-note"><span class="eyebrow">REGISTRO OFICIAL</span><h1>Controle claro para uma rotina em movimento.</h1><p>Diário de bordo, checklist, combustível e despesas organizados em um só lugar.</p><div class="auth-stamp">${icon('car', 18)} FROTAPREF</div></div></div><div class="auth-card"><div class="brand auth-brand"><div class="brand-mark">${icon('car', 22)}</div><div><strong>Frota<span>Pref</span></strong><small>controle oficial</small></div></div>${state.notice ? `<div class="notice notice-${state.notice.tone}">${icon(state.notice.tone === 'success' ? 'check' : 'alert', 15)}<span>${esc(state.notice.message)}</span></div>` : ''}${state.authMode === 'login' ? `<span class="eyebrow">ACESSO RESTRITO</span><h2>Entrar no sistema</h2><p class="auth-helper">Use o e-mail e a senha cadastrados no Supabase.</p>` : `<span class="eyebrow">PRIMEIRO ACESSO</span><h2>Criar minha conta</h2><p class="auth-helper">Cadastre seu e-mail para começar a usar o controle.</p>`}<form id="auth-form"><label class="field"><span>E-mail</span><input name="email" type="email" required autocomplete="email" placeholder="voce@prefeitura.gov.br" /></label><label class="field"><span>Senha</span><input name="password" type="password" required minlength="6" autocomplete="current-password" placeholder="Mínimo de 6 caracteres" /></label><button class="button button-primary button-wide" type="submit">${state.authMode === 'login' ? 'Entrar' : 'Criar conta'} ${icon('arrow', 16)}</button></form><button class="auth-switch" data-action="toggle-auth">${state.authMode === 'login' ? 'Ainda não tenho uma conta' : 'Já tenho uma conta'}</button><div class="auth-security">${icon('check', 15)} Seus dados ficam associados à sua conta no Supabase.</div></div></div>`;
}

function renderModal() {
  const { module, id } = state.modal;
  const config = MODULES[module];
  const record = id ? state.records[module].find((item) => item.id === id) || {} : {};
  const title = id ? `Editar ${config.singular}` : `Novo ${config.singular}`;
  const fields = config.fields.map((field) => fieldHtml(field, record)).join('');
  const checklist = module === 'checklist' ? `<div class="checklist-box"><span class="field-label">Itens verificados</span><div class="check-grid">${CHECK_ITEMS.map(([key, label]) => { const current = (record.itens || []).find((item) => item.key === key); return `<label class="check-item"><input type="checkbox" name="item-${key}" ${current?.status === 'Conforme' ? 'checked' : ''} /><span>${icon('check', 14)}</span><b>${label}</b></label>`; }).join('')}</div><small class="field-help">Desmarque os itens que não estiverem conformes.</small></div>` : '';
  return `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-modal-content><div class="modal-header"><div><span class="eyebrow">LANÇAMENTO</span><h2 id="modal-title">${title}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Fechar">${icon('close')}</button></div><form id="record-form" data-module="${module}" data-id="${id || ''}"><div class="form-grid">${fields}${checklist}</div><div class="modal-footer"><button type="button" class="button button-ghost" data-action="close-modal">Cancelar</button><button type="submit" class="button button-primary">${icon('check', 16)} Salvar registro</button></div></form></div></div>`;
}

function fieldHtml(field, record) {
  const value = record[field.name] ?? (field.name === 'data' || field.name === 'data_infracao' ? today() : field.name === 'situacao' ? 'Pendente' : '');
  const cls = `field ${field.full ? 'field-full' : ''}`;
  if (field.type === 'textarea') return `<label class="${cls}"><span>${field.label}</span><textarea name="${field.name}" placeholder="${field.placeholder || ''}">${esc(value)}</textarea></label>`;
  if (field.type === 'select') return `<label class="${cls}"><span>${field.label}${field.required ? ' *' : ''}</span><select name="${field.name}" ${field.required ? 'required' : ''}>${field.options.map((option) => `<option ${String(value) === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label>`;
  return `<label class="${cls}"><span>${field.label}${field.required ? ' *' : ''}</span><input name="${field.name}" type="${field.type || 'text'}" value="${esc(value)}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''} ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.step ? `step="${field.step}"` : ''} /></label>`;
}

function downloadJson() {
  const payload = { app: 'FrotaPref', version: 1, exported_at: new Date().toISOString(), config: state.config, records: state.records };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `backup-frotapref-${today()}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  setNotice('Backup JSON exportado com sucesso.');
}

async function importJson(file) {
  try {
    const data = JSON.parse(await file.text());
    if (!data?.config || !data?.records || !Array.isArray(data.records.diario)) throw new Error('Formato inválido');
    if (state.mode === 'supabase') {
      setNotice('O backup foi validado. Para evitar duplicidades, a importação automática no Supabase será liberada na próxima etapa.', 'warning');
      return;
    }
    state.config = { ...initialState().config, ...data.config };
    state.records = { ...initialState().records, ...data.records };
    saveLocal();
    render();
    setNotice('Backup importado com sucesso.');
  } catch {
    setNotice('Não foi possível importar: confira se o arquivo é um backup FrotaPref válido.', 'error');
  }
}

async function handleRecordSubmit(form) {
  const module = form.dataset.module;
  const id = form.dataset.id;
  const payload = {};
  for (const field of MODULES[module].fields) {
    const input = form.elements[field.name];
    if (!input) continue;
    payload[field.name] = field.type === 'number' ? Number(input.value || 0) : input.value.trim();
  }
  if (module === 'checklist') {
    payload.itens = CHECK_ITEMS.map(([key, label]) => ({ key, label, status: form.elements[`item-${key}`].checked ? 'Conforme' : 'Não conforme' }));
  }
  try {
    if (id) await updateRecord(module, id, payload); else await createRecord(module, payload);
    state.modal = null;
    render();
    setNotice(`${MODULES[module].singular[0].toUpperCase() + MODULES[module].singular.slice(1)} ${id ? 'atualizado' : 'salvo'} com sucesso.`);
  } catch (error) {
    setNotice(`Não foi possível salvar. ${error.message || 'Verifique a conexão com o Supabase.'}`, 'error');
  }
}

async function startAuth(form) {
  const email = form.email.value.trim();
  const password = form.password.value;
  const result = state.authMode === 'login' ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
  if (result.error) throw result.error;
  if (state.authMode === 'signup') setNotice('Conta criada. Se a confirmação de e-mail estiver ativa, verifique sua caixa de entrada.', 'success');
}

async function boot() {
  if (!supabaseConfigured) {
    Object.assign(state, loadLocal(), { loading: false, mode: 'demo' });
    render();
    return;
  }
  const { data: { session } } = await supabase.auth.getSession();
  state.session = session;
  state.user = session?.user || null;
  if (session?.user) {
    try { await loadRemote(); } catch (error) { state.notice = { message: `Supabase conectado, mas o banco precisa ser configurado: ${error.message}`, tone: 'error' }; }
  }
  state.loading = false;
  render();
  supabase.auth.onAuthStateChange(async (_event, sessionChange) => {
    state.session = sessionChange;
    state.user = sessionChange?.user || null;
    if (state.user) {
      try { await loadRemote(); } catch (error) { state.notice = { message: `Não foi possível carregar os dados: ${error.message}`, tone: 'error' }; }
    }
    state.loading = false;
    render();
  });
}

function render() {
  document.querySelector('#app').innerHTML = supabaseConfigured && !state.user ? renderAuth() : shell();
}

window.addEventListener('hashchange', () => { state.view = getView(); render(); });

document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action], [data-nav]');
  if (!target) return;
  const action = target.dataset.action;
  if (target.dataset.nav) { state.view = target.dataset.nav; document.querySelector('#sidebar')?.classList.remove('open'); return; }
  if (action === 'open-modal') { state.modal = { module: target.dataset.module, id: target.dataset.id || null }; render(); return; }
  if (action === 'close-modal' && (target.matches('.modal-backdrop') || !target.closest('[data-modal-content]'))) { state.modal = null; render(); return; }
  if (action === 'dismiss-notice') { state.notice = null; render(); return; }
  if (action === 'toggle-menu') { document.querySelector('#sidebar')?.classList.toggle('open'); return; }
  if (action === 'toggle-auth') { state.authMode = state.authMode === 'login' ? 'signup' : 'login'; render(); return; }
  if (action === 'logout') { await supabase.auth.signOut(); return; }
  if (action === 'edit') { state.modal = { module: target.dataset.module, id: target.dataset.id }; render(); return; }
  if (action === 'delete') {
    const module = target.dataset.module; const item = state.records[module].find((entry) => entry.id === target.dataset.id);
    if (!window.confirm(`Excluir este ${MODULES[module].singular}? Esta ação não pode ser desfeita.`)) return;
    try { await deleteRecord(module, item.id); render(); setNotice('Registro excluído.'); } catch (error) { setNotice(`Não foi possível excluir: ${error.message}`, 'error'); }
  }
  if (action === 'export-json') downloadJson();
});

document.addEventListener('submit', async (event) => {
  if (event.target.id === 'record-form') { event.preventDefault(); await handleRecordSubmit(event.target); }
  if (event.target.id === 'settings-form') { event.preventDefault(); try { await saveConfig(event.target); } catch (error) { setNotice(`Não foi possível salvar: ${error.message}`, 'error'); } }
  if (event.target.id === 'auth-form') { event.preventDefault(); const button = event.target.querySelector('button[type="submit"]'); button.disabled = true; try { await startAuth(event.target); } catch (error) { setNotice(error.message || 'Não foi possível autenticar.', 'error'); } finally { button.disabled = false; } }
});

document.addEventListener('change', (event) => {
  if (event.target.dataset.action === 'import-json' && event.target.files[0]) importJson(event.target.files[0]);
  if (event.target.dataset.filterStatus) filterRows();
});

document.addEventListener('input', (event) => {
  if (event.target.dataset.search) filterRows();
});

function filterRows() {
  const module = state.view;
  if (!MODULES[module]) return;
  const query = document.querySelector(`[data-search="${module}"]`)?.value.toLowerCase() || '';
  const status = document.querySelector('[data-filter-status]')?.value || '';
  const filtered = state.records[module].filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(query) && (!status || item.situacao === status);
  });
  const body = document.querySelector(`[data-table-body="${module}"]`);
  if (body) body.innerHTML = renderRows(module, filtered);
}

boot();

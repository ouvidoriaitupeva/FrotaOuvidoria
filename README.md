# Controle de Veículo Oficial

Aplicação web responsiva para diário de bordo, checklist, abastecimentos, pedágios, multas, relatórios e backups JSON.

## Desenvolvimento

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Sem credenciais do Supabase, a aplicação inicia em modo demonstração e salva os dados no navegador. Para uso real, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Supabase

1. Crie um projeto no Supabase.
2. No SQL Editor, execute [`supabase/schema.sql`](supabase/schema.sql).
3. Crie uma conta em Authentication > Users ou use o formulário de primeiro acesso da aplicação.
4. Configure as duas variáveis de ambiente no ambiente de build.

A chave usada no frontend deve ser apenas a chave pública `anon`. Nunca coloque a `service_role` no GitHub ou no navegador.

## GitHub Pages

O build estático é gerado em `dist/`:

```bash
pnpm build
```

No GitHub Actions, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` como secrets do repositório, execute `pnpm install --frozen-lockfile` e `pnpm build`, e publique o diretório `dist` com GitHub Pages.

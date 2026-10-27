# FrotaOuvidoria

Aplicação web responsiva para diário de bordo, checklist, abastecimentos, pedágios, multas, relatórios e backups JSON de um veículo oficial.

## Visão geral da publicação

A arquitetura é composta por três partes:

1. **FrotaOuvidoria:** interface web publicada no GitHub Pages.
2. **Supabase:** autenticação, banco privado, políticas RLS e armazenamento futuro de documentos.
3. **GitHub Actions:** executa o build e publica automaticamente a pasta `dist`.

O repositório não deve conter dados reais do veículo. Ele contém somente o código e o esquema do banco.

## 1. Criar e preparar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto chamado `frotaouvidoria`.
2. Abra **SQL Editor > New query**.
3. Copie todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql), cole na consulta e clique em **Run**.
4. Abra **Authentication > Providers** e mantenha o provedor **Email** habilitado.
5. Em **Project Settings > API**, copie a **Project URL** e a chave pública **anon/publishable**.
6. Nunca use a chave `service_role` no site ou no GitHub.

O SQL cria as tabelas do veículo, diário, checklist, abastecimentos, pedágios, multas, as políticas de segurança por usuário e o bucket privado de documentos.

## 2. Criar o repositório no GitHub

1. Acesse [github.com](https://github.com) e clique em **New repository**.
2. Use um nome como `frotaouvidoria`.
3. Escolha **Private** se os arquivos do projeto não precisarem ser públicos. O site do GitHub Pages ainda poderá ser acessado conforme a configuração da sua conta/organização.
4. Não adicione README, `.gitignore` ou licença pelo site, porque esses arquivos já existem no projeto.
5. Copie a URL HTTPS do repositório.

Se você estiver trabalhando no terminal com este projeto, execute:

```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/frotaouvidoria.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo seu usuário do GitHub. Se o GitHub pedir autenticação, use o login do navegador ou um Personal Access Token, nunca uma senha escrita em arquivo.

## 3. Cadastrar os secrets no GitHub

No repositório, abra **Settings > Secrets and variables > Actions > New repository secret** e crie exatamente estes dois secrets:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | A Project URL copiada no Supabase |
| `VITE_SUPABASE_ANON_KEY` | A chave pública anon/publishable copiada no Supabase |

Não crie `SUPABASE_SERVICE_ROLE_KEY` e não coloque a senha do banco nesses secrets do frontend.

## 4. Habilitar o GitHub Pages

1. No repositório, abra **Settings > Pages**.
2. Em **Build and deployment > Source**, selecione **GitHub Actions**.
3. Salve.
4. Abra a aba **Actions** e selecione o workflow **Publicar FrotaOuvidoria no GitHub Pages**.
5. Clique em **Run workflow** ou faça um novo push na branch `main`.
6. Aguarde as etapas `build` e `deploy` ficarem verdes.
7. Volte em **Settings > Pages** e copie o endereço publicado, normalmente parecido com:

```text
https://SEU_USUARIO.github.io/frotaouvidoria/
```

O workflow está em [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Ele instala as dependências, compila o Vite usando os secrets e publica somente `dist`.

## 5. Primeiro acesso ao sistema

1. Abra o endereço do GitHub Pages.
2. Clique em **Ainda não tenho uma conta**.
3. Cadastre seu e-mail e uma senha com pelo menos seis caracteres.
4. Se o Supabase pedir confirmação, confirme o e-mail.
5. Entre no sistema.
6. Abra **Configurações** e preencha placa, marca, modelo, ano, combustível e hodômetro de referência.
7. Faça um lançamento de teste no diário e confirme se ele aparece no painel.

## 6. Atualizar a aplicação depois

Sempre que houver uma alteração no código:

```bash
git add .
git commit -m "descreva a alteração"
git push origin main
```

O GitHub Actions executará o build e atualizará a página. Para conferir problemas, abra **Actions**, selecione a execução e leia a etapa que ficou vermelha.

## 7. Testes após a primeira publicação

Confira se a tela de login abre, se o cadastro de conta funciona, se o login permanece após atualizar a página e se as telas de diário, checklist, combustível, pedágios e multas salvam e excluem registros. Faça também um backup JSON em **Relatórios e backup**.

Se o login funcionar, mas os registros falharem, volte ao Supabase e confirme se o `schema.sql` foi executado no projeto correto. Se aparecer erro de chave, confira os nomes dos dois secrets e execute novamente o workflow.

## Desenvolvimento local

```bash
pnpm install
cp .env.example .env.local
# edite .env.local com a URL e a chave anon do Supabase
pnpm dev
```

Sem credenciais do Supabase, a aplicação inicia em modo demonstração e salva os dados no navegador. Para gerar a versão de produção:

```bash
pnpm build
```

A pasta `dist` é criada pelo build e não precisa ser versionada, pois o workflow a gera automaticamente.

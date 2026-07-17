# Arquitetura Cloudflare

Este projeto pode rodar com o front em Cloudflare Pages e a API em Cloudflare Workers.

## Componentes

- `React + Vite`: site público, formulário de pedido, acompanhamento e painel.
- `Cloudflare Pages`: hospedagem do front estático.
- `Cloudflare Workers`: API para pedidos, uploads, status e painel.
- `Cloudflare D1`: clientes, pedidos, arquivos e histórico de status.
- `Cloudflare R2`: desenhos, PDFs, prévias e arquivos finais.
- `Cloudflare Access`: proteção da rota `/admin` e das rotas administrativas.

## Arquivos adicionados

- `wrangler.toml`: configuração base do Worker, D1 e R2.
- `worker/src/index.ts`: rotas iniciais da API.
- `worker/migrations/0001_initial.sql`: schema inicial do D1.
- `public/_redirects`: fallback para rotas SPA no Cloudflare Pages.

## Rotas da API

- `GET /health`: teste de disponibilidade.
- `POST /api/orders`: cria pedido e retorna código, token, URL de acompanhamento e URL de upload.
- `GET /api/orders/:code?token=...`: consulta pública protegida por token privado.
- `PUT /api/orders/:code/files/:kind?token=...`: envia arquivo para R2. `kind` aceita `original`, `preview` ou `final`.
- `GET /api/admin/orders`: lista pedidos, protegido por Cloudflare Access.
- `PATCH /api/admin/orders/:code/status`: atualiza status, protegido por Cloudflare Access.
- `GET /api/admin/files/:fileId`: baixa arquivo, protegido por Cloudflare Access.

## Variáveis

Configure em Cloudflare Workers:

- `APP_ORIGIN`: domínio do front, por exemplo `https://seudominio.com`.
- `ADMIN_EMAILS`: e-mails autorizados separados por vírgula.
- `WHATSAPP_NUMBER`: número em formato internacional, por exemplo `5567999999999`.

## Primeiro deploy

1. Criar o banco D1 no Cloudflare.
2. Criar o bucket R2.
3. Substituir `database_id` em `wrangler.toml`.
4. Aplicar a migration do D1.
5. Publicar o Worker.
6. Publicar o front no Pages.
7. Configurar Cloudflare Access para `/admin`.

## Próximo passo no front

Criar três telas:

- `/`: vitrine e formulário de pedido.
- `/pedido/:code`: acompanhamento do pedido via token.
- `/admin`: painel administrativo protegido pelo Cloudflare Access.


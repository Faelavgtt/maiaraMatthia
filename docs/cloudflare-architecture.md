# Arquitetura Cloudflare

Este projeto pode rodar com o front em Cloudflare Pages e a API em Cloudflare Workers.
Nesta versao temporaria, a API nao usa banco de dados.

## Componentes

- `React + Vite`: site publico, formulario de pedido, acompanhamento e painel.
- `Cloudflare Pages`: hospedagem do front estatico.
- `Cloudflare Workers`: API para pedidos temporarios, uploads e painel.
- `Cloudflare R2`: arquivos enviados pelos clientes.
- `Cloudflare Access`: protecao da rota `/admin` e das rotas administrativas.

## Arquivos

- `wrangler.toml`: configuracao base do Worker e R2.
- `worker/src/index.ts`: rotas temporarias da API sem banco.
- `public/_redirects`: fallback para rotas SPA no Cloudflare Pages.

## Rotas da API

- `GET /health`: teste de disponibilidade.
- `POST /api/orders`: cria pedido temporario e retorna codigo, token, URL de acompanhamento e URL de upload.
- `GET /api/orders/:code?token=...`: indisponivel enquanto o banco estiver removido.
- `PUT /api/orders/:code/files/:kind?token=...`: envia arquivo para R2. `kind` aceita `original`, `preview` ou `final`.
- `GET /api/admin/orders`: retorna lista vazia enquanto o banco estiver removido.
- `PATCH /api/admin/orders/:code/status`: indisponivel enquanto o banco estiver removido.
- `GET /api/admin/files/:fileId`: indisponivel enquanto o banco estiver removido.

## Variaveis

Configure em Cloudflare Workers:

- `APP_ORIGIN`: dominio do front, por exemplo `https://seudominio.com`.
- `ADMIN_EMAILS`: e-mails autorizados separados por virgula.
- `WHATSAPP_NUMBER`: numero em formato internacional, por exemplo `5567999999999`.

## Primeiro deploy

1. Criar o bucket R2.
2. Publicar o Worker.
3. Publicar o front no Pages.
4. Configurar Cloudflare Access para `/admin`.

## Proximo passo no front

Criar tres telas:

- `/`: vitrine e formulario de pedido.
- `/pedido/:code`: acompanhamento do pedido via token.
- `/admin`: painel administrativo protegido pelo Cloudflare Access.

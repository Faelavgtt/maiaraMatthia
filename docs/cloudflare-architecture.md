# Arquitetura Cloudflare

Este projeto pode rodar com o front em Cloudflare Pages/Workers Static Assets e a API em Cloudflare Workers.
A base de dados principal sera um D1 geral do projeto, com tabelas por modulo. A primeira etapa usa a tabela da galeria.

## Componentes

- `React + Vite`: site publico, formulario de pedido, acompanhamento e painel.
- `Cloudflare Workers Static Assets`: hospedagem do front estatico gerado em `dist/`.
- `Cloudflare Workers`: API para pedidos temporarios, uploads e painel.
- `Cloudflare R2`: arquivos enviados pelos clientes.
- `Cloudflare D1`: banco geral do projeto para galeria, pedidos e proximos modulos.
- `Cloudflare Access`: protecao da rota `/admin` e das rotas administrativas.

## Arquivos

- `wrangler.toml`: configuracao base do Worker, assets estaticos e R2.
- `worker/src/index.ts`: rotas da API e conexao com D1/R2.

## Rotas da API

- `GET /health`: teste de disponibilidade.
- `POST /api/orders`: cria pedido temporario e retorna codigo, token, URL de acompanhamento e URL de upload.
- `GET /api/orders/:code?token=...`: indisponivel enquanto as tabelas de pedidos nao forem criadas.
- `PUT /api/orders/:code/files/:kind?token=...`: envia arquivo para R2. `kind` aceita `original`, `preview` ou `final`.
- `GET /api/admin/orders`: retorna lista vazia enquanto as tabelas de pedidos nao forem criadas.
- `PATCH /api/admin/orders/:code/status`: indisponivel enquanto as tabelas de pedidos nao forem criadas.
- `GET /api/admin/files/:fileId`: indisponivel enquanto as tabelas de arquivos nao forem criadas.
- `GET /api/gallery-products`: lista produtos publicados na galeria.
- `GET /api/gallery-images/:key`: entrega imagem da galeria salva no R2.
- `GET /api/admin/gallery-products`: lista produtos para o painel.
- `POST /api/admin/gallery-products`: cadastra produto na galeria.
- `DELETE /api/admin/gallery-products/:id`: remove produto da galeria.
- `PUT /api/admin/gallery-images`: envia imagem da galeria para o R2 e retorna a URL.

## Banco geral

1. Criar o D1:

```bash
npx wrangler d1 create maiara-db
```

2. Adicionar o binding retornado pelo Cloudflare ao `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "maiara-db"
database_id = "COLE-O-ID-AQUI"
migrations_dir = "worker/migrations"
```

O binding precisa ser `DB`, porque ele representa o banco geral do Worker.

3. Aplicar a primeira migration, que cria a tabela da galeria:

```bash
npx wrangler d1 migrations apply maiara-db --remote
```

Para testar localmente:

```bash
npx wrangler d1 migrations apply maiara-db --local
```

## Storage geral

Criar um bucket R2 unico para arquivos do projeto:

```bash
npx wrangler r2 bucket create maiara-files
```

O binding no `wrangler.toml` precisa ser `FILES`. Dentro do bucket, o Worker organiza por pastas:

- `gallery/`: imagens fixa e hover dos produtos da galeria.
- `orders/`: arquivos enviados nos pedidos.

## Variaveis

Configure em Cloudflare Workers:

- `APP_ORIGIN`: dominio do front, por exemplo `https://seudominio.com`.
- `ADMIN_EMAILS`: e-mails autorizados separados por virgula.
- `WHATSAPP_NUMBER`: numero em formato internacional, por exemplo `5567999999999`.

## Primeiro deploy

1. Criar o bucket R2.
2. Rodar `npm run build`.
3. Publicar o Worker com `npx wrangler deploy`.
4. Configurar Cloudflare Access para `/admin`.

## Proximo passo no front

Criar tres telas:

- `/`: vitrine e formulario de pedido.
- `/pedido/:code`: acompanhamento do pedido via token.
- `/admin`: painel administrativo protegido pelo Cloudflare Access.

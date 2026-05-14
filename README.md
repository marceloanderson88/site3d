# 3D Livre — Repositório Gratuito de Peças para Impressão 3D

Plataforma open source e gratuita para compartilhamento, download e descoberta de modelos para impressão 3D.

## Funcionalidades

- **Exploração e busca** — Categorias, busca por nome/tags e filtros por formato, material e licença
- **Download gratuito** — Todos os modelos são gratuitos. Download sem necessidade de login
- **Upload de modelos** — Envie STL, OBJ, 3MF, STEP ou ZIP com imagens de prévia
- **Comentários e avaliações** — Sistema de estrelas (1–5) e comentários autenticados
- **Painel do usuário** — Gerencie seus modelos enviados
- **Área administrativa** — Aprovação, rejeição e moderação de peças
- **13 categorias** — Com páginas dedicadas e contagem de modelos
- **Licenças claras** — CC0, CC BY, CC BY-SA, CC BY-NC, CC BY-NC-SA, Uso Pessoal

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| Backend / DB | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Storage | Supabase Storage |
| Deploy | Vercel |

## Configuração local

### 1. Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuito)

### 2. Clonar e instalar

```bash
git clone <repo-url>
cd site3d
npm install
```

### 3. Variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Preencha `.env.local` com as credenciais do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

### 4. Banco de dados

No **SQL Editor** do Supabase, execute:

```
supabase/migrations/001_initial_schema.sql
```

Isso cria todas as tabelas, políticas RLS, triggers e as 13 categorias iniciais.

### 5. Storage

No painel do Supabase > **Storage**:
1. Crie um bucket `models` com **Public** habilitado
2. Adicione as políticas:

```sql
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'models');
CREATE POLICY "Auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'models' AND auth.role() = 'authenticated');
```

### 6. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Deploy no Vercel

1. Importe o repositório no [vercel.com](https://vercel.com)
2. Adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Clique em **Deploy**
4. No Supabase > **Authentication → URL Configuration**, adicione:
   - Site URL: `https://seu-dominio.vercel.app`
   - Redirect URLs: `https://seu-dominio.vercel.app/auth/callback`

## Criar conta administrador

Após criar uma conta normal, execute no SQL Editor do Supabase:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'seu-user-id';
```

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx                  # Home
│   ├── explorar/                 # Listagem com filtros e busca
│   ├── categorias/[slug]/        # Página de categoria
│   ├── pecas/[slug]/             # Detalhes da peça
│   ├── enviar/                   # Upload de modelo
│   ├── login/ e cadastro/        # Autenticação
│   ├── minha-conta/              # Perfil e gerenciamento
│   ├── admin/                    # Painel administrativo
│   ├── sobre/ e termos/          # Páginas institucionais
│   └── auth/callback/            # OAuth callback
├── components/
│   ├── layout/                   # Header, Footer
│   ├── ui/                       # Button, Input, Select, Toast, etc.
│   ├── models/                   # ModelCard, CommentsSection, RatingSection
│   └── admin/                    # AdminActions
├── lib/
│   ├── supabase/                 # Clients (server, client, middleware)
│   ├── models.ts                 # Helpers de consulta
│   └── utils.ts                  # Utilitários e constantes
└── types/index.ts                # Tipos TypeScript
```

## Banco de dados

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Extensão do auth.users |
| `categories` | 13 categorias pré-definidas |
| `models` | Modelos 3D com metadados de impressão |
| `model_images` | Imagens adicionais |
| `tags` + `model_tags` | Sistema de tags |
| `comments` | Comentários dos usuários |
| `ratings` | Avaliações 1–5 (única por usuário/modelo) |
| `reports` | Denúncias de conteúdo |
| `downloads` | Registro de downloads |

## Aviso

Os modelos são enviados pela comunidade. Verifique sempre a segurança e adequação antes de imprimir, especialmente peças estruturais ou de uso médico.

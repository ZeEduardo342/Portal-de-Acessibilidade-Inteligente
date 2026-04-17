# Arquitetura - Portal de Acessibilidade Inteligente

## Visão Geral

A plataforma é construída com uma arquitetura em três camadas:

1. **Camada de Interface (Frontend)**: Portal web com design sofisticado em geometria sagrada, adaptado para três perfis de usuário (colaborador, gestor, admin)
2. **Camada de Lógica (Backend)**: APIs tRPC com procedures para gerenciar demandas, IA, notificações e integração entre áreas
3. **Camada de Dados (Database)**: MySQL com schema normalizado para demandas, usuários, documentos, histórico e notificações

## Stack Tecnológico

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | React 19 + Tailwind CSS 4 + TypeScript |
| Backend | Express 4 + tRPC 11 + Node.js |
| Database | MySQL/TiDB via Drizzle ORM |
| Autenticação | Manus OAuth + JWT |
| IA | LLM integrado (Manus Built-in API) |
| Armazenamento | S3 (Manus Storage) |
| Notificações | Sistema de notificações integrado |

## Modelo de Dados - Tabelas Principais

### users
Usuários com perfis diferenciados (colaborador, gestor, admin).

```
id (PK) | openId | name | email | role | department | createdAt | updatedAt
```

### demands (Demandas)
Registro centralizado de todas as solicitações de acessibilidade.

```
id (PK) | userId (FK) | title | description | type | category | status | priority
assignedArea | createdAt | updatedAt | resolvedAt | notes
```

**Tipos de demanda**: física, digital, comunicação, ergonomia, outro
**Categorias**: barreira arquitetônica, tecnológica, atitudinal, comunicacional
**Status**: aberta, triada, encaminhada, em_progresso, resolvida, fechada
**Áreas**: RH, Saúde, TI, Ergonomia, Facilities

### demand_history
Histórico de mudanças de status para auditoria e notificações.

```
id (PK) | demandId (FK) | previousStatus | newStatus | changedBy (FK) | changedAt | notes
```

### documents
Armazenamento de referências a laudos, relatórios e documentos.

```
id (PK) | demandId (FK) | userId (FK) | fileName | fileKey | fileUrl | documentType
uploadedAt | accessibleTo
```

**Tipos de documento**: laudo_médico, relatório_ergonômico, foto_posto, outro

### knowledge_base
Base de conhecimento com artigos, normas e boas práticas.

```
id (PK) | title | content | category | tags | source | createdAt
```

**Categorias**: norma_abnt, lei_brasileira_inclusao, boa_prática, guia

### ergonomic_assessments
Avaliações ergonômicas estruturadas.

```
id (PK) | userId (FK) | demandId (FK) | responses (JSON) | recommendations (JSON)
aiGeneratedAt | createdAt
```

### notifications
Sistema de notificações por mudança de status.

```
id (PK) | userId (FK) | demandId (FK) | type | message | read | createdAt
```

## Fluxo de Demandas

```
1. Colaborador cria demanda via formulário
   ↓
2. IA classifica automaticamente (tipo, categoria, prioridade)
   ↓
3. Sistema encaminha para área responsável
   ↓
4. Gestor da área recebe notificação e pode aceitar/rejeitar
   ↓
5. Se aceita: demanda vai para "em_progresso"
   ↓
6. Gestor atualiza status e adiciona notas
   ↓
7. Notificações disparadas em cada mudança
   ↓
8. Demanda resolvida → histórico e base de conhecimento atualizada
```

## Perfis de Acesso e Permissões

| Ação | Colaborador | Gestor | Admin |
|------|------------|--------|-------|
| Criar demanda | ✓ | ✓ | ✓ |
| Visualizar próprias demandas | ✓ | ✓ | ✓ |
| Visualizar demandas da área | ✗ | ✓ | ✓ |
| Visualizar todas demandas | ✗ | ✗ | ✓ |
| Atualizar status | ✗ | ✓ | ✓ |
| Acessar base de conhecimento | ✓ | ✓ | ✓ |
| Fazer avaliação ergonômica | ✓ | ✓ | ✓ |
| Gerar relatórios | ✗ | ✓ | ✓ |
| Gerenciar usuários | ✗ | ✗ | ✓ |
| Gerenciar base de conhecimento | ✗ | ✗ | ✓ |

## Rotas tRPC Principais

### auth
- `me`: Obter usuário autenticado
- `logout`: Fazer logout

### demands
- `create`: Criar nova demanda
- `list`: Listar demandas (com filtros por perfil)
- `getById`: Obter detalhes de demanda
- `updateStatus`: Atualizar status (apenas gestor/admin)
- `getHistory`: Obter histórico de mudanças
- `getByArea`: Listar demandas de uma área (gestor/admin)
- `getMetrics`: Obter métricas consolidadas (admin)

### ai
- `classifyDemand`: Classificar demanda automaticamente
- `recommendSolution`: Recomendar solução baseada em histórico
- `generateErgonomicRecommendations`: Gerar recomendações ergonômicas

### ergonomic
- `createAssessment`: Criar avaliação ergonômica
- `getAssessment`: Obter avaliação
- `getRecommendations`: Obter recomendações geradas

### knowledge
- `list`: Listar artigos da base de conhecimento
- `search`: Buscar por termo
- `getByCategory`: Filtrar por categoria

### documents
- `upload`: Upload de documento
- `getByDemand`: Listar documentos de uma demanda
- `delete`: Deletar documento (apenas criador/admin)

### notifications
- `list`: Listar notificações do usuário
- `markAsRead`: Marcar como lida

### reports
- `getDemandMetrics`: Métricas de demandas
- `getResolutionTime`: Tempo médio de resolução
- `getAreaPerformance`: Performance por área
- `exportData`: Exportar dados em CSV/Excel

## Integração com LLM

A IA é usada em três pontos principais:

1. **Classificação de Demandas**: Ao criar uma demanda, o LLM analisa título e descrição para classificar tipo, categoria e prioridade
2. **Recomendação de Soluções**: Baseado no histórico de demandas similares, o LLM recomenda soluções já testadas
3. **Avaliação Ergonômica**: O LLM analisa respostas do formulário e gera recomendações personalizadas

## Design Visual - Geometria Sagrada

- **Fundo**: Creme quente (#F5E6D3)
- **Linhas Decorativas**: Dourado fino (#D4AF37) em espiral áurea e círculos intersectados
- **Títulos**: Sans-serif bold azul-marinho escuro (#1A3A52)
- **Subtítulos**: Dourado elegante (#D4AF37)
- **Acentos**: Azul-marinho para CTAs e destaques
- **Espaçamento**: Baseado em proporção áurea (1.618)

## Segurança

- **Autenticação**: OAuth Manus + JWT
- **Autorização**: Role-based access control (RBAC) por perfil
- **Documentos Sensíveis**: Armazenados em S3 com controle de acesso vinculado ao perfil
- **Auditoria**: Histórico completo de mudanças em demand_history
- **Notificações**: Apenas usuários com acesso à demanda recebem notificações

## Escalabilidade

- Queries otimizadas com índices em demandId, userId, status
- Paginação em listagens
- Cache de base de conhecimento
- Processamento assíncrono de IA via background jobs (futuro)

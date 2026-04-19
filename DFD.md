# Diagrama de Fluxo de Dados (DFD) - apLIS

Este documento descreve o fluxo de dados da aplicação apLIS, detalhando como as informações transitam entre o usuário, o frontend, as APIs e o banco de dados.

## 1. Representação Visual (Mermaid)

*Abaixo está o DFD em sintaxe Mermaid. Visualizadores de Markdown compatíveis (como GitHub) renderizarão este diagrama automaticamente.*

```mermaid
graph TD
    %% Entidades Externas
    User((Usuário / \n Atendente))

    %% Processos (Frontend)
    subgraph "Camada de Apresentação"
        UI_M[1.0 Gerenciar \n Médicos \n React]
        UI_P[2.0 Gerenciar \n Pacientes \n React]
    end

    %% Processos (Backends)
    subgraph "Camada de Serviços (APIs)"
        API_M[1.1 API PHP \n MedicoController]
        API_P[2.1 API Node.js \n PacienteController]
    end

    %% Armazenamento de Dados (MySQL)
    subgraph "Banco de Dados (aplis_db)"
        DB_M[(D1: Tabela \n medicos)]
        DB_P[(D2: Tabela \n pacientes)]
    end

    %% Fluxos Usuário <-> Frontend
    User -->|Dados de Médico \n Ações (Criar, Editar, Excluir)| UI_M
    UI_M -->|Listagem, Alertas, \n Confirmações| User
    
    User -->|Dados de Paciente \n Ações (Criar, Editar, Excluir)| UI_P
    UI_P -->|Listagem, Alertas, \n Confirmações| User

    %% Fluxos Frontend <-> Backends
    UI_M -->|Req HTTP (JSON) \n GET, POST, PUT, DELETE \n /api/v1/medicos| API_M
    API_M -->|Res HTTP (JSON) \n 200, 201, 400, 404, 500| UI_M

    UI_P -->|Req HTTP (JSON) \n GET, POST, PUT, DELETE \n /api/v1/pacientes| API_P
    API_P -->|Res HTTP (JSON) \n 200, 201, 404, 500| UI_P

    %% Fluxos Backends <-> Banco de Dados
    API_M -->|Queries SQL \n INSERT, SELECT, UPDATE \n (Soft Delete)| DB_M
    DB_M -->|Linhas Afetadas / \n Result Sets| API_M

    API_P -->|Queries SQL \n INSERT, SELECT, UPDATE \n (Soft Delete)| DB_P
    DB_P -->|Linhas Afetadas / \n Result Sets| API_P
```

---

## 2. Representação Textual

### DFD - Nível 0 (Diagrama de Contexto)
O Nível 0 mostra o sistema como um único processo principal interagindo com o mundo exterior.
*   **Entidade Externa:** Usuário (Atendente / Administrador)
*   **Processo 0:** Sistema apLIS (Gerenciamento Clínico)
*   **Fluxos de Dados:**
    *   `Usuário` **envia** *Dados de Cadastro, Comandos de Edição e Exclusão* **para** `Processo 0`.
    *   `Processo 0` **envia** *Listagens de Médicos e Pacientes, Alertas de Sucesso/Erro* **para** `Usuário`.

---

### DFD - Nível 1 (Visão Arquitetural)
O Nível 1 expande o Processo 0 em subprocessos (frontend e backends) e revela o banco de dados.

#### 1. Entidades Externas
*   **E1:** Usuário

#### 2. Processos
*   **P1.0:** Aplicação Frontend (React / Vite SPA)
*   **P2.0:** API de Gerenciamento de Médicos (Vanilla PHP)
*   **P3.0:** API de Gerenciamento de Pacientes (Node.js / Express)

#### 3. Armazenamentos de Dados (Data Stores)
*   **D1:** Banco de Dados MySQL - Tabela `medicos`
*   **D2:** Banco de Dados MySQL - Tabela `pacientes`

#### 4. Fluxos de Dados Principais
**Interação do Usuário (Frontend):**
*   `E1 (Usuário)` **->** *Preenchimento de Formulários, Cliques em Botões (CRUD)* **->** `P1.0 (Aplicação Frontend)`
*   `P1.0 (Aplicação Frontend)` **->** *Renderização de Tabelas, Mensagens de Validação e Feedback* **->** `E1 (Usuário)`

**Comunicação Frontend com APIs:**
*   `P1.0 (Aplicação Frontend)` **->** *Requisições HTTP (GET, POST, PUT, DELETE) via `/api/v1/medicos`* **->** `P2.0 (API Médicos PHP)`
*   `P1.0 (Aplicação Frontend)` **->** *Requisições HTTP (GET, POST, PUT, DELETE) via `/api/v1/pacientes`* **->** `P3.0 (API Pacientes Node.js)`

**Acesso a Dados (APIs <-> Banco de Dados):**
*   `P2.0 (API Médicos PHP)` **<->** *Comandos SQL via PDO / Result Sets (Linhas do banco)* **<->** `D1 (Tabela medicos)`
*   `P3.0 (API Pacientes Node.js)` **<->** *Comandos SQL via db.execute / Result Sets (Linhas do banco)* **<->** `D2 (Tabela pacientes)`

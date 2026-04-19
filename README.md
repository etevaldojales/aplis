# Projeto apLIS - Fullstack

Esta é uma aplicação fullstack simples para o gerenciamento de Médicos e Pacientes, desenvolvida como parte de um teste prático. A aplicação utiliza uma arquitetura baseada em microsserviços (dois backends independentes) e um frontend Single Page Application (SPA).

## 🏗 Arquitetura do Projeto

O projeto é composto por três camadas principais que se comunicam com um banco de dados MySQL compartilhado:

1. **Frontend (React com Vite):** Interface de usuário para visualizar, cadastrar, editar e excluir médicos e pacientes.
2. **Backend JS (Node.js/Express):** API REST responsável pelo gerenciamento de **Pacientes**.
3. **Backend PHP (Vanilla PHP):** API REST responsável pelo gerenciamento de **Médicos**.
4. **Banco de Dados (MySQL):** Banco de dados relacional compartilhado entre os dois backends.

### Funcionalidades Implementadas (CRUD Completo)
- Listagem de registros
- Cadastro de novos registros
- Edição de registros existentes (Update)
- Exclusão lógica de registros (Soft Delete)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** (v16 ou superior)
- **PHP** (v7.4 ou superior)
- **MySQL** (Recomendado o uso do XAMPP)

### 1. Configuração do Banco de Dados
1. Inicie o servidor MySQL (via painel do XAMPP, por exemplo).
2. Crie um banco de dados chamado `aplis_db` (ou o nome configurado nos seus arquivos de banco).
3. Execute os scripts SQL para criar as tabelas `medicos` e `pacientes`.
   *Importante: Certifique-se de que ambas as tabelas possuam a coluna `deleted_at DATETIME NULL DEFAULT NULL` para suportar a exclusão lógica (Soft Delete).*
   *Para a tabela de pacientes, recomenda-se usar `DATE` na coluna `dataNascimento`.*

### 2. Executando o Backend de Pacientes (Node.js)
Abra um terminal e navegue até a pasta `backendjs`:
```bash
cd backendjs
npm install
npm start # ou node server.js/index.js
```
A API de pacientes estará rodando em `http://localhost:3000`.

### 3. Executando o Backend de Médicos (PHP)
Abra um novo terminal e navegue até a pasta `backendphp`:
```bash
cd backendphp
php -S localhost:8000
```

- `POST /api/v1/medicos`: cria um novo médico enviando o body do exemplo abaixo e retornando a mensagem "Médico criado com sucesso".

```json
    {
        "id": 1,
        "nome": "João da Silva",
        "CRM": "123456",
        "UFCRM": "CE"
    }
```

O segundo backend deverá ser desenvolvido em NodeJS (JavaScript) e contemplar as seguintes rotas:
- `GET /api/v1/pacientes`: obtém todos os pacientes retornando conforme exemplo abaixo: 

```json
    [
        {
            "id": 1,
            "nome": "João da Silva",
            "dataNascimento": "2026-01-01",
            "carteirinha": "123456",
            "cpf": "12345678909"
        },
        {
            "id": 2,
            "nome": "Francisco Pereira",
            "carteirinha": "876543",
            "cpf": "12345678901"
        }
    ]
```

- `POST /api/v1/pacientes`: cria um novo paciente enviando o body do exemplo abaixo e retornando a mensagem "Paciente criado com sucesso".

```json
    {
        "id": 1,
        "nome": "João da Silva",
        "dataNascimento": "2026-01-01",
        "carteirinha": "123456",
        "cpf": "12345678909"
    },
```

O frontend deve consumir ambas as APIs, permitindo visualizar listas de médicos e pacientes separadamente, além de possibilitar o cadastro de novos registros. O candidato deverá organizar o projeto em três partes (frontend, backend Node e backend PHP), garantir a integração entre as camadas e manter o código legível e funcional.

A tela deve mostrar um menu sidebar à esquerda com duas opções (Médicos e Pacientes), que quando clicado abre a tela de listagem e criação dos registros.

A avaliação considerará principalmente o funcionamento ponta a ponta da aplicação, a correta integração entre os serviços, a organização do código e, como diferencial, boas práticas, tratamento de erros e clareza na documentação. O tempo estimado para conclusão é de 6 a 10 horas.


# Desafio extra 

- Crie as demais operações CRUD
- Deixe o projeto pronto para multi linguagem, tanto no backend quanto no frontend.

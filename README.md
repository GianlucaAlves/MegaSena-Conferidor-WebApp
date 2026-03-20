# Mega-Sena Full Stack App

Este projeto é um sistema completo para consulta de resultados da Mega-Sena, desenvolvido com foco em engenharia de software, portabilidade e experiência do usuário. Permite pesquisar o resultado mais recente ou de qualquer concurso, exibindo os números sorteados e a data de forma clara e visual.

O sistema é composto por:
- **Frontend** moderno em React e TypeScript, com interface responsiva e estilização avançada.
- **Backend** robusto em Node.js e Express, fornecendo uma API REST para consulta dos concursos.
- **Banco de dados** PostgreSQL, garantindo persistência e integridade dos dados.
- **Orquestração via Docker Compose**, facilitando a execução, testes e compartilhamento sem necessidade de instalação manual de dependências.

Ideal para estudos, demonstrações, conferência de apostas e aplicação de boas práticas de desenvolvimento.

---

## 1. Visão Geral

Sistema completo para consulta de resultados da Mega-Sena, com frontend moderno, backend robusto e persistência de dados. Orquestrado via Docker Compose para garantir portabilidade e facilidade de execução.

**Tecnologias:**

- Frontend: React + TypeScript + Styled Components
- Backend: Node.js + TypeScript + Express
- Banco de Dados: PostgreSQL
- Orquestração: Docker Compose (3 containers)

---

## 2. User Stories

- **Usuário final:**
  - Como apostador, quero consultar o resultado mais recente da Mega-Sena, para saber se fui premiado.
  - Como apostador, quero pesquisar o resultado de um concurso específico, para conferir apostas antigas.
  - Como usuário, quero uma interface simples e responsiva, para acessar de qualquer dispositivo.

- **Administrador:**
  - Como admin, quero que o sistema seja fácil de instalar e rodar, sem dependências manuais.
  - Como admin, quero que os dados sejam persistentes e seguros.

---

## 3. Requisitos Funcionais

1. O sistema deve permitir consultar o resultado mais recente da Mega-Sena.
2. O sistema deve permitir pesquisar o resultado de um concurso pelo número.
3. O frontend deve exibir os números sorteados, data e número do concurso.
4. O backend deve expor rotas REST para consulta dos concursos.
5. O banco de dados deve armazenar todos os resultados.
6. O sistema deve exibir mensagens de erro claras para consultas inválidas.

---

## 4. Requisitos Não Funcionais

1. O sistema deve ser executável via Docker Compose, sem instalação manual de dependências.
2. O backend deve ser implementado em TypeScript, seguindo boas práticas de tipagem e modularização.
3. O frontend deve ser responsivo e utilizar Styled Components para separação de estilos.
4. O banco de dados deve persistir dados em volume local.
5. O sistema deve ser facilmente compartilhável (ZIP ou repositório).
6. O código deve ser limpo, documentado e organizado.

---

## 5. Arquitetura e Estrutura

```
atividade03/
├── backend/           # API Express + TS
│   ├── index.ts       # Entry point
│   ├── ds.ts          # Conexão PostgreSQL
│   ├── routes/        # Rotas REST
│   ├── Dockerfile     # Container backend
│   └── .env           # Configuração local
├── src/               # Frontend React
│   ├── App.tsx        # Lógica principal
│   ├── styles/        # Styled Components
│   └── assets/        # Imagens e ícones
├── data/              # Volume persistente do Postgres
├── Dockerfile         # Container frontend
├── docker-compose.yml # Orquestração
├── .env               # Variáveis globais
└── README.md          # Documentação
```

---

## 6. Instruções de Uso

### Subir com Docker Compose

1. Garanta que o Docker Desktop esteja aberto.
2. Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

3. Acesse:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3334
   - Postgres: localhost:5433

### Parar os containers

```bash
docker compose down
```

---

## 7. Configuração de Ambiente

As variáveis de ambiente são configuradas automaticamente pelo Docker Compose. Não é necessário editar arquivos manualmente para rodar o sistema.

---

## 8. Testes e Validação

- **Validação manual:**
  - Acesse o frontend e consulte concursos.
  - Teste rotas backend via navegador ou curl:
    - `GET /concurso/mais-recente`
    - `GET /concurso/:numero`
- **Validação Docker:**
  - Todos os containers devem estar “healthy” (`docker compose ps`).
  - Dados do Postgres persistem após reinício.
- **Validação de requisitos:**
  - Todos os requisitos funcionais e não funcionais foram implementados.

---

## 9. Referências e Observações

- Backend lê variáveis do compose (host do banco = `postgres`).
- Frontend e backend usam variáveis de ambiente configuradas pelo Docker Compose.
- Postgres usa volume persistente em `data/`.
- Código refatorado para separação de estilos e lógica.
- Pronto para ser compartilhado e executado em qualquer ambiente com Docker.

---

##10. Imagens 

<img width="1875" height="992" alt="image" src="https://github.com/user-attachments/assets/b6af83e0-cc73-4e5d-81ff-207ce75623a3" />

<img width="1874" height="987" alt="image" src="https://github.com/user-attachments/assets/dcbbeb9e-22a0-4c9c-ad25-a1fef70bb2f7" />

<img width="1865" height="995" alt="image" src="https://github.com/user-attachments/assets/45aee012-313a-4da4-9464-dfc20af1bb9f" />

<img width="1877" height="996" alt="image" src="https://github.com/user-attachments/assets/3103dc13-add6-4434-b7eb-83d26548d762" />





**Autor:** Gianluca Lourenço Alves

# Projeto de Automação — Filtros de Pesquisa (PCP Homologação)

Este projeto tem como objetivo validar o comportamento funcional dos **filtros de pesquisa** do portal de compras públicas utilizando **Cypress**.  
Os testes seguem o padrão **Page Object Model (POM)** e são documentados em **Gherkin** para garantir clareza e rastreabilidade.

---

## 📂 Estrutura do Projeto

auto-test-pcp/ \
├── cypress/ \
│ ├── e2e/ \
│ │ ├── page # Organização dos comando utilizados em teste \
│ │ └── test # Casos de testes automatizados \
│ ├── fixtures/ \
│ │ └── searchElements.json # organização dos elementos da página index \
│ ├── support/ \
│ │ ├── commands.js \
│ │ └── e2e.js  \
├── testeDoc.md # Documentação de cenários de teste (Gherkin) \
├── package.json \
├── cypress.config.js \
└── README.md \


---

## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- [Node.js (>=18)](https://nodejs.org/)
- [Git](https://git-scm.com/install/)
- NPM (instalado junto com o Node)

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/QaLemos92/auto-test-nginx.git
cd auto-test-nginx
npm install
```

## Executando os Testes

1. Executar em modo interativo (interface do Cypress)
Abre o painel gráfico para escolher e acompanhar os testes:
```bash
npx cypress open
```
Após abrir a interface, selecione E2E Testing e escolha o navegador para execução.

2. Executar em modo headless (linha de comando)
Executa todos os testes diretamente no terminal, ideal para pipelines CI/CD:
```bash
npx cypress run
```
Para um navegador específico (ex: Chrome):
```bash
npx cypress run --browser chrome
```
Para mais detalhes sobre o teste, acesse o [Documento de teste](https://github.com/QaLemos92/auto-test-nginx/blob/main/TestDocs.md)

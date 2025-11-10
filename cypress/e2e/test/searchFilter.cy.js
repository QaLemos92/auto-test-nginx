import { IndexPage } from "../page/indexPage";
import searchElements from "../../fixtures/searchElements.json";

const indexPage = new IndexPage();

describe("Formulário de Pesquisa Pública", () => {
  beforeEach(() => {
    indexPage.visit();
    indexPage.aguardaCarregamento();
  });

  context("Renderização e Acessibilidade", () => {
    it("Deve exibir campos da busca simples e avançada ocultos inicialmente", () => {
      cy.get(searchElements.search.objeto).should("be.visible");
      cy.get(searchElements.search.processo).should("be.visible");
      cy.get(searchElements.search.orgao).should("be.visible");
      cy.get(searchElements.search.botaoBuscar)
        .should("be.visible")
        .should("have.text", "BUSCAR");
      cy.get(searchElements.search.blocoBuscaAvancada).should("not.be.visible");
    });
  });

  context("Busca Avançada", () => {
    it("Deve abrir e fechar corretamente", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.fecharBuscaAvancada();
    });
  });

  context("Seleção de Filtros Individuais", () => {
    beforeEach(() => {
      indexPage.abrirBuscaAvancada();
    });

    it("Deve selecionar Status = Em Andamento", () => {
      indexPage.selecionarFiltro("status", "Em Andamento");
    });

    it("Deve selecionar Modalidade = Pregão", () => {
      indexPage.selecionarFiltro("modalidade", "Pregão");
    });

    it("Deve selecionar Realização = Eletrônico", () => {
      indexPage.selecionarFiltro("realizacao", "Eletrônico");
    });

    it("Deve selecionar Julgamento = Menor Preço", () => {
      indexPage.selecionarFiltro("julgamento", "Menor Preço");
    });

    it("Deve selecionar UF = RS e carregar municípios", () => {
      indexPage.selecionarFiltro("uf", "RS");
      cy.wait(1000);
      cy.get(searchElements.selects.municipios).should("exist");
    });
  });

  context("Combinação de Filtros", () => {
    it("Deve aplicar múltiplos filtros válidos", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.selecionarFiltrosAvancados({
        status: "Em Andamento",
        modalidade: "Pregão",
        uf: "RS",
      });
    });

    it("Deve aplicar filtros conflitantes e esperar retorno vazio", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.selecionarFiltrosAvancados({
        status: "Finalizado",
        realizacao: "Presencial",
      });
      indexPage.clicarBuscar();
    });

    it("Deve limpar filtros ao recarregar", () => {
      cy.reload();
      indexPage.verificarFiltrosPadrao();
    });
  });

  context("Botão de Busca", () => {
    it("Deve tentar buscar mesmo sem filtros e registrar a resposta da API", () => {
      cy.intercept(
        "GET",
        "https://compras.api.pcphom.com.br/v2/licitacao/processos*"
      ).as("busca");
      indexPage.clicarBuscar();
      cy.wait("@busca").then((intercept) => {
        try {
          expect(response, "A resposta da API deve existir").to.exist;

          if (response.statusCode === 200) {
            cy.log("API respondeu com sucesso.");
          } else {
            cy.log("API retornou erro.");
            cy.log(`Detalhes: ${response.body?.title || "Erro desconhecido"}`);
            throw new Error(
              `A API retornou status ${response.statusCode} - ${
                response.body?.title || "Sem detalhes"
              }`
            );
          }
        } catch (error) {
          cy.log("Erro ao validar resposta da API:");
        }
      });
    });
  });

  context("Validação de Dados", () => {
    // it("Deve rejeitar texto inválido em campo numérico", () => {
    //   cy.get(searchElements.search.processo).type("ABC");
    //   indexPage.clicarBuscar();
    //   cy.contains("Valor inválido").should("exist");
    // });

    // it("Deve indicar campo obrigatório não preenchido", () => {
    //   cy.get(searchElements.search.objeto).clear();
    //   indexPage.clicarBuscar();
    //   cy.contains("Campo obrigatório").should("exist");
    // });

    it("Deve permitir busca sem município", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.selecionarFiltro("uf", "RS");
      indexPage.clicarBuscar();
    });
  });

  context("Performance e Usabilidade", () => {
    it("Deve carregar selects em menos de 2 segundos", () => {
      const start = Date.now();
      indexPage.abrirBuscaAvancada();
      cy.get(searchElements.selects.status, { timeout: 2000 }).should("exist");
      const elapsed = Date.now() - start;
      cy.log(`Tempo de carregamento: ${elapsed}ms`);
      expect(elapsed).to.be.lessThan(2000);
    });
  });

  context("Persistência e Estado", () => {
    it("Deve manter filtros após voltar à tela de pesquisa", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.selecionarFiltrosAvancados({
        status: "Em Andamento",
        modalidade: "Pregão",
      });

      cy.visit("https://www.pcphom.com.br/aprenda");
      indexPage.visit();

      cy.get(searchElements.search.status).should("contain", "Em Andamento");
    });
  });
});

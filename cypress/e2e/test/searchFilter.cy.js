import { IndexPage } from "../page/indexPage";
import searchElements from "../../fixtures/searchElements.json";

const indexPage = new IndexPage();

describe("Formulário de Pesquisa Pública", () => {
  beforeEach(() => {
    indexPage.visit();
  });

  context("Renderização dos Campos", () => {
    it("Deve renderizar todos os campos básicos", () => {
      cy.get(searchElements.search.objeto).should("exist");
      cy.get(searchElements.search.processo).should("exist");
      cy.get(searchElements.search.orgao).should("exist");
      cy.contains("BUSCAR").should("be.visible");
    });
  });

  context("Busca Avançada", () => {
    it("Deve abrir e fechar a busca avançada", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.fecharBuscaAvancada();
    });

    it("Deve permitir selecionar múltiplos filtros", () => {
      indexPage.abrirBuscaAvancada();
      indexPage.selecionarFiltrosAvancados({
        status: "Em Andamento",
        modalidade: "Pregão",
        realizacao: "Eletrônico",
        julgamento: "Menor Preço",
        uf: "RS",
      });
    });
  });

  context("Campos de Entrada", () => {
    it("Deve aceitar entradas válidas", () => {
      indexPage.preencherCamposBasicos(
        "Computador",
        "12345/2025",
        "Prefeitura de Porto Alegre"
      );
    });
  });

  context("Botão de Busca", () => {
    it('Deve executar busca ao clicar em "BUSCAR"', () => {
      cy.intercept("GET", "/processos*").as("busca");
      indexPage.clicarBuscar();
      cy.wait("@busca").its("response.statusCode").should("eq", 200);
    });
  });
});

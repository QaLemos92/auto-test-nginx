# Documentação de Casos de Teste — Filtros de Pesquisa

Este documento descreve os casos de teste relacionados aos filtros de pesquisa do portal, com base em critérios funcionais, não funcionais e de qualidade definidos pela norma ISO/IEC 25010.

## 1. Escopo

Os testes aqui descritos abrangem exclusivamente o comportamento dos filtros de pesquisa, incluindo busca simples e busca avançada, cobrindo:

- Renderização e acessibilidade dos elementos
- Comportamento funcional dos filtros
- Combinações e interações entre campos
- Validação de entrada de dados
- Persistência e estado
- Performance e usabilidade

## 2. Referências de Qualidade (ISO/IEC 25010)

- **Funcionalidade**: O sistema deve permitir que todos os filtros operem corretamente e retornem resultados coerentes.
- **Confiabilidade**: Os filtros devem se comportar de forma consistente, mesmo diante de entradas incorretas.
- **Usabilidade**: Todos os campos e labels devem ser claros, acessíveis e utilizáveis.
- **Eficiência**: O carregamento dos componentes e resultados deve ocorrer em tempo adequado.
- **Compatibilidade**: Os filtros devem se comportar adequadamente em diferentes navegadores e dispositivos.

---

## 3. Casos de Teste em Gherkin

### 3.1 Renderização e Acessibilidade

```gherkin

Funcionalidade: Renderização dos filtros de pesquisa
  Cenário: Exibir todos os campos da busca simples e avançada
    Dado que o usuário acessa a página de pesquisa
    Então os campos "Objeto", "Processo" e "Órgão" devem estar visíveis
    E o botão "BUSCAR" deve estar disponível
    E a seção "Busca Avançada" deve estar oculta inicialmente
```

### 3.2 Busca Avançada (Exibição e Interação)

```gherkin
Funcionalidade: Exibição da busca avançada
  Cenário: Abrir e fechar a busca avançada
    Dado que o usuário está na página de pesquisa
    Quando ele clicar em "Busca Avançada"
    Então os filtros avançados devem ser exibidos
    Quando clicar novamente em "Busca Avançada"
    Então os filtros avançados devem ser ocultados
```

### 3.3 Seleção de Filtros Individuais

```gherkin

Funcionalidade: Seleção de filtros
  Cenário: Selecionar um status válido
    Dado que a busca avançada está aberta
    Quando o usuário selecionar o filtro "Status = Em Andamento"
    Então o sistema deve registrar o filtro corretamente

  Cenário: Selecionar modalidade
    Quando o usuário selecionar "Modalidade = Pregão"
    Então o filtro deve refletir a escolha

  Cenário: Selecionar forma de realização
    Quando o usuário selecionar "Realização = Eletrônico"
    Então o sistema deve atualizar a busca conforme o filtro

  Cenário: Selecionar tipo de julgamento
    Quando o usuário selecionar "Julgamento = Menor Preço"
    Então a seleção deve permanecer salva

  Cenário: Selecionar Unidade Federativa (UF)
    Quando o usuário selecionar "RS"
    Então os municípios correspondentes devem ser carregados
```

### 3.4 Combinações de Filtros

```gherkin
Funcionalidade: Combinação de filtros
  Cenário: Selecionar múltiplos filtros válidos
    Dado que a busca avançada está aberta
    Quando o usuário selecionar "Status = Em Andamento"
    E selecionar "Modalidade = Pregão"
    E selecionar "UF = RS"
    Então o sistema deve aplicar todos os filtros simultaneamente

  Cenário: Aplicar filtros conflitantes
    Dado que o usuário seleciona "Status = Encerrado"
    E seleciona "Data de Realização = Futuro"
    Então o sistema deve exibir mensagem de conflito ou resultados vazios

  Cenário: Limpar filtros ao recarregar
    Dado que o usuário recarrega a página
    Então todos os filtros devem voltar ao valor padrão
```

### 3.5 Botão de Busca

```gherkin
Funcionalidade: Ação do botão de busca
  Cenário: Executar pesquisa com filtros preenchidos
    Dado que o usuário selecionou múltiplos filtros válidos
    Quando ele clicar em "BUSCAR"
    Então o sistema deve enviar uma requisição para "/processos"
    E exibir resultados compatíveis com os filtros aplicados

  Cenário: Buscar sem preencher filtros
    Dado que nenhum filtro foi selecionado
    Quando clicar em "BUSCAR"
    Então o sistema deve retornar todos os registros disponíveis
```

### 3.6 Validação de Dados

```gherkin
Funcionalidade: Validação de entrada nos filtros
  Cenário: Inserir texto inválido em campo numérico
    Quando o usuário digitar "ABC" no campo "Número do Processo"
    Então o sistema deve exibir mensagem de erro ou ignorar o valor

  Cenário: Campo obrigatório não preenchido
    Dado que o campo "Objeto" é obrigatório
    Quando o usuário clicar em "BUSCAR" sem preencher
    Então o sistema deve indicar que o campo é obrigatório

  Cenário: Selecionar UF sem selecionar Município
    Quando o usuário escolhe "RS" e não escolhe "Município"
    Então o sistema deve continuar permitindo a busca normalmente
```

### 3.7 Performance e Usabilidade

```gherkin
Funcionalidade: Desempenho e usabilidade dos filtros
  Cenário: Carregamento rápido dos selects
    Dado que o usuário abre a busca avançada
    Então os selects devem ser carregados em menos de 2 segundos

  Cenário: Responsividade em dispositivos móveis
    Dado que o usuário acessa via celular
    Então todos os campos e filtros devem se ajustar corretamente à tela
```

### 3.8 Persistência e Estado

```gherkin
Funcionalidade: Persistência dos filtros
  Cenário: Manter filtros após voltar à tela de pesquisa
    Dado que o usuário aplicou filtros e navegou para outra página
    Quando ele retornar à pesquisa
    Então os filtros aplicados anteriormente devem permanecer selecionados
```

### 4. Considerações Finais

Este conjunto de cenários cobre os principais comportamentos esperados dos filtros de pesquisa.

Os testes devem ser automatizados preferencialmente com Cypress, utilizando o padrão Page Objects e arquivos de elementos separados em JSON.

O uso do Gherkin visa padronizar a comunicação entre equipes de QA, desenvolvimento e produto.

Recomenda-se manter esta documentação atualizada conforme mudanças na interface ou nas regras de negócio.

# Pokedex App - Ionic com Angular

Este projeto é uma aplicação Pokedex que utiliza a API pública PokeAPI para exibir informações sobre Pokémon, desenvolvida com Ionic e Angular.

## Abordagem e Padrões de Design

1. **Arquitetura Modular**: Componentes e serviços são organizados de forma modular para facilitar manutenção e escalabilidade.

2. **Injeção de Dependência**: Utilizo o sistema de injeção de dependência do Angular para gerenciar serviços como `PokemonService` e `FavoritesService`.

3. **Componentes Standalone**: Aproveitando os recursos mais recentes do Angular, todos os componentes são standalone para melhor encapsulamento.

4. **Padrão Observable**: Implementei o padrão Observable com RxJS para gerenciar fluxos de dados assíncronos e estado da aplicação.

5. **Cache Inteligente**: Sistema de cache implementado para melhorar a performance e reduzir chamadas desnecessárias à API.

6. **Design Responsivo**: Interface adaptativa para diferentes tamanhos de tela e orientações (retrato/paisagem).

7. **Tratamento de Erros**: Implementação robusta de tratamento de erros com feedback visual para o usuário.

8. **Lazy Loading**: Carregamento sob demanda de imagens e dados para melhorar a performance inicial.

9. **Animações Sutis**: Adicionei animações sutis para melhorar a experiência do usuário sem comprometer a performance.

10. **Tema Consistente**: Utilização de variáveis CSS e temas do Ionic para manter consistência visual em toda a aplicação.

## Funcionalidades

- Lista de Pokémon com paginação infinita
- Detalhes completos de cada Pokémon
- Sistema de favoritos persistente
- Busca por nome de Pokémon
- Interface responsiva para diferentes dispositivos
- Suporte a modo retrato e paisagem

## Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Construir para produção
npm run build
```

## Tecnologias Utilizadas

- Ionic 7
- Angular 17
- RxJS
- TypeScript
- SCSS
- PokeAPI

## Estrutura do Projeto

- `src/app/services`: Serviços para comunicação com a API e gerenciamento de favoritos
- `src/app/pages`: Componentes de página (lista de pokémons, detalhes, favoritos)
- `src/app/app.*`: Componente principal e configurações da aplicação

## Contato

- Desenvolvido por: Renan0004
- Email: tatusage@gmail.com

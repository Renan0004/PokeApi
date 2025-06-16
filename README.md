# Pokedex App

Uma aplicação móvel desenvolvida com Ionic e Angular que consome a PokeAPI para exibir informações sobre Pokémons.

## Abordagem e Padrões de Design

Este projeto foi desenvolvido seguindo uma arquitetura de componentes modular, utilizando padrões de design modernos e boas práticas de desenvolvimento. A aplicação é responsiva e funciona bem em diferentes orientações de dispositivos móveis.

A injeção de dependência é amplamente utilizada para gerenciar serviços e componentes, seguindo o padrão de design recomendado pelo Angular. Os serviços são responsáveis por encapsular a lógica de negócio e a comunicação com APIs externas.

A interface do usuário foi projetada com foco na experiência do usuário, utilizando componentes do Ionic para garantir uma aparência nativa e responsiva. A navegação é intuitiva e a aplicação oferece feedback visual para ações do usuário.

## Funcionalidades

- Lista de Pokémons com paginação infinita
- Detalhes de cada Pokémon com informações completas
- Favoritar Pokémons e visualizá-los em uma lista separada
- Design responsivo para diferentes tamanhos de tela e orientações
- Pull-to-refresh para atualizar os dados

## Tecnologias Utilizadas

- Angular 17
- Ionic 7
- TypeScript
- RxJS
- PokeAPI

## Como Executar

1. Clone este repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `ng serve` ou `ionic serve`

## Estrutura do Projeto

- `src/app/services`: Serviços para comunicação com a API e gerenciamento de favoritos
- `src/app/pages`: Componentes de página (lista de pokémons, detalhes, favoritos)
- `src/app/app.*`: Componente principal e configurações da aplicação

## Contato

- Desenvolvido por: Renan0004
- Email: tatusage@gmail.com


# PetShop System

O Petshop System é um sistema web completo, desenvolvido para atender às demandas de pet shops que buscam otimizar seus processos e oferecer uma gestão eficiente e intuitiva. A plataforma permite o controle total de cadastros de clientes, pets, serviços, agendamentos e vendas, tudo em um só lugar.

Desenvolvido com Node.js, Express e MongoDB, o sistema garante alta performance, escalabilidade e segurança. Com uma interface amigável, o PetCare Manager oferece uma experiência simplificada tanto para os colaboradores quanto para os gestores, possibilitando uma administração mais ágil e organizada.

Ideal para pet shops que desejam profissionalizar sua operação, melhorar o atendimento e impulsionar seus resultados no mercado.


## 📋 Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API](#api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🐾 Funcionalidades

- **Gerenciamento de Clientes**: Cadastro, edição e consulta de clientes
- **Gerenciamento de Pets**: Registro de pets com informações detalhadas
- **Agendamento de Serviços**: Marcação de banho, tosa, consultas e outros serviços
- **Controle de Estoque**: Gerenciamento de produtos com alertas de estoque baixo
- **Vendas**: Registro de vendas de produtos com atualização automática do estoque
- **Dashboard**: Visão geral do negócio com métricas importantes
- **Histórico**: Acompanhamento de serviços realizados e compras

## 🛠️ Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express
  - MongoDB (Mongoose)
  - JWT para autenticação
  - Bcrypt para criptografia

- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript (Vanilla)
  - Bootstrap 5
  - Font Awesome

## 📁 Estrutura do Projeto

```
petshop-system/
├── backend/           # Código do servidor
├── frontend/          # Interface do usuário
│   ├── css/           # Estilos
│   ├── js/            # Scripts
│   ├── pages/         # Páginas HTML
│   └── img/           # Imagens
├── models/            # Modelos do MongoDB
├── routes/            # Rotas da API
├── .env               # Variáveis de ambiente
├── .gitignore         # Arquivos ignorados pelo Git
├── package.json       # Dependências e scripts
└── server.js          # Ponto de entrada da aplicação
```

## 🚀 Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/petshop-system.git
   cd petshop-system
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` (veja a seção [Configuração](#configuração))

4. Inicie o servidor:
   ```
   npm start
   ```

5. Acesse a aplicação em `http://localhost:5000`

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
MONGODB_URI=sua_url_de_conexao_mongodb
PORT=5000
NODE_ENV=development
JWT_SECRET=seu_segredo_jwt
```

## 💻 Uso

- **Dashboard**: Visão geral do negócio
- **Clientes**: Gerenciamento de clientes
- **Pets**: Cadastro e acompanhamento de pets
- **Serviços**: Agendamento e controle de serviços
- **Produtos**: Controle de estoque e vendas
- **Vendas**: Registro de vendas de produtos

## 🔌 API

A API RESTful está disponível em `/api` com os seguintes endpoints:

- `/api/clientes`: Gerenciamento de clientes
- `/api/pets`: Gerenciamento de pets
- `/api/servicos`: Agendamento e controle de serviços
- `/api/produtos`: Controle de estoque
- `/api/vendas`: Registro de vendas

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido com ❤️ para pet shops 
© 2025 Ryan Brayan

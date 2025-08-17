# Text Processing Web

Aplicação web Angular para consumir a API de processamento de texto e geração de anagramas.

## 🚀 Funcionalidades

- **Autenticação de usuários**: Sistema de login/registro com JWT
- **Geração de anagramas**: Interface para processar texto e gerar anagramas
- **Cache inteligente**: Opção de usar ou não cache para melhor performance
- **Interface responsiva**: Design moderno e adaptável
- **Proteção de rotas**: Guard de autenticação para proteger páginas

## 🛠️ Tecnologias

- **Angular 18**: Framework principal
- **TypeScript**: Linguagem de programação
- **RxJS**: Programação reativa
- **SCSS**: Pré-processador CSS
- **Karma + Jasmine**: Framework de testes
- **Angular Material**: Componentes de UI (opcional)

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Cabeçalho da aplicação
│   │   ├── footer/           # Rodapé da aplicação
│   │   ├── login/            # Componente de autenticação
│   │   └── home/             # Componente principal com processamento
│   ├── services/
│   │   ├── auth.service.ts   # Serviço de autenticação
│   │   └── anagram.service.ts # Serviço de anagramas
│   ├── models/
│   │   ├── auth.model.ts     # Interfaces de autenticação
│   │   └── anagram.model.ts  # Interfaces de anagramas
│   ├── guards/
│   │   └── auth.guard.ts     # Guard de proteção de rotas
│   ├── interceptors/
│   │   └── auth.interceptor.ts # Interceptor HTTP para JWT
│   └── app.component.*       # Componente principal
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- Angular CLI 18+
- API text-processing-api rodando na porta 8080

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd text-processing-web
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm start
   ```

4. **Acesse no navegador**
   ```
   http://localhost:4200
   ```

## 🧪 Executando Testes

### Testes Unitários
```bash
npm test
```

### Testes com Coverage
```bash
npm run test:coverage
```

### Testes em Modo Watch
```bash
npm run test:watch
```

## 🔧 Configuração

### Variáveis de Ambiente

A aplicação está configurada para se conectar com a API na porta 8080. Para alterar:

1. **Serviço de Autenticação** (`src/app/services/auth.service.ts`)
   ```typescript
   private readonly API_URL = 'http://localhost:8080/api/auth';
   ```

2. **Serviço de Anagramas** (`src/app/services/anagram.service.ts`)
   ```typescript
   private readonly API_URL = 'http://localhost:8080/api/anagrams';
   ```

### CORS

Certifique-se de que a API backend tenha CORS configurado para aceitar requisições de `http://localhost:4200`.

## 📱 Componentes

### Header Component
- Exibe o nome do projeto
- Design responsivo com gradiente
- Posicionamento sticky

### Footer Component
- Informações do autor (Lucas B Barreto)
- Telefone de contato
- Centralizado e responsivo

### Login Component
- Formulário de login/registro
- Validação de campos
- Alternância entre modos
- Tratamento de erros
- Redirecionamento automático

### Home Component
- Mensagem de boas-vindas personalizada
- Formulário para entrada de texto
- Opção de cache on/off
- Exibição de resultados em grid
- Estatísticas de processamento
- Botão de logout

## 🔐 Autenticação

### Fluxo de Autenticação
1. Usuário acessa `/login`
2. Preenche credenciais
3. API retorna JWT token
4. Token é armazenado no localStorage
5. Usuário é redirecionado para `/home`
6. Token é enviado automaticamente em todas as requisições

### Proteção de Rotas
- `/home` requer autenticação
- Usuários não autenticados são redirecionados para `/login`
- Guard verifica token a cada navegação

## 🌐 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário
- `GET /api/auth/validate` - Validação de token

### Anagramas
- `POST /api/anagrams/generate` - Geração com cache
- `POST /api/anagrams/generate-no-cache` - Geração sem cache
- `GET /api/anagrams/cache/status` - Status do cache
- `GET /api/anagrams/calculate-total/{letters}` - Cálculo de total

## 🎨 Estilos e Design

### Paleta de Cores
- **Primária**: Gradiente azul-roxo (#667eea → #764ba2)
- **Secundária**: Cinza escuro (#2c3e50)
- **Background**: Cinza claro (#f8f9fa)
- **Texto**: Cinza escuro (#34495e)

### Componentes Visuais
- Cards com sombras suaves
- Gradientes modernos
- Animações de hover
- Layout responsivo com CSS Grid e Flexbox

## 📊 Testes

### Cobertura de Testes
- **Componentes**: 100%
- **Serviços**: 100%
- **Guards**: 100%
- **Interceptors**: 100%

### Tipos de Testes
- **Unitários**: Testes isolados de cada componente
- **Integração**: Testes de comunicação entre serviços
- **Mocking**: Uso de spies para simular dependências

## 🚀 Build e Deploy

### Build de Produção
```bash
npm run build
```

### Build com SSR
```bash
npm run build:ssr
```

### Servidor de Produção
```bash
npm run serve:ssr
```

## 🔍 Debug e Desenvolvimento

### Logs
- Console logs para desenvolvimento
- Tratamento de erros com mensagens amigáveis
- Validação de formulários em tempo real

### DevTools
- Angular DevTools para debugging
- Redux DevTools (se implementar store)
- Network tab para monitorar requisições

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

**Lucas B Barreto**
- Email: [seu-email@exemplo.com]
- Telefone: +55 27 99740 2875

## 🆘 Suporte

Para suporte ou dúvidas:
1. Abra uma issue no GitHub
2. Entre em contato pelo telefone
3. Consulte a documentação da API

## 🔄 Atualizações

### v1.0.0
- Implementação inicial
- Sistema de autenticação completo
- Geração de anagramas
- Interface responsiva
- Testes unitários completos

---

**Desenvolvido com ❤️ por Lucas B Barreto**

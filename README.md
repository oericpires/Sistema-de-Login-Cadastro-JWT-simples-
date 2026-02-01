# Sistema de Login/Cadastro (JWT simples)

Pequeno projeto front-end que implementa registro, login e sessão via token (JWT sem assinatura) usando armazenamento local.

Arquivos principais
- [index.html](index.html)
- [style.css](style.css)
- [script.js](script.js)
- [auth.js](auth.js)
- [service.js](service.js)

Principais funções/exportações
- Autenticação e token: [`auth.gerarToken`](auth.js), [`auth.getUsuarioDoToken`](auth.js), [`auth.tokenValido`](auth.js), [`auth.hashSenha`](auth.js)
- Criação de usuário: [`service.criarUsuario`](service.js)
- UI / Fluxo: [`script.renderizarApp`](script.js), [`script.gerarLogin`](script.js), [`script.gerarCadastro`](script.js), [`script.gerarHome`](script.js), [`script.cadastro`](script.js), [`script.login`](script.js)

Como executar
1. Servir a pasta do projeto por um servidor estático (recomendado). Exemplo rápido:
   - Python 3: `python -m http.server 8000`
   - ou: `npx http-server`
2. Abrir `http://localhost:8000` no navegador moderno (suporte a ES Modules e Web Crypto API).

Fluxo do app
- Registro: formulário em [`script.gerarCadastro`](script.js) — validações no cliente e usuário salvo em `localStorage` via [`service.criarUsuario`](service.js).
- Login: validação de senha usando hash SHA-256 via [`auth.hashSenha`](auth.js). Ao autenticar, é gerado um token com [`auth.gerarToken`](auth.js) e salvo em `localStorage`.
- Home: leitura do token por [`auth.getUsuarioDoToken`](auth.js) e verificação por [`auth.tokenValido`](auth.js).

Observações de segurança importantes
- O "JWT" gerado usa `alg: "none"` e não possui assinatura; não é seguro para produção.
- Armazenamento de usuários e tokens em `localStorage` é apenas para demonstração — não use em produção.
- Hash de senha é feito no cliente; para produção, valide e armazene senhas no servidor com salt e algoritmos adequados.

Melhorias sugeridas
- Implementar backend real para cadastro/login e persistência segura.
- Assinar tokens (HS256/RS256) e validar no servidor.
- Usar HTTPS e cookies seguros (HttpOnly) para sessão.

Licença
- Use à vontade para estudos e experimentos.````// filepath: README.md

# Sistema de Login/Cadastro (JWT simples)

Pequeno projeto front-end que implementa registro, login e sessão via token (JWT sem assinatura) usando armazenamento local.

Arquivos principais
- [index.html](index.html)
- [style.css](style.css)
- [script.js](script.js)
- [auth.js](auth.js)
- [service.js](service.js)

Principais funções/exportações
- Autenticação e token: [`auth.gerarToken`](auth.js), [`auth.getUsuarioDoToken`](auth.js), [`auth.tokenValido`](auth.js), [`auth.hashSenha`](auth.js)
- Criação de usuário: [`service.criarUsuario`](service.js)
- UI / Fluxo: [`script.renderizarApp`](script.js), [`script.gerarLogin`](script.js), [`script.gerarCadastro`](script.js), [`script.gerarHome`](script.js), [`script.cadastro`](script.js), [`script.login`](script.js)

Como executar
1. Servir a pasta do projeto por um servidor estático (recomendado). Exemplo rápido:
   - Python 3: `python -m http.server 8000`
   - ou: `npx http-server`
2. Abrir `http://localhost:8000` no navegador moderno (suporte a ES Modules e Web Crypto API).

Fluxo do app
- Registro: formulário em [`script.gerarCadastro`](script.js) — validações no cliente e usuário salvo em `localStorage` via [`service.criarUsuario`](service.js).
- Login: validação de senha usando hash SHA-256 via [`auth.hashSenha`](auth.js). Ao autenticar, é gerado um token com [`auth.gerarToken`](auth.js) e salvo em `localStorage`.
- Home: leitura do token por [`auth.getUsuarioDoToken`](auth.js) e verificação por [`auth.tokenValido`](auth.js).

Observações de segurança importantes
- O "JWT" gerado usa `alg: "none"` e não possui assinatura; não é seguro para produção.
- Armazenamento de usuários e tokens em `localStorage` é apenas para demonstração — não use em produção.
- Hash de senha é feito no cliente; para produção, valide e armazene senhas no servidor com salt e algoritmos adequados.

Melhorias sugeridas
- Implementar backend real para cadastro/login e persistência segura.
- Assinar tokens (HS256/RS256) e validar no servidor.
- Usar HTTPS e cookies seguros (HttpOnly) para sessão.

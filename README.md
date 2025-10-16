# EAD - Linguagens Formais e Autômatos

Aplicação full-stack que extrai CNPJs e domínios de PDFs via API Flask e uma UI em React.

## 🚀 Funcionalidades

- **Extração inteligente de PDFs**: Usa PyMuPDF para processar PDFs com texto selecionável
- **Detecção automática de CNPJ**: Regex específico para formato brasileiro (XX.XXX.XXX/XXXX-XX)
- **Extração de domínios**: Filtragem inteligente para evitar falsos positivos
- **Interface moderna**: UI responsiva com React + Tailwind CSS
- **API RESTful**: Endpoint `/api/extract` para processamento de arquivos

## 📁 Estrutura do Projeto
```
├── backend/           # API Flask
│   ├── src/
│   │   ├── app.py     # Servidor principal
│   │   └── extractor/
│   │       └── processa_pdf.py  # Lógica de extração
│   └── venv/          # Ambiente virtual Python
├── frontend/          # Interface React
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx   # Componente de upload
│   │   │   └── Footer.tsx       # Rodapé
│   │   └── App.tsx    # Componente principal
│   └── package.json
└── README.md
```

## ⚙️ Requisitos
- **Python 3.11+**
- **Node.js 18+**
- **Java JRE/JDK 8+** (opcional, para fallback com Tabula)

## 🛠️ Instalação e Execução

### Backend (API Flask)

1) **Navegar para o diretório e ativar ambiente virtual:**
```powershell
cd backend
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./venv/Scripts/Activate.ps1
```

2) **Instalar dependências:**
```powershell
pip install flask flask-cors PyMuPDF pandas
```

3) **Executar a API:**
```powershell
python ./src/app.py
```
- **API disponível em:** `http://localhost:5000`
- **Endpoint:** `POST /api/extract`

### Frontend (React + Vite)

1) **Navegar para o diretório e instalar dependências:**
```bash
cd frontend
npm install
```

2) **Executar em modo de desenvolvimento:**
```bash
npm run dev
```
- **Interface disponível em:** `http://localhost:5173`

## 🔧 Como Usar

1. **Acesse a interface web** em `http://localhost:5173`
2. **Selecione um arquivo PDF** com texto selecionável
3. **Clique em "Extrair Dados"** para processar
4. **Visualize os resultados** com CNPJs e domínios extraídos
5. **Baixe os dados** em formato CSV se necessário

## 📋 Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **PyMuPDF (fitz)**: Processamento de PDFs
- **Pandas**: Manipulação de dados
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS
- **Vite**: Build tool e dev server
- **Axios**: Cliente HTTP

## 🐛 Solução de Problemas

### Erro "Nenhuma tabela encontrada no PDF"
- **Causa**: PDF pode ser escaneado (imagem) ou ter layout incomum
- **Solução**: Use PDFs com texto selecionável ou converta para texto

### Erro de importação de módulos
- **Causa**: Ambiente virtual não ativado
- **Solução**: Ative o venv com `./venv/Scripts/Activate.ps1`

### Erro de dependências Python
- **Causa**: Pacotes não instalados
- **Solução**: Execute `pip install -r requirements.txt` (se disponível)

## 📝 Changelog

### v2.0.0 (Atual)
- ✅ Substituição do Tabula por PyMuPDF
- ✅ Melhoria na detecção de CNPJ e domínios
- ✅ Tratamento de erro robusto
- ✅ Interface de usuário aprimorada
- ✅ Documentação atualizada

### v1.0.0
- ✅ Implementação inicial com Tabula
- ✅ API Flask básica
- ✅ Interface React simples

## 📄 Licença
MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📞 Suporte
Para dúvidas ou problemas, abra uma issue no repositório GitHub.

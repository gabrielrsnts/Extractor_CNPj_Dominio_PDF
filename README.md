# EAD - Linguagens Formais e Autômatos

Aplicação full-stack que extrai CNPJs e domínios de PDFs via API Flask e uma UI em React.

## Estrutura
- `backend/`: API Flask
- `frontend/`: Vite + React + Tailwind

## Requisitos
- Python 3.11+
- Node 18+

## Backend
1) Ativar venv (PowerShell):
```powershell
cd backend
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
./venv/Scripts/Activate.ps1
```
2) Instalar dependências:
```powershell
pip install flask flask-cors PyPDF2
```
3) Rodar API:
```powershell
python ./src/app.py
```
API: `http://localhost:5000`.

## Frontend
```bash
cd frontend
npm install
npm run dev
```
UI: `http://localhost:5173`.

## Licença
MIT

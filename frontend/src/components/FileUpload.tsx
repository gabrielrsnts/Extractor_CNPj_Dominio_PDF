import { Upload, FileText, Download, AlertCircle, HelpCircle } from 'lucide-react';
import {  useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<{
    [x: string]: any; cnpjs: string[], dominios: string[] 
} | null>(null);
  
  // Estado para controlar a visibilidade do modal de ajuda
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Por favor, selecione um arquivo PDF válido');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setExtractedData(null);
    }
  };

  // <<< ADICIONE ESTE BLOCO DE CÓDIGO PARA DIAGNÓSTICO >>>
  useEffect(() => {
    // Esta linha irá imprimir o valor da variável de ambiente no console do navegador assim que a página carregar.
    console.log("Variável de ambiente VITE_API_URL vista pelo código:", process.env.VITE_API_URL);
  }, []); // O [] vazio garante que isso rode apenas uma vez

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.VITE_API_URL || 'http://127.0.0.1:5000';
      const response = await axios.post(`${apiUrl}/api/extract`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Verifica se a resposta do backend contém um erro
      if (response.data.erro) {
        setError(response.data.erro);
        setExtractedData(null);
      } else {
        setExtractedData(response.data);
      }
      
    } catch (err: any) {
      console.error("Erro na comunicação com o backend:", err);
      // Tenta exibir a mensagem de erro do backend, se disponível
      const backendError = err.response?.data?.erro || 'Ocorreu um erro ao processar o arquivo. Tente novamente.';
      setError(backendError);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!extractedData) return;

    const { cnpjs, dominios } = extractedData;
    const headers = '"CNPJ";"Dominio"';
    const maxRows = Math.max(cnpjs.length, dominios.length);
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const cnpj = cnpjs[i] || '';
      const dominio = dominios[i] || '';
      rows.push(`"${cnpj}";"${dominio}"`);
    }
    
    const csvContent = [headers, ...rows].join('\n');
    
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${file?.name.replace('.pdf', '')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
    setError(null);
  };
  
  const csvReady = extractedData !== null && !extractedData.erro;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800 rounded-xl mb-4">
            <FileText className="w-8 h-8 text-zinc-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PDF para CSV</h1>
          <p className="text-zinc-400">Extraia CNPJs e Domínios de seus PDFs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/50 border border-red-900 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!file ? (
          <div className="relative">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-xl p-12 hover:border-zinc-600 transition-colors cursor-pointer bg-zinc-950/50"
            >
              <Upload className="w-12 h-12 text-zinc-500 mb-4" />
              <p className="text-white font-medium mb-1">Clique para selecionar</p>
              <p className="text-zinc-500 text-sm">ou arraste um arquivo PDF aqui</p>
            </label>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-950/50 border border-zinc-800 rounded-lg">
              <div className="flex-shrink-0 w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-zinc-500 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={handleReset}
                className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
              >
                Remover
              </button>
            </div>

            {!csvReady ? (
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="w-full py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processando...' : 'Processar PDF'}
              </button>
            ) : (
              <button
                onClick={handleDownload}
                className="w-full py-3 px-6 bg-green-500 text-black font-medium rounded-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Baixar CSV
              </button>
            )}
          </div>
        )}
      </div>

      {/* --- BOTÃO PARA ABRIR O MODAL DE AJUDA --- */}
      <div className="text-center mt-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
          Como funciona? Guia de Uso
        </button>
      </div>

      {/* --- COMPONENTE DO MODAL --- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Guia de Uso: Preparando seu PDF</h2>
            <p className="text-zinc-400 mb-6">
              Para garantir o sucesso da extração, seu PDF deve seguir 4 regras simples de formatação e estrutura.
            </p>

            <div className="space-y-6 text-zinc-300">
              <div>
                <h3 className="font-semibold text-white mb-2">1. O PDF deve ser baseado em Texto (Não uma imagem)</h3>
                <p>✅ **Correto:** Você consegue abrir o PDF e selecionar as palavras e números com o cursor do mouse.</p>
                <p>❌ **Incorreto:** O PDF é um documento escaneado. Se você só consegue desenhar uma caixa de seleção sobre o conteúdo, o sistema não conseguirá ler.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">2. O CNPJ deve estar no Formato Padrão</h3>
                <p>O sistema reconhece o formato oficial de CNPJ com pontuação.</p>
                <p>✅ **Correto:** <code>12.345.678/0001-99</code></p>
                <p>❌ **Incorreto:** <code>12345678000199</code> (sem pontuação)</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">3. Os Domínios devem estar em Letras Minúsculas</h3>
                <p>Para evitar extrair "Marcas" ou outros textos por engano, apenas domínios em minúsculas são reconhecidos.</p>
                <p>✅ **Correto:** <code>meusite.com.br</code>, <code>exemplo.net</code></p>
                <p>❌ **Incorreto:** <code>MeuSite.com.br</code>, <code>EXEMPLO.NET</code></p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">4. A Regra de Ouro: O CNPJ Sempre Primeiro</h3>
                <p>O sistema lê de cima para baixo. Para que um domínio seja associado a um CNPJ, o CNPJ deve aparecer antes ou na mesma linha que os domínios pertencentes a ele.</p>
              </div>
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2 px-5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all"
              >
                Entendi, fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
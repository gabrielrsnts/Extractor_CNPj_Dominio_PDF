import { Upload, FileText, Download, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios'; // <<< MUDANÇA AQUI >>> Importamos o axios

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // <<< MUDANÇA AQUI >>> Vamos guardar os dados recebidos da API neste estado
  const [extractedData, setExtractedData] = useState<{ cnpjs: string[], dominios: string[] } | null>(null);

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
      setExtractedData(null); // Limpa os dados anteriores ao selecionar um novo arquivo
    }
  };

  // <<< MUDANÇA PRINCIPAL #1 >>> Conectando com o Backend
  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setExtractedData(null);

    // FormData é a forma padrão de enviar arquivos para uma API
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Faz a chamada POST para sua API Flask
      const response = await axios.post('http://127.0.0.1:5000/api/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Armazena os dados (ex: { cnpjs: [...], dominios: [...] }) no estado
      setExtractedData(response.data);
      
    } catch (err) {
      console.error("Erro na comunicação com o backend:", err);
      setError('Ocorreu um erro ao processar o arquivo. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // <<< MUDANÇA PRINCIPAL #2 >>> Gerando o CSV dinamicamente
  const handleDownload = () => {
    // Se não houver dados, não faz nada
    if (!extractedData) return;

    const { cnpjs, dominios } = extractedData;

    // Define o cabeçalho do CSV. Usar ; como delimitador funciona melhor no Excel em português
    const headers = '"CNPJ";"Dominio"';

    // Combina as listas de CNPJs e domínios em linhas de CSV
    const maxRows = Math.max(cnpjs.length, dominios.length);
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      const cnpj = cnpjs[i] || ''; // Pega o CNPJ ou uma string vazia se não houver
      const dominio = dominios[i] || ''; // Pega o domínio ou uma string vazia
      rows.push(`"${cnpj}";"${dominio}"`);
    }
    
    // Junta o cabeçalho e as linhas em um único texto
    const csvContent = [headers, ...rows].join('\n');
    
    // O resto da sua lógica de download continua a mesma
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
  
  // O seu JSX continua o mesmo, mas agora a condição para mostrar o botão de download
  // será baseada no estado 'extractedData' em vez de 'csvReady'.
  const csvReady = extractedData !== null;

  // ... (o resto do seu código JSX continua exatamente o mesmo aqui)
  // ... (vou colar para garantir que fique completo)

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
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
                className="w-full py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Baixar CSV
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
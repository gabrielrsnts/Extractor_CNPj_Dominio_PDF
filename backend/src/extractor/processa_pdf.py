import re
from PyPDF2 import PdfReader 

def _lerPDF(pdf_caminho: str):
    with open(pdf_caminho, "rb") as input_pdf:
        pdf_reader = PdfReader(input_pdf)
        texto_completo = ""
        for page in pdf_reader.pages:
            texto_completo += page.extract_text() + "\n"
        return texto_completo

def _extractorCNPJ(pdf_text: str) -> list[str]:
    cnpj_pattern = r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}'
    return re.findall(cnpj_pattern, pdf_text)


def _extractorDominio(pdf_text: str) -> list[str]:
    dominio_pattern = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,24}\b'
    dominios_encontrados = re.findall(dominio_pattern, pdf_text)
    
    extensoes_ignoradas = ('.png', '.jpg', '.jpeg', '.gif', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx')
    
    dominios_validos = []
    for dominio in dominios_encontrados:
        dominio_lower = dominio.lower() # Trabalhar com minúsculas para consistência
        
        # Verifica se o domínio não é apenas um email e se não termina com uma extensão de arquivo comum
        if '@' not in dominio_lower and not dominio_lower.endswith(extensoes_ignoradas):
            dominios_validos.append(dominio)
            
    return dominios_validos


def extrair_dados_do_pdf(caminho_do_arquivo: str) -> dict:
    try:
        texto_completo = _lerPDF(caminho_do_arquivo)
        cnpjs = _extractorCNPJ(texto_completo)
        dominios = _extractorDominio(texto_completo)
        
        #Remove duplicados convertendo para set e depois para lista
        cnpjs_unicos = list(set(cnpjs))
        dominios_unicos = list(set(dominios))
        
        #Retorna um dicionário
        return {
            "cnpjs": cnpjs_unicos,
            "dominios": dominios_unicos
        }
    except Exception as e:
        # Em caso de erro na leitura, retorna uma mensagem de erro
        print(f"Erro ao processar o PDF: {e}")
        return {"erro": str(e)}
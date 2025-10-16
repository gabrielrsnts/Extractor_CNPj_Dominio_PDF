# backend/extrator/processa_pdf.py

import re
import fitz  # PyMuPDF
import traceback

def extrair_dados_do_pdf(caminho_do_arquivo: str) -> dict:
    """
    Abordagem final e precisa: processa o PDF mantendo a estrutura de linhas/blocos
    e usa um regex estrito que aceita apenas domínios em letras minúsculas para
    evitar falsos positivos de outras colunas (ex: Marcas).
    """
    try:
        cnpjs_finais = []
        dominios_finais = []
        ultimo_cnpj_visto = None

        with fitz.open(caminho_do_arquivo) as doc:
            for pagina in doc:
                blocos = pagina.get_text("blocks")
                blocos.sort(key=lambda b: b[1])

                for bloco in blocos:
                    texto_bloco = bloco[4] 

                    match_cnpj = re.search(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}', texto_bloco)
                    
                    if match_cnpj:
                        ultimo_cnpj_visto = match_cnpj.group(0)

                    # <<< MUDANÇA #1: REGEX SÓ COM MINÚSCULAS >>>
                    # Agora o padrão exige que todas as letras sejam minúsculas.
                    regex_dominios = r'\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b'
                    
                    # <<< MUDANÇA #2: REMOÇÃO DO IGNORECASE >>>
                    # A busca agora é sensível a maiúsculas, aplicando a regra acima.
                    dominios_encontrados = re.findall(regex_dominios, texto_bloco)
                    
                    if dominios_encontrados and ultimo_cnpj_visto:
                        # O filtro para extensões de arquivo ainda é uma boa segurança.
                        extensoes_ignoradas = ('.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx')
                        
                        for dominio in dominios_encontrados:
                            if not dominio.endswith(extensoes_ignoradas):
                                cnpjs_finais.append(ultimo_cnpj_visto)
                                # A chamada .lower() é mantida como garantia de padronização
                                dominios_finais.append(dominio.strip().lower())
        
        return {
            "cnpjs": cnpjs_finais,
            "dominios": dominios_finais
        }

    except Exception as e:
        print("--- OCORREU UM ERRO DETALHADO ---")
        traceback.print_exc()
        print("---------------------------------")
        return {"erro": f"Falha no processamento do PDF: {e}"}
import os
import sys
import traceback 
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Garantir que o diretório do arquivo esteja no sys.path para resolver imports locais
sys.path.append(os.path.dirname(__file__))
from extractor.processa_pdf import extrair_dados_do_pdf

app = Flask(__name__)
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
CORS(app, origins="*") # Permite TODAS as origens (APENAS PARA TESTE)

print("!!! MODO DE DEBUG: CORS configurado para aceitar TODAS as origens !!!")

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/extract', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({"erro": "Nenhum arquivo enviado"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"erro": "Nome de arquivo vazio"}), 400

        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Chama a função para processar o PDF
            dados_extraidos = extrair_dados_do_pdf(filepath)

            # Remove o arquivo temporário
            os.remove(filepath)

            if "erro" in dados_extraidos:
                return jsonify(dados_extraidos), 500
            
            return jsonify(dados_extraidos), 200

        return jsonify({"erro": "Falha genérica no upload"}), 500

    except Exception as e:
        print("--- OCORREU UM ERRO DETALHADO NO APP.PY ---")
        traceback.print_exc()
        print("-----------------------------------------")
        return jsonify({"erro": f"Erro interno no servidor: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
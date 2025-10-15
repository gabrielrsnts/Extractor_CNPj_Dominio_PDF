import os
from flask import Flask, request, jsonify  # pyright: ignore[reportMissingImports]
from flask_cors import CORS  # pyright: ignore[reportMissingModuleSource]
from werkzeug.utils import secure_filename  # pyright: ignore[reportMissingImports]

# Importa a ÚNICA função que precisamos do nosso outro arquivo
from extractor.processa_pdf import extrair_dados_do_pdf  # pyright: ignore[reportMissingImports]

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/extract', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"erro": "Nenhum arquivo enviado"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"erro": "Nome de arquivo vazio"}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Chama a função refatorada para obter os dados
        dados_extraidos = extrair_dados_do_pdf(filepath)

        os.remove(filepath) # Remove o arquivo temporário

        if "erro" in dados_extraidos:
            return jsonify(dados_extraidos), 500
        
        # Retorna o dicionário de dados como JSON para o React
        return jsonify(dados_extraidos), 200

    return jsonify({"erro": "Falha no upload"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
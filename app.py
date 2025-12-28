from flask import Flask, render_template

app = Flask(__name__)

# --- SEU BANCO DE DADOS DE PRODUTOS (EM PYTHON) ---
# Você pode adicionar, remover ou mudar preços aqui.
products = [
    {"id": 1, "name": "RELOGIO SMARTWATCH HW16", "price": 100.00, "image": "static/img/02.webp"},
    {"id": 2, "name": "RELOGIO DIGITAL INFANTIL FX-RD-02", "price": 59.00, "image": "static/img/03.webp"},
    {"id": 3, "name": "RELÓGIO SMART WATCH 46MM 2 PULSEIRAS WATCH 10 PRO", "price": 120.00, "image": "static/img/04.webp"},
    {"id": 4, "name": "ERELÓGIO SMART WATCH 46MM C/ CÂMERA E CHIP", "price": 80.00, "image": "static/img/05.webp"},
    {"id": 5, "name": "RELÓGIO SMART WATCH 42MM 2 PULSEIRAS WATCH 10 PRO", "price": 189.00, "image": "static/img/06.webp"},
    {"id": 6, "name": "SMARTWATCH TELA CURVA PEI-WAT3MINI PEINING", "price": 130.00, "image": "static/img/07.webp"},
    {"id": 7, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT6", "price": 79.00, "image": "static/img/08.webp"},
    {"id": 8, "name": "RELOGIO SMARTWATCH PEINING PEI-T10", "price": 129.00, "image": "static/img/09.webp"},
    {"id": 9, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT10", "price": 110.00, "image": "static/img/10.webp"},
    {"id": 10, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT11", "price": 109.00, "image": "static/img/l02.webp"},
    {"id": 11, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT12", "price": 116.00, "image": "static/img/l03.webp"},
    {"id": 12, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT13", "price": 165.00, "image": "static/img/l04.webp"},
    {"id": 13, "name": "SMARTWATCH 10ª GERAÇÃO PEI-WAT4", "price": 189.00, "image": "static/img/l05.webp"},
    {"id": 14, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT8", "price": 270.00, "image": "static/img/l08.webp"},
    {"id": 15, "name": "RELOGIO SMARTWATCH PEINING PEI-WAT9", "price": 175.00, "image": "static/img/l09.webp"}
]

@app.route('/')
def index():
    # Envia os produtos para o HTML
    return render_template('index.html', products=products)

if __name__ == '__main__':
    app.run(debug=True)

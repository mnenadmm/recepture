from flask import Flask

# Kreiranje Flask aplikacije
app = Flask(__name__)

# Definisanje rute
@app.route('/')
def hello_world():
    return 'Hello, World!'

# Pokretanje aplikacije
if __name__ == '__main__':
    app.run(debug=True)

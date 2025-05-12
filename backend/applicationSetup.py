from flask import Flask
from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate
from modeli import db, Korisnici, Sirovine, Dobavljaci, Kolaci, Recepture



from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message
#from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from konekcija import *
def create_app():
    app = Flask(__name__)
    # Konfiguracija mail servera
    
   
    app.config["SECRET_KEY"] = "thisisseacretkey"
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = 'mnenadmm@gmail.com'
    app.config['MAIL_DEFAULT_SENDER'] = 'mnenadmm@gmail.com'
    app.config['MAIL_PASSWORD'] = 'nvks pgdp hsyx pwki'#ovo je sifra koju smo pokupili sa googla i radi samo za racunare
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    sender = 'mnenadmm@gmail.com'
    mail = Mail(app)
    s = URLSafeTimedSerializer('Thisisasecret!')
    # Konfiguracija aplikacije
    app.config["JWT_SECRET_KEY"] = "super-secret"
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://nenad:781022Sone@postgres:5432/app_magacin"
    SQLALCHEMY_DATABASE_URI = 'postgresql://nenad:781022Sone@postgres:5432/app_magacin'
    app.config['SQLALCHEMY_DATABASE_URI'] =string_za_konekciju
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.permanent_session_lifetime = timedelta(minutes=1000)
    # Omogućavanje CORS-a
    CORS(app, supports_credentials=True)
    # Inicijalizacija ekstenzija
    db.init_app(app)
    #migrate = Migrate(app, db)
    
    
    

    # Kreiranje svih tabela u bazi ako ne postoje
    with app.app_context(): 
        try:
            db.create_all()
            print("✔️ Tabele su uspešno kreirane.")
        except Exception as e:
            print(f"❌ Greška pri kreiranju tabela: {e}")
    
    return app, db, s, sender, mail
    

    
    
    

    
    
    
    
    

    
    
    
    
    

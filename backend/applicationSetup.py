from flask import Flask



from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail
#from flask_jwt_extended import JWTManager
from flask_cors import CORS
from datetime import timedelta
from konekcija import *
def create_app():
    app = Flask(__name__)

    app.config["JWT_SECRET_KEY"] = "super-secret"
    s = URLSafeTimedSerializer('Thisisasecret!')
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = 'mnenadmm@gmail.com'
    # use the app password created 
    app.config['MAIL_PASSWORD'] = 'wognlvxeopcbdnid'#ovo je sifra koju smo pokupili sa googla i radi samo za racunare
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    sender = 'mnenadmm@gmail.com'
    #app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=48)#token ce trajati 100 sati i nakon toga se se uz pomoc funkcije osveziti
    app.permanent_session_lifetime = timedelta(minutes=1000)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    #CORS(app)supports_credentials,
    CORS(app, supports_credentials=True)
    app.config['SQLALCHEMY_DATABASE_URI'] =string_za_konekciju
    app.config["SECRET_KEY"] = "thisisseacretkey"
    

    from modeli import db
    db.init_app(app)
    
    return [app, db,s,sender]

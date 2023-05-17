from flask import Flask,redirect, request,render_template, jsonify, url_for, session 
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt_identity,jwt_required,JWTManager,unset_jwt_cookies,get_jwt
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_mail import Mail, Message
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import sqlalchemy
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_session import Session
from konekcija import *


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
# instantiating the mail service only after the 'app.config' to avoid error   
mail = Mail(app)
jwt = JWTManager(app)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=48)#token ce trajati 100 sati i nakon toga se se uz pomoc funkcije osveziti
engine = create_engine('postgresql://nenad:781022Sone@postgres/app_magacin')
app.permanent_session_lifetime = timedelta(minutes=1000)

#CORS(app)
CORS(app, supports_credentials=True)


app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'


app.config['SQLALCHEMY_DATABASE_URI'] =string_za_konekciju
app.config["SECRET_KEY"] = "thisisseacretkey"
db = SQLAlchemy(app)

class Korisnici(db.Model, UserMixin):
	__tablename__ = 'korisnici'

	id_korisnika = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250),nullable=False,  unique=True)
	password = db.Column(db.String(250), nullable=False)
	email = db.Column(db.String(250),  unique=True)
	prva_rola = db.Column(db.Boolean)
	druga_rola = db.Column(db.Boolean)
	treca_rola = db.Column(db.Boolean)
	verification = db.Column(db.Boolean)
	block_user = db.Column(db.Boolean)
	
	def rola_1(self): #ime funkcije se mora razlikovati od vrednosti
		return self.prva_rola # prva_rola se povlaci iz baze
	def rola_2(self):
		return self.druga_rola
	def rola_3(self):
		return self.treca_rola
	# ovo su metode koje dolaze uz biblioteku
	# oznacava da je korisnik verifikovan
	def is_authenticated(self):
		return True
	# korisnik je aktivan
	def is_active(self): 
		return True 
	# id korisnika
	def get_id(self):
		return self.id_korisnika

@login_manager.user_loader
def load_user(user_id):
    return Korisnici.query.get(int(user_id))
def proveriEmail(email):
	try:
		baza = psycopg2.connect(**konekcija)
		mycursor = baza.cursor()
		mycursor.execute(f"""select email from public.korisnici where email = '{email}'; """)
		rezultat = mycursor.fetchall()
		baza.close()
		if rezultat :
			odgovor = True
		else:
			odgovor = False
	except :
		print('ovo je greska ')
	return odgovor
#proverava da li je user zauzet
def proveriUser(username):
   try:
      baza = psycopg2.connect(**konekcija)
      mycursor = baza.cursor()
      mycursor.execute(f"""select username from public.korisnici where username = '{username}' """)
      rezultat = mycursor.fetchone()
      baza.close()
      if rezultat:
         odgovor = True
      else:
         odgovor = False
   except :
      print('ovo je greska ')
   return odgovor

#############stefaaaaa#####	
#kreiranje modela koje je definisan u bazi
with app.app_context():
    #create_schemas()
    db.create_all()
   # db.session.commit() sa Gita 


@app.teardown_request
def session_clear(exception=None):
    db.session.remove()
    if exception and db.session.is_active:
        db.session.rollback()
########## stefaaa kraj ##########



    

		

####################### LOGOVANJE ##################################	
@app.route('/login', methods=['GET', 'POST'])
def login():
	username = request.json.get("username",None)
	password = request.json.get("password",None)
	#trazi korisnika u bazi
	user = Korisnici.query.filter_by(username=username).first()
	if user:
		#ako pronadje korisnika uporedjuje passworde	
		if check_password_hash(user.password, password):
			#proverava da li je user blokiran
			if user.block_user:
				msg=f'Korisnik {user.username} je blokiran'
				return jsonify(msg)
			# proverava verifikacijue za tog korisnika
			if user.verification == True: # Proverava da li je user verifikovan u bazi
				#ova metoda loguje usera
				login_user(user)
				# cuva sve u sessiji
				db.session.commit()
				response={'prijava': True,
	      				  'idKorisnika': current_user.get_id(),
						  'username' : current_user.username,
						  'rola_1'   : current_user.rola_1()
						  
						}
				return jsonify(response)
			else:
				msg=f'Nalog za korisnika {user.username} nije verifokovan.'
				return jsonify(msg)

		msg=f'Uneli ste pogresno korisnicko ime ili lozinku'
		return jsonify(msg) 
	msg=f'Uneli ste pogresno korisnicko ime ili lozinku'
	return jsonify(msg) 
@app.route("/logoutR", methods=["POST","GET"])
@login_required # zakljucava ako korisnik nije ulogovan
def logoutR():
    response = jsonify({"msg": "Odjavili ste se"})
    #brisanje
    db.session.remove()
    #odjavljivanje usera
    logout_user()
    return response

########################### LOGOVANJE KRAJ##############################################

# primer dodatog komentara
@app.route('/sada',methods=["POST","GET"])

def kreirajTabelu():
	
	baza = psycopg2.connect(**konekcija)
	mycursor = baza.cursor()
	mycursor.execute(f"""
				select id_kolaca,ime_kolaca,opis_kolaca
					from kolaci
					where dodata_receptura =true;
			""")
	rezultat = mycursor.fetchall() #fetchone()
	baza.close()
	return jsonify(rezultat)
	

#daje listu sirovina 
@app.route('/izlistaj/sirovine/react',methods=['GET','POST'])
@login_required
def izlistajSirovineReact():
	if current_user.is_authenticated():
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			try:
				baza = psycopg2.connect(**konekcija)
				mycursor = baza.cursor()
				mycursor.execute(f"""
				select  sirovine.id_sirovine,sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca,dobavljaci.id_dobavljaca
					from sirovine
					INNER JOIN dobavljaci
					on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca;
				""")
				rezultat = mycursor.fetchall()
				baza.close()	
				return jsonify(rezultat)
			except:
				msg={
				'error': True,
				'poruka': 'Nemate ovlascenje da pristupate sirovinama'
				}
				return jsonify(msg)
		else:
			msg={
				'error': True,
				'poruka': 'Morate se ulogovati da bi ste pristupili sirovinama'
			}
			return jsonify(msg)
@app.route('/dajImeDobavljacaIdReact')
@login_required
def dajImeDobavljacaIdReact():
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
		baza = psycopg2.connect(**konekcija)
		mycursor = baza.cursor()
		mycursor.execute(f"""
				select id_dobavljaca, ime_dobavljaca from public.dobavljaci;
			""")
		rez=mycursor.fetchall()
		baza.close()
		return jsonify(rez)
	else:
		rez="nemate pristup ovom delu aplikacjije"
		return jsonify(rez)
# daje sirovine po dobavljacu 
@app.route('/sirovinePoDobavljacuReact/<int:idDobavljaca>',methods=['GET'])
@login_required
def sirovinePoDobavljacuReact(idDobavljaca):
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():	
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					 select sirovine.id_sirovine, sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca
					from sirovine 
					inner JOIN dobavljaci
					on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca
					where sirovine.id_dobavljaci = {idDobavljaca};
					""")
			rez = mycursor.fetchall()
			baza.close()
			return jsonify(rez)
		except:
			msg={
				'error': True,
				'poruka': 'Neuspela konekcija sa bazom'
			}
			return jsonify(msg)
	else:
		msg={
				'error': True,
				'poruka': 'Morate se ulogovati da bi ste pristupili sirovinama'
			}
		return jsonify(msg)

@app.route('/dodajSirovinuReact',methods=['POST','GET'])
@login_required
def dodajSirovinuReact():
	if current_user.rola_1() or current_user.rola_2():
		try:
			data = request.get_json()
			imeSirovine=data['imeSirovine']
			cenaSirovine= data['cenaSirovine']
			idDobavljaca = data['idDobavljaca']
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					insert into public.sirovine(naziv_sirovine,cena_sirovine,id_dobavljaci)
					values('{imeSirovine}',{cenaSirovine},{idDobavljaca});
					""")
			baza.commit()
			baza.close()
			msg='Uspesno ste dodali sirovinu ',imeSirovine,' sa cenom ',cenaSirovine,'.'
			return jsonify(msg)
		except:
			msg={
				'error': True,
				'poruka': 'Neuspela konekcija sa bazom'
			}
			return jsonify(msg)
	else:
		msg={
			'error': True,
			'poruka': ' Niste ovlasceni da dodajete sirovine sirovinama.'
		}
		return jsonify(msg)
#lista dobavljaca
@app.route('/dajDobavljaceReact',methods=['GET'])
@login_required
def dajDobavljaceReact():
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					select id_dobavljaca, ime_dobavljaca, telefon, email,adresa
					from dobavljaci;
				""") 
			rez = mycursor.fetchall()
			return jsonify(rez)
		except:
			msg={
				'error': True,
				'poruka': 'Neuspela konekcija sa bazom'
			}
			return jsonify(msg)
	else:
		msg={
				'error': True,
				'poruka': 'Nemate pristup ovom delu aplikacije'
			}
		return jsonify(msg)
@app.route('/dodajDobavljacaReact',methods=['POST'])
@login_required
def dodajDobavljacaReact():
	if current_user.rola_1() or current_user.rola_2():
		data = request.get_json()
		imeDobavljaca = data['imeDobavljaca']
		emailDobavljaca=data['emailDobavljaca']
		telefonDobavljaca=data['telefonDobavljaca']
		adresa=data['adresa']
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					insert into dobavljaci(ime_dobavljaca,email,telefon,adresa)
					values('{imeDobavljaca}','{emailDobavljaca}','{telefonDobavljaca}','{adresa}')
				""")
			baza.commit()
			baza.close()
			rez='Dodali ste dobavljaca ',imeDobavljaca,'.'
			return jsonify(rez)
		except :
			msg={
				'error': True,
				'poruka': 'Neuspela konekcija sa bazom'
			}
			return jsonify(msg)
	else:
		msg={
			'error': True,
			'poruka': 'Nemate pristup ovom delu aplikacije.'
		}
		return jsonify(msg)
@app.route('/azurirajDobavljacaReact',methods=['POST'])
@login_required
def azurirajDobavljacaReact():
	if current_user.rola_1() or current_user.rola_2():
		try:
			data = request.get_json()
			idDobavljaca =data['idDobavljaca']
			imeDobavljaca = data['imeDobavljaca']
			telefon = data['telefon']
			email = data['email']
			adresa= data['adresa']
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					UPDATE public.dobavljaci
					set ime_dobavljaca='{imeDobavljaca}',email='{email}',
					telefon='{telefon}',adresa='{adresa}'
					where id_dobavljaca ={idDobavljaca};
							""")
			baza.commit()
			baza.close()
			msg='Za dobavljaca ' +imeDobavljaca+  ' ste promenili '
			return jsonify(msg)	
		except :
			msg={
					'error': True,
					'poruka': 'Neuspela konekcija sa bazom '
			 		}
			return jsonify(msg)
	else:
		msg={
		      'error': True,
				'poruka': 'Nemate pristup ovom delu aplikacije.'
			}
		return jsonify(msg)
#azuriranje sirovine
@app.route('/azurirajSirovinuReact',methods=['POST'])
@login_required
def azurirajSirovinuReact():
	if current_user.rola_1() or current_user.rola_2():
		data = request.get_json()
		imeSirovine = data['imeSirovine']
		cenaSirovine = data['cenaSirovine']
		idDobavljaca = data['idDobavljaca']
		idSirovine = data['idSirovine']
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					update public.sirovine
					set naziv_sirovine='{imeSirovine}',cena_sirovine={cenaSirovine},
					id_dobavljaci={idDobavljaca}
					where id_sirovine={idSirovine}
				""")
			baza.commit()
			baza.close()
			rez=f"Uspesno ste azurirali sirovinu {imeSirovine}"
			return jsonify(rez)

		except :
			rez="Doslo je do greske sa konekcijom"
			return jsonify(rez),422

	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez),10
#za brisanje sirovine
@app.route('/obrisiSirovinuReact',methods=['POST'])
@login_required
def obrisiSirovinuReact():
	if current_user.rola_1():
		data = request.get_json()
		idSirovine=data['idSirovine']
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					delete from public.sirovine
					where id_sirovine={idSirovine};
				""")
			baza.commit()
			baza.close()
			rez='obrisali ste sirovinu ',idSirovine
			return jsonify(rez)

		except :
			rez="Doslo je do greske sa konekcijom"
			return jsonify(rez),422

	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez),10
@app.route('/dajlistuKolacaReact', methods=['GET'])
@login_required
def dajlistuKolacaReact():
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					select id_kolaca,ime_kolaca,opis_kolaca
					from kolaci
					where dodata_receptura =true;
					
				""")
			
			rez=mycursor.fetchall()
			return jsonify(rez),10

		except :
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez),10
	else:
		rez='Nemate pristup ovom delu aplikacijeeeeee'
		return jsonify(rez)
@app.route('/napraviKolacReact' , methods=['POST'])
@login_required
def napraviKolacReact():
	if current_user.rola_1() or current_user.rola_2():
		data = request.get_json()
		imeKolaca = data['imeKolaca']
		postupak = data['postupak']
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					insert into kolaci(ime_kolaca, opis_kolaca)
                    values('{imeKolaca}','{postupak}');
				""")
			baza.commit()
			baza.close()
			rez ='uspesno ste kreirali kolac ',imeKolaca
			return jsonify(rez)
        	
		except :
			rez='Nemate pristup ovom delu aplikacije'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/azurirajKolacReact',methods=['POST'])
@login_required
def azurirajKolacReact():
	if current_user.rola_1():
		data = request.get_json()
		idKolaca = data['idKolaca']
		imeKolaca = data['imeKolaca']
		postupak = data['postupak']
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
				update kolaci
				set ime_kolaca='{imeKolaca}',opis_kolaca='{postupak}'
				where id_kolaca={idKolaca};
				""")
			baza.commit()
			baza.close()
			rez=f"Kolac {imeKolaca} je uspesno azuriran"
			return jsonify(rez)
		except :
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/obrisiKolacReact', methods=['POST'])
@login_required
def obrisiKolacReact():
	if current_user.rola_1():
		data = request.get_json()
		idKolaca = data['idKolaca']
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					delete from kolaci
					where id_kolaca={idKolaca};
				""")
			baza.commit()
			baza.close()
			rez=f"Uspesno ste obrisali kolac sa id-em: {idKolaca}"
			return jsonify(rez)
		except :
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#lista kolaca bez recepture
@app.route('/dajlistuKolacaBezReceptureReact')
@login_required
def dajlistuKolacaBezReceptureReact():
	if current_user.rola_1() or current_user.rola_2():
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select id_kolaca,ime_kolaca,opis_kolaca
				from kolaci
				where dodata_receptura =false;
				""")
			rez=mycursor.fetchall()
			baza.close()
			return jsonify(rez)
		except:
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		print('nismo')
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez)
#daje ime kolaca za prikaz u recepturama
@app.route('/dajImeKolacaReact/<int:idKolaca>')
@login_required
def dajImeKolacaReact(idKolaca):
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select ime_kolaca from kolaci
				where id_kolaca={idKolaca};
				""")
			rez=mycursor.fetchall()
			baza.close()
			return jsonify(rez)
		except:
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez)
#1pravljenje recepture
#2dodavanje potvrde da je receptura napravljena u kolace
@app.route('/napraviRecepturuReact', methods=['POST'])
@login_required
def napraviRecepturuReact():
	if current_user.rola_1():
		data = request.get_json()
		idKolaca = data['idKolaca']
		kolicina= data['kolicina']
		idSirovine = data['idSirovine']
		
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				insert into recepture(id_kolaca,id_sirovine,kolicina)
				values({idKolaca},{idSirovine},{kolicina});
				""")
			baza.commit()
			baza.close()
			
		except:
			e='Neuspela konekcija sa bazom'
			print(e)
		
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
						update kolaci
						set dodata_receptura=True
						where id_kolaca={idKolaca};
					""")
			baza.commit()
			baza.close()

		except:
			e='Neuspela konekcija sa bazom'
			print(e)
		rez="sirovine je uspesno dodata u recepturu"
		return jsonify(rez)
	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez)
#daje cenu  jedne sirovinu na osnovu id-a koristi se za recepture
@app.route('/dajJednuSirovinuReact/<int:idSirovine>')
@login_required
def dajJednuSirovinuReact(idSirovine):
	if current_user.rola_1():
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select id_sirovine,cena_sirovine
				from sirovine
				where id_sirovine={idSirovine};
				""")
			rez=mycursor.fetchone()
			baza.close()
			return jsonify(rez)
		except :
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez)
@app.route('/listaKolacaNaslovReact')
@login_required
def listaKolacaNaslovReact():
	if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					select id_kolaca,ime_kolaca,opis_kolaca
					from kolaci
					where dodata_receptura =true;
				""")
			rez=mycursor.fetchall() #fetchall() fetchone()
			return jsonify(rez)
		except:
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/dajRecepturuReact/<int:idKolaca>')
@login_required
def dajRecepturuReact(idKolaca):
	if current_user.rola_1() or current_user.rola_2():
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,sirovine.cena_sirovine,
					round(cast(recepture.kolicina*(sirovine.cena_sirovine-sirovine.cena_sirovine*recepture.rabat/100)as numeric),2):: double precision,recepture.rabat
					from recepture
					INNER JOIN sirovine
					on recepture.id_sirovine=sirovine.id_sirovine
					where recepture.id_kolaca={idKolaca};
				""")
			rez=mycursor.fetchall()
			baza.close()
			return jsonify(rez)
		except:
			rez='Neuspela konekcija sa bazom'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#za azuriranje recepture
@app.route('/azurirajKolicinuRecepturaReact', methods=['POST'])
@login_required
def azurirajKolicinuRecepturaReact():
	if current_user.rola_1():
		data =request.get_json()
		idKolaca= data['idKolaca']
		idSirovine = data['idSirovine']
		kolicina = data['kolicina']
		imeSirovine=data['imeSirovine']
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				update recepture
				set kolicina={kolicina}
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""")
			baza.commit()
			baza.close()
			rez=f'Za sirovinu {imeSirovine} ste promenili kolicinu u {kolicina}. '
			return jsonify(rez)
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez),20
	else:
		rez ="Nemate pristup ovom delu aplikacije"
		return jsonify(rez),10
#brise sirovinu iz recepture
@app.route('/ukloniSirovinuRecepturaReact', methods=['POST'])
@login_required
def ukloniSirovinuRecepturaReact():
	if current_user.rola_1():
		data =request.get_json()
		idKolaca=data['idKolaca']
		idSirovine=data['idSirovine']
		imeSirovine=data['imeSirovine']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				delete from recepture
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""")
			baza.commit()
			baza.close()
			rez=f'Uklonili ste sirovinu {imeSirovine} iz recepture.'
			return jsonify(rez)
		except :
			
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez),20
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#dodaje sirovinu u potojiecu recepturu
@app.route('/dodajSirovinuURecepturu', methods=['POST'])
@login_required
def dodajSirovinuURecepturu():
	if current_user.rola_1():
		data =request.get_json()
		idKolaca=data['idKolaca']
		kolicina=data['kolicina']
		idSirovine=data['idSirovine']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				insert into recepture(id_kolaca,id_sirovine,kolicina)
				values({idKolaca},{idSirovine},{kolicina});
				""")
			baza.commit()
			baza.close()
			rez='Uspesno ste dodali sirovinu'
			return jsonify(rez)
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez),20
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/dajPostupakZaRecepturu/<int:idKolaca>')
@login_required
def dajPostupakZaRecepturu(idKolaca):
	if current_user.rola_1() or current_user.rola_2():
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					select opis_kolaca from public.kolaci
                    where id_kolaca ={idKolaca};
				""")
			rez=mycursor.fetchall()
			baza.close()
			return jsonify(rez)
		except :
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/azurirajRabat', methods=['POST'])
@login_required
def azuriraRabat():
	if current_user.rola_1():
		data =request.get_json()
		imeKolaca=data['imeKolaca']
		imeSirovine=data['imeSirovine']
		rabat=data['rabat']
		idSirovine=data['idSirovine']
		idKolaca=data['idKolaca']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
				update recepture
				set rabat ={rabat}
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""")
			baza.commit()
			baza.close()
			rez=f'Za recepturu kolaca {imeKolaca} ste promenili rabat za sirovinu {imeSirovine} u {rabat} %'
			return jsonify(rez)
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez)

#administrator


@app.route('/administrator', methods=['GET'])
@login_required
def administrator():
	if current_user.get_id() == 1: 
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select id_korisnika,username,email,telefon,adresa,
				prva_rola,druga_rola,treca_rola,block_user
				from korisnici
				where id_korisnika >1 and verification =True and block_user=False;
				""")
			rez = mycursor.fetchall()
			baza.close()
		except :
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select id_korisnika,username,email,telefon,adresa,
				block_user
				from korisnici
				where id_korisnika >1 and block_user =True;
				""")
			block=mycursor.fetchall()
			
			baza.close()
		except :
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				select id_korisnika,username, email, telefon,adresa,block_user
				from korisnici
				where id_korisnika >1 and verification=False and block_user=False;

				""")
			bezVerifikacije=mycursor.fetchall()
			baza.close()
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
		return jsonify(rez,block,bezVerifikacije)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#za azuriranje korisnika
@app.route('/adminAzurirajKorisnika',methods=['POST'])
@login_required
def adminAzurirajKorisnika():
	if current_user.get_id() == 1:
		data=request.get_json()
		username = data['username']
		rola_1=data['rola_1']
		rola_2=data['rola_2']
		rola_3=data['rola_3']
		idKorisnika=data['idKorisnika']
		block_user=data['block_user']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				update korisnici
				set prva_rola={rola_1},druga_rola={rola_2},treca_rola={rola_3},
				block_user={block_user}
				where id_korisnika = {idKorisnika};
				""")
			baza.commit()
			baza.close()
			rez=f"Za korisnika {username} ste azurirali pristupne role."

			return jsonify(rez)
		except :
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#blokiraj-odblokiraj korisnika
@app.route('/adminBlokirajKorisnika',methods=['POST'])
@login_required
def adminBlokirajKorisnika():
	if current_user.get_id() == 1:
		data= request.get_json()
		username=data['username']
		idKorisnika=data['idKorisnika']
		block_user=data['block_user']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				update korisnici
				set block_user={block_user}
				where id_korisnika={idKorisnika};
				""")
			baza.commit()
			baza.close()
			if block_user==True:
				rez=f"Korisnik {username} je blokiran."
			else:
				rez=f"Korisnik {username} je odblokiran."
			return jsonify(rez)
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)

	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#odblokiraj korisnika
@app.route('/adminVratiKorisnika',methods=['POST'])
@login_required
def adminVratiKorisnika():
	if current_user.get_id() == 1:
		data= request.get_json()
		username=data['username']
		idKorisnika=data['idKorisnika']
		
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				update korisnici
				set block_user=false
				where id_korisnika={idKorisnika};
				""")
			baza.commit()
			baza.close()
			
			rez=f"Korisnik {username} je odblokiran."
			return jsonify(rez)
			
		except:
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)

	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
#za brisanje korisnika
@app.route('/obrisiKorisnikaAdmin',methods=['POST'])
@login_required
def obrisiKorisnikaAdmin():
	if current_user.get_id() == 1:
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		username=data['username']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
				delete from korisnici
				where id_korisnika={idKorisnika};
				""")
			baza.commit()
			baza.close()
			rez=f'Obrisali ste korisnika  {username}'
			return jsonify(rez)
		except :
			rez='Nesto nije u redu sa konekcijom ka bazi'
			return jsonify(rez)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10


 ####################################################################
@app.route('/', methods=['GET', 'POST'])
def pocetna():
	
	
	return 'hello from flask'










		
	

 ############### PITATI STEFU STA SA LINKOM ZA VERIFIKACIJU  
#Kreiranje novih korisnika react
#Kreiranje novih korisnika react
#Proverava dali je email zauzet

@app.route('/kreirajKorisnikaReact',methods=['POST'])
def kreirajKorisnikaReact():
   data =request.get_json()
   username=data['username']
   sifra=data['password']
   email= data['email']
   adresa= data['adresa']
   telefon= data['telefon']
   proveraEmail=proveriEmail(email) #Proverava da li je email zauzet
   proveraUser =proveriUser(username)#Proverava da li je user zauzet
   if proveraUser ==True:
      return jsonify({"msg": "User je zauzet"}), 10
   if proveraEmail == True:
      return jsonify({"msg": "Email je zauzet"}), 20
   skriveniPassword = generate_password_hash(sifra) #hashuje password
   baza = psycopg2.connect(**konekcija)
   mycursor = baza.cursor()
   mycursor.execute(f"""
   		INSERT INTO public.korisnici(username,email,telefon,adresa,password)
   		values('{username}','{email}','{telefon}','{adresa}','{skriveniPassword}')
   	""")
   baza.commit()
   baza.close()
   print(f"Uspesno ste kreirali korisnika {username}")
   recipient =email
   token = s.dumps(email, salt='kljuc_za_token')
   message = f"""Verifikijte svoj nalog  http://localhost:3000/verifikujNalog?token={token}"""
   subject = 'Verifikacioni nalog'
   msg = Message(subject,sender=sender,recipients =[recipient] )
   msg.body = message
   mail.send(msg)
   rez=f'Poslat vam je email {username} '
   print(rez)
   return  jsonify(username)


	
   

    	


	#odgovor=False
	#try:
	#	baza =psycopg2.connect(**konekcija) 
	#	mycursor = baza.cursor()
	#	mycursor.execute(f"""
	#		SELECT password,id_korisnika,user_name,prva_rola, druga_rola,
	#				treca_rola,verification
	#				FROM public.korisnici
	#				WHERE user_name='{username}' and block_user = False;
	#		""")
	#	rezultat = mycursor.fetchone()
	#	print(rezultat)
	#	if rezultat:#ako postoji mailu bazi
	#		provera=check_password_hash(rezultat[0], password)#uporedjuje oassword
	#		
	#		if provera :#ako jepassword ispravan
	#			odgovor = True
	#			print('ispravan password ',provera)
	#		else:#password nije isprava
	#			print('uneli ste pogresno korisnicko ime ili lozinku ',provera)
	#	else:#nema rezultata
	#		print('uneli ste pogresno korisnicko ime ili lozinku ', rezultat)
	#except Error as e:
	#	print('ovo je greska ',e)
	#if odgovor:
	#	if rezultat[6]==1:
	#		
	#		id = rezultat[1]
	#		korisnik=rezultat[2]
	#		rola_1=rezultat[3]
	#		rola_2=rezultat[4]
	#		rola_3=rezultat[5]
	#		access_token = create_access_token(identity=korisnik)
	#		print('responseeeeeeeeee')
	#		response = {"access_token":access_token,
    #            "id":id,"korisnik":korisnik,"rola_1":rola_1,"rola_2":rola_2,"rola_3":rola_3}
	#		return response
	#	else:
	#		msg='Vas nalog nije verifikovan '
	#		return jsonify(msg),800
	#else:
	#	return jsonify({"msg": "Pogresno korisnicko ime ili lozinka"}), 401



#za verifikaciju tokena
@app.route('/verifikujNalog/<token>', methods=['POST','GET'])
def verifikujNalog(token):
	token=s.loads(token, salt='kljuc_za_token', max_age=600)
	provera=proveriToken(token)
	if provera==True:
		poruka='Nalog je vec verifikovan'
		return jsonify(poruka)
	else:
		try:
			baza = psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
				update public.korisnici
				set verification=True
				where email='{token}';
				
				""")
			baza.commit()
			baza.close()
			msg ='Nalog je verifokovan'
			return jsonify(msg)
		except Error as e:
			print(e)
		rez="Nesto nije u redu"
		return jsonify(rez)
#metoda za proveru verifikacije
def proveriToken(email):
	try:
		odgovor = False
		baza = psycopg2.connect(**konekcija)
		mycursor = baza.cursor()
		mycursor.execute(f"""
				select verification
				from public.korisnici
				where email='{email}' and verification =True;
				""")
		rezultat=mycursor.fetchone()
		
		baza.close()
		if rezultat:
			odgovor=True
			return odgovor
		else:
			odgovor=False
			return odgovor
	except Error as e:
		print(e)

#ukoliko istekne vreme zaverifikaciju
@app.route('/posaljiDrugiToken/<token>',methods=['POST','GET'])
def posaljiDrugiToken(token):
	token=s.loads(token, salt='kljuc_za_token')#ovde otkljucavamo token
	email=token
	print('token =',email)
	provera=proveriToken(email)
	if provera==True:
		poruka='Nalog je vec verifikovan'
		return jsonify(poruka)
	else:
		recipient =email
		token = s.dumps(token, salt='kljuc_za_token')#zakljucavamo token
		message = f"""Verifikijte svoj nalog  http://localhost:8080/verifikujNalog?token={token}"""
		subject = 'Verifikacioni nalog'
		msg = Message(subject,sender=sender,recipients =[recipient] )
		msg.body = message
		mail.send(msg)
		poruka=f"Na email {email} smo vam poslali verifikacioni kod"
		return jsonify(poruka)
#za slanje linka za promenu passworda 
@app.route('/forgotPassword',methods=['POST','GET'])
def forgotPassword():
	data =request.get_json()
	email=data['email']
	rezultat=proveriEmail(email)
	if rezultat== True:
		recipient =email
		token = s.dumps(email, salt='kljuc_za_token')
		message = f'Ovo je link za resetovanje lozinke, verifikacioni tokon ce Vam trajati 5 minuta. http://localhost:3000/ChangePassword?token={token}'
		subject = 'promeni password'
		msg = Message(subject,sender=sender,recipients =[recipient] )
		msg.body = message
		mail.send(msg)
		return jsonify(email)
	else:
		msg=f"{email} ne postoji"
		return jsonify(msg),10
#otkljucavamo token koji smo primili na emailu
@app.route('/ChangePasswordK/<token>', methods=['GET','POST'])
def ChangePassword(token):
	email = s.loads(token, salt='kljuc_za_token', max_age=600)
	#otkljucavamo token i sa tajnim kljucem i dajemo mu da traje 300 sekundi
	msg=email
	return jsonify(msg)
#promena passworda
@app.route('/noviPassword/<token>', methods=['POST'])
def noviPassword(token):
	data = request.get_json()
	mail = s.loads(token, salt='kljuc_za_token', max_age=600)
	password = data['password']
	skriveniPassword = generate_password_hash(password)
	try:
		baza= psycopg2.connect(**konekcija)
		mycursor = baza.cursor()
		mycursor.execute(f"""
			update public.korisnici
			set password='{skriveniPassword}'
			where email='{mail}';
			""")
		baza.commit()
		baza.close()
		msg=f'Uspesno ste promenili password za korisnika {mail}'
		return jsonify(msg)
	except Error as e:
		print(e)



   





	

	
	
	

		





   
@app.route('/obrisiDobavljacaReact', methods=['POST'])
@jwt_required() #new line
def obrisiDobavljacaReact():
	if request.headers.get('rola_1')==True or request.headers.get('rola_2')==True or   request.headers.get('IdKorisnika')=='1':
		data=request.get_json()
		idDobavljaca = data['idDobavljaca']
		try:
			baza=psycopg2.connect(**konekcija)
			mycursor = baza.cursor()
			mycursor.execute(f"""
					delete from public.dobavljaci
					where id_dobavljaca={idDobavljaca}
				""")
			baza.commit()
			baza.close()
			rez="Uspesno ste obrisali dobavljaca",idDobavljaca
			return jsonify(rez)
		except Error as e:
			print(e)
		
		
	else:
		rez="Nemate pristup ovom delu aplikacije"
		return jsonify(rez),10





















		

@app.route('/dodajPodsetnik', methods=['POST','GET'])
@jwt_required() #new line
def dodajPodsetnik():
	if request.headers.get('IdKorisnika')=='1'or request.headers.get('rola_1')=='1' or request.headers.get('rola_2')=='1' or request.headers.get('rola_3')=='1':
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		datum=data['datum']
		mesec=data['mesec']
		godina=data['godina']
		text=data['text']
		boja=data['boja']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
					INSERT INTO podsetnik(idKorisnika,datum,mesec,godina,text,boja)
					values({idKorisnika},{datum},'{mesec}',{godina},'{text}','{boja}');
				""")
			baza.commit()
			baza.close()
			
			rez=f'Uspesno ste dodali podsetnik'
			return jsonify(rez),200
		except Error as e:
			print('Greska u bazi ',e)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/dajPodsetnik/<int:datum>/<mesec>/<int:godina>/<int:idKorisnika>')
@jwt_required() 
def dajPodsetnik(datum,mesec,godina,idKorisnika):
	try:
		baza= psycopg2.connect(**konekcija)
		mycursor=baza.cursor()
		mycursor.execute(f"""
			select text,boja,idPodsetnika from podsetnik
			where datum={datum} and mesec='{mesec}' and godina={godina} and idKorisnika={idKorisnika};
			""")
		rez=mycursor.fetchall()
		baza.close()
		print(rez)
		return jsonify(rez)
	except Error as e:
		print(e)
@app.route('/obrisiPodsetnik', methods=['POST'])
@jwt_required()
def obrisiPodsetnik():
	if request.headers.get('IdKorisnika')=='1'or request.headers.get('rola_1')=='1' or request.headers.get('rola_2')=='1' or request.headers.get('rola_3')=='1':
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		idPodsetnika=data['idPodsetnika']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
					delete from podsetnik
					where idPodsetnika={idPodsetnika} and idKorisnika={idKorisnika};
				""")
			baza.commit()
			baza.close()

			print(f'Obrisali ste podsetnik br:{idPodsetnika} br.{idPodsetnika}')
			return jsonify(f'Obrisali ste podsetnik  br:idPodsetnika')
		except Error as e:
			print(e)
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
@app.route('/AdminDodajPodsetnik',methods=['GET','POST'])
@jwt_required()
def AdminDodajPodsetnik():
	if request.headers.get('IdKorisnika')=='1':
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		datum=data['datum']
		mesec=data['mesec']
		godina=data['godina']
		text=data['text']
		boja=data['boja']
		imeKomercijaliste=data['imeKomercijaliste']
		komercijalista=data['komercijalista']
		try:
			baza= psycopg2.connect(**konekcija)
			mycursor=baza.cursor()
			mycursor.execute(f"""
					INSERT INTO podsetnik(idKorisnika,datum,mesec,godina,text,boja)
					values({komercijalista},{datum},'{mesec}',{godina},'{text}','{boja}');

				""")
			baza.commit()
			baza.close()
			return jsonify(f'Dodali ste podsetnik korisniku {imeKomercijaliste}'),200
		except Error as e:
			print(e)	
	else:
		rez='Nemate pristup ovom delu aplikacije'
		return jsonify(rez),10
if __name__ == '__main__':
    # moze da se podesi IP adresa, port i mogucnost za automatsko cuvanje i usvajanje promena (koda)
    app.run('0.0.0.0', 5000, debug=True)
from flask import request, jsonify, url_for, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from flask_mail import Mail, Message
import psycopg2
from werkzeug.security import generate_password_hash, check_password_hash
import applicationSetup
from konekcija import *
import sql as sqlQuery
import metode
import modeli
import json
with open('./data.json', 'r') as f:
	notification = json.load(f)
# metoda create_app() napravi instancu aplikacije i napravi model u bazi podataka
[app,db,s,sender] = applicationSetup.create_app()
mail = Mail(app)
jwt = JWTManager(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
#registrujemo example)
#iz foldera api uvozimo blueprint
from api.example_blueprint import nesa
from api.apiDobavljaci import apiDobavljaci
from api.apiKolaci import apiKolaci
from api.apiRecepture import apiRecepture
from api.apiSirovine import apiSirovine
from api.admin import adminApi
#registrujemo blueprint
app.register_blueprint(apiDobavljaci)
app.register_blueprint(apiSirovine)
app.register_blueprint(apiKolaci)
app.register_blueprint(nesa)
app.register_blueprint(apiRecepture)
app.register_blueprint(adminApi)

#daje id usera, dolazi uz login_menager
@login_manager.user_loader
def load_user(user_id):
    return modeli.Korisnici.query.get(int(user_id))
#############stefaaaaa#####	
#kreiranje modela koje je definisan u bazi
with app.app_context():
    #create_schemas()
    db.create_all()
@app.teardown_request
def session_clear(exception=None):
    db.session.remove()
    if exception and db.session.is_active:
        db.session.rollback()
########## stefaaa kraj ##########


@app.route('/a',methods=["POST","GET"])
def pocetak():
	

	rezultat=f'pocetna   '
	return rezultat
	#return str(notification['sirovine'])
@app.route('/sada',methods=["POST","GET"])
def kreirajTabelu():
			
	return jsonify(sqlQuery.returnAll("select * from recepture;"))

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
   proveraEmail = metode.proveriEmail(email) #Proverava da li je email zauzet
   proveraUser = metode.proveriUser(username) #Proverava da li je user zauzet
   if proveraUser ==True:
      return jsonify({
			'errorUser': True,
	      	"poruka": f"Korisnicko ime {username} je zauzeto"
				})
   if proveraEmail == True:
      return jsonify({
			'errorEmail': True,
	      	"poruka": f"Email {email} je zauzet."})
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
   
   rezultat={
	   "poruka":f"""Na email {email} smo vam poslali verifikacioni token, molimo Vas da kliknete na link i time
	   potvrdiote verifikaciju"""
   }
   return  jsonify(rezultat)
####################### LOGOVANJE ##################################	
@app.route('/login', methods=['GET', 'POST'])
def login():
	username = request.json.get("username",None)
	password = request.json.get("password",None)
	#trazi korisnika u bazi
	user = modeli.Korisnici.query.filter_by(username=username).first()
	if user:
		#ako pronadje korisnika uporedjuje passworde	
		if check_password_hash(user.password, password):
			#proverava da li je user blokiran
			if user.block_user:
				return jsonify(notification['error']['blockUser'])
			# proverava verifikacijue za tog korisnika
			if user.verification == True: # Proverava da li je user verifikovan u bazi
				#ova metoda loguje usera
				login_user(user)
				# cuva sve u sessiji
				db.session.commit()
				response={'prijava': True,
	      				  'idKorisnika': current_user.get_id(),
						  'username' : current_user.username,
						  'rola_1'   : current_user.rola_1(),
						  'rola_2'   : current_user.rola_2(),
						  'rola_3'   : current_user.rola_3()
						}
				return jsonify(response)
			else:
				return jsonify(notification['error']['nemaVrifikacije'])
		else:
			return jsonify(notification['error']['pogresnaLozinka'])
	else:
		return jsonify(notification['error']['pogresnaLozinka'])
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
 ############### PITATI STEFU STA SA LINKOM ZA VERIFIKACIJU  
#za verifikaciju tokena
@app.route('/verifikujNalog/<token>', methods=['POST','GET'])
def verifikujNalog(token):
	token=s.loads(token, salt='kljuc_za_token', max_age=600)
	provera=proveriToken(token)
	if provera==True:
		return jsonify(notification['imaVerifikacije']['poruka'])
	else:
		msg ='Nalog je verifokovan'
		return jsonify(sqlQuery.commitBaza(f"""
			update public.korisnici
			set verification=True
			where email='{token}';
			""",f"{notification['imaVerifikacije']['poruka']} ."))
#metoda za proveru verifikacije
def proveriToken(email):
	odgovor = False
	rezultat=sqlQuery.commitBaza(f"""
			select verification
			from public.korisnici
			where email='{email}' and verification =True;
			""","")
	if rezultat:
		odgovor=True
		return odgovor
	else:
		odgovor=False
		return odgovor
#ukoliko istekne vreme zaverifikaciju
@app.route('/posaljiDrugiToken/<token>',methods=['POST','GET'])
def posaljiDrugiToken(token):
	token=s.loads(token, salt='kljuc_za_token')#ovde otkljucavamo token
	email=token
	provera=proveriToken(email)
	if provera==True:
		return jsonify(notification['imaVerifikacije']['poruka'])
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
	rezultat = metode.proveriEmail(email)
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
	except :
		print('error cod 458')
if __name__ == '__main__':
    # moze da se podesi IP adresa, port i mogucnost za automatsko cuvanje i usvajanje promena (koda)
    app.run('0.0.0.0', 5000, debug=True)
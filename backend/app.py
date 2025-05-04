from flask import request, jsonify, session
from applicationSetup import create_app
from modeli import db
from flask_cors import CORS
#from flask_jwt_extended import JWTManager
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
#vezba 
from messages import *
from time import localtime, strftime
from sqlalchemy import inspect, text


with open('./data.json', 'r') as f:
	notification = json.load(f)
# metoda create_app() napravi instancu aplikacije i napravi model u bazi podataka
[app,db,s,sender] = applicationSetup.create_app()
###################################



# Konfiguracija login-a
mail = Mail(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Registrovanje blueprintova
from api.apiDobavljaci import apiDobavljaci
from api.apiKolaci import apiKolaci
from api.apiRecepture import apiRecepture
from api.apiSirovine import apiSirovine
from api.admin import adminApi

# Registrovanje blueprintova u aplikaciju
app.register_blueprint(apiDobavljaci)
app.register_blueprint(apiSirovine)
app.register_blueprint(apiKolaci)
app.register_blueprint(apiRecepture)
app.register_blueprint(adminApi)

# Konfiguracija login-a
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Teardown session
@app.teardown_request
def session_clear(exception=None):
    db.session.remove()
    if exception and db.session.is_active:
        db.session.rollback()
# Load user za login
@login_manager.user_loader
def load_user(user_id):
    return modeli.Korisnici.query.get(int(user_id))
# Ruta za sve tabele u bazi
@app.route('/tables', methods=['GET'])
def get_tables():
    try:
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        return jsonify({"tables": tables}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/proba')
def proba():
    try:
        db.session.execute(text('SELECT 1'))
        return "✅ Konekcija uspešna!", 200
    except Exception as e:
        return f"❌ Konekcija sa bazom nije uspela: {str(e)}", 500
	

@app.route('/index', methods=['GET', 'POST'])
def index():
    
    useri=sqlQuery.returnAll(f"""
        			select * from test_tabela;
        
        			""")
    return jsonify(useri)
	##return jsonify(sqlQuery.returnAll("""
	#					select  sirovine.id_sirovine,sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca,dobavljaci.id_dobavljaca
	#					from sirovine
	#					INNER JOIN dobavljaci
	#					on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca;
	#				"""))
	    
	
		


	
####################### LOGOVANJE ##################################	
#### koristi se za logovanje ##########
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
						  'rola_3'   : current_user.rola_3(),
						  'infoKorisnika':current_user.infoKorisnika()
						}
				return jsonify(response)
			else:
				return jsonify(notification['error']['nemaVrifikacije'])
		else:
			return jsonify(notification['error']['pogresnaLozinka'])
	else:
		return jsonify(notification['error']['pogresnaLozinka'])
#### logout#####cur###############
@app.route("/logoutR", methods=["POST"])
@login_required # zakljucava ako korisnik nije ulogovan
def logoutR():
    #brisanje
    db.session.remove()
    #odjavljivanje usera
    logout_user()
    #allUsers.remove(current_user.username)
    return jsonify(notification['login']['logout'])
@app.route('/kreirajKorisnikaReact',methods=['POST'])
def kreirajKorisnikaReact():
   data =request.get_json()
   ime=data['ime']
   prezime=data['prezime']
   username=data['username']
   sifra=data['password']
   email= data['email']
   adresa= data['adresa']
   telefon= data['telefon']
   proveraEmail = metode.proveriEmail(email) #Proverava da li je email zauzet
   proveraUser = metode.proveriUser(username) #Proverava da li je user zauzet
   if proveraUser ==True:
      
      return msgOneArg(username).errorUser()
   if proveraEmail == True:
      #vrcamo medotu koja kreira data.json i vraca ga
      return msgOneArg(email).errorEmail()
   skriveniPassword = generate_password_hash(sifra) #hashuje password
   sqlQuery.commitBaza(f"""
   		INSERT INTO public.korisnici(username,email,telefon,adresa,password,ime_korisnika,prezime_korisnika)
   		values('{username}','{email}','{telefon}','{adresa}','{skriveniPassword}','{ime}','{prezime}')
   	""",'')
   recipient =email
   token = s.dumps(email, salt='kljuc_za_token')
   message = f"""Verifikijte svoj nalog  http://localhost:3000/verifikujNalog?token={token}"""
   subject = 'Verifikacioni nalog'
   msg = Message(subject,sender=sender,recipients =[recipient] )
   msg.body = message
   mail.send(msg) 
   return msgOneArg(email).sendEmail()
   

########################### LOGOVANJE KRAJ##############################################
 ############### PITATI STEFU STA SA LINKOM ZA VERIFIKACIJU  
#za verifikaciju tokena

@app.route('/verifikujNalog/<token>', methods=['POST','GET'])
def verifikujNalog(token):
	token=s.loads(token, salt='kljuc_za_token', max_age=600)#vrati na 600
	provera=metode.proveriToken(token)
	if provera==True:
		return jsonify(notification['imaVerifikacije']['poruka']) 
	else:
		
		return jsonify(sqlQuery.commitBaza(f"""
			update public.korisnici
			set verification=True
			where email='{token}';
			""",notification['imaVerifikacije']['poruka'])) 

#ukoliko istekne vreme zaverifikaciju
@app.route('/posaljiDrugiToken/<token>',methods=['POST','GET'])
def posaljiDrugiToken(token):
	token=s.loads(token, salt='kljuc_za_token')#ovde otkljucavamo token
	email=token
	provera=metode.proveriToken(email)
	if provera==True:
		return jsonify(notification['imaVerifikacije']['poruka'])
	else:
		recipient =email
		token = s.dumps(token, salt='kljuc_za_token')#zakljucavamo token
		message = f"""Verifikijte svoj nalog  http://localhost:3000/verifikujNalog?token={token}"""
		subject = 'Verifikacioni nalog'
		msg = Message(subject,sender=sender,recipients =[recipient] )
		msg.body = message
		mail.send(msg)
		return jsonify(f"Na vas email smo vam poslali drugi verifikacioni token")
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
	sqlQuery.commitBaza(f"""
		update public.korisnici
		set password='{skriveniPassword}'
		where email='{mail}';
		""",'')
	return jsonify(msgOneArg(mail).changePassword())

###################################
from flask_cors import CORS
from flask_socketio import SocketIO, emit,send,join_room, leave_room
#vidi sa Stefom sta je odobreno na corsu za socketio
socketio = SocketIO(app,logger=True, engineio_logger=True,cors_allowed_origins='*')
allUsers=[]
onlineUsers = [] 
offlineUsers= []
#konekcija

@socketio.on("connect")
def connect():
    if current_user.is_authenticated():
        join_room(current_user.id_usera())
        emit('conn',f'Connect {current_user.username}')
	#ako se id.value nalazi u dictionari u listi vratice true
    if any(current_user.id_usera()  in id.values() for id  in onlineUsers)==False:
		#ako nije u listi onda ce ga ubciti
        users={
			'id' : current_user.id_usera(),
			'username':current_user.username
		}
        onlineUsers.append(users)
    emit('connectUsers',onlineUsers,broadcast=True)
@socketio.on('disconnect')
def disconnect():
    #brisemo iz liste konektovanih korisnika
    for item in onlineUsers:
        if item.get('id')== current_user.id_usera():
            onlineUsers.remove(item)
            emit('connectUsers',onlineUsers,broadcast=True)
	
    
#prima evente sa fronta
#kada se koristi send(data) rezervisani event na fronut je messages
# emit su prilagodjeni eventi, i na frontu se tako i primaju
#prvi argument je naziv emita
def ack():
    emit('isporuceno','poruka je isporucena',room=current_user.id_usera())
@socketio.on('message')
def message(data):
	if current_user.is_authenticated():
		emit('messageResponse',data,room=data['room'])
		sqlQuery.commitBaza(f"""
					INSERT INTO messages(id_usera,id_primalac,poruka,soba,datum,online)
			    	values({data['idKorisnika']},{data['room']},'{data['messages']}',{data['idKorisnika']+data['room']},'{data['vreme']}',true);
						""","")
		#Ako user nije online onda abdejtujemo poruku [online=false] u bazi
		if any(data['room']  in id.values() for id  in onlineUsers)==False:

			#update kolonu online=false zato sto je korisnik ofline 
			sqlQuery.commitBaza(f"""
					update messages
				    set online =false
				    where soba={data['idKorisnika']+data['room']} and poruka='{data['messages']}';
					""","")	
@socketio.on('typing')
def typing(data):
	emit('typingResponse', data['msg'],room=data['room'])
@app.route('/last_100/<int:soba>/<int:idKorisnika>/<int:primalac>', methods=['GET', 'POST'])
def last_100(soba,idKorisnika,primalac):
    if current_user.is_authenticated():
	#selektuje odredjenu sobu koja je zbir id-a posiljalaca i primalaca
	#takodje selektuje id posiljalaca i primalaca
        last_100=sqlQuery.returnAll(f"""
            		select id_usera,id_primalac, poruka,datum from messages
				  		where soba ={soba} and (id_usera ={idKorisnika} or id_usera ={primalac})
	    			    order by id_message NULLS LAST;
            			""")   
        return jsonify(last_100)
#primamo obavestenje za ofline poruke
@app.route('/porukaZaOfflineUsera/<int:idPrimalac>')
#@login_required
def porukaZaOfflineUsera(idPrimalac):
	if current_user.is_authenticated():
		offlinePoruka=sqlQuery.returnAll(f"""
   				select messages.id_usera,messages.id_primalac,
				korisnici.username from messages
				inner join korisnici
				on messages.id_usera=korisnici.id_korisnika
				where messages.online =false and messages.id_primalac={idPrimalac};
    	    			""") 

		return jsonify(offlinePoruka)
@app.route('/azurirajOfflinePoruke/<int:idPrimalac>')
def azurirajOfflinePoruke(idPrimalac):
	if current_user.is_authenticated():
		return jsonify(sqlQuery.commitBaza(f"""
   				update messages
			     set online=true
			     where id_primalac={idPrimalac};
    	    			""","sve je ok"))


            

if __name__ == '__main__':
    app, _, _, _ = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)

  
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

#
# Mora da se proveri ova metoda, za sada je pod komentarima
# obvezna metoda za logovanje, ne moze se bez nje izlogovati
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


@app.route('/',methods=["POST","GET"])
def pocetak():
	

	rezultat='pocetna'
	return notification['sirovine']['commitSirovina']
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

# primer dodatog komentara

	

#daje listu sirovina 
@app.route('/izlistaj/sirovine/react',methods=['GET','POST'])
@login_required
def izlistajSirovineReact():
	if current_user.is_authenticated():
		if current_user.block()==False:
			if current_user.rola_1() or current_user.rola_2() or current_user.rola_3()  :
				return jsonify(sqlQuery.returnAll("""
						select  sirovine.id_sirovine,sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca,dobavljaci.id_dobavljaca
						from sirovine 
						INNER JOIN dobavljaci
						on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca;
					"""))
			else:
				return jsonify(notification['error']['nemaPristupa'])
		else:
			return jsonify(notification['error']['blockUser'])
@app.route('/dajImeDobavljacaIdReact')
@login_required
def dajImeDobavljacaIdReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
					select id_dobavljaca, ime_dobavljaca from public.dobavljaci;
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
# daje sirovine po dobavljacu 
@app.route('/sirovinePoDobavljacuReact/<int:idDobavljaca>',methods=['GET'])
@login_required
def sirovinePoDobavljacuReact(idDobavljaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():	
			return jsonify(sqlQuery.returnAll(f"""
				select sirovine.id_sirovine, sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca
				from sirovine 
				inner JOIN dobavljaci
				on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca
				where sirovine.id_dobavljaci = {idDobavljaca};
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#########################################################
##############sirovine<<<<<@@@@@@@@@@@@@@@@@@#######
@app.route('/dodajSirovinuReact',methods=['POST','GET'])
@login_required
def dodajSirovinuReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			imeSirovine=data['imeSirovine']
			cenaSirovine= data['cenaSirovine']
			idDobavljaca = data['idDobavljaca']
			return  jsonify(sqlQuery.commitBaza(f"""
				insert into public.sirovine(naziv_sirovine,cena_sirovine,id_dobavljaci)
				values('{imeSirovine}',{cenaSirovine},{idDobavljaca});
				""",f"{notification['sirovine']['commitSirovina']} {imeSirovine} ."))	
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#lista dobavljaca
@app.route('/dajDobavljaceReact',methods=['GET'])
@login_required
def dajDobavljaceReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
				select id_dobavljaca, ime_dobavljaca, telefon, email,adresa
				from dobavljaci;
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/dodajDobavljacaReact',methods=['POST'])
@login_required
def dodajDobavljacaReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			imeDobavljaca = data['imeDobavljaca']
			emailDobavljaca=data['emailDobavljaca']
			telefonDobavljaca=data['telefonDobavljaca']
			adresa=data['adresa']
			return jsonify(sqlQuery.commitBaza(f"""
				insert into dobavljaci(ime_dobavljaca,email,telefon,adresa)
				values('{imeDobavljaca}','{emailDobavljaca}','{telefonDobavljaca}','{adresa}')
				""",f"{notification['dobavljaci']['commitDobavljac']} {imeDobavljaca} ."))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/azurirajDobavljacaReact',methods=['POST'])
@login_required
def azurirajDobavljacaReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			idDobavljaca =data['idDobavljaca']
			imeDobavljaca = data['imeDobavljaca']
			telefon = data['telefon']
			email = data['email']
			adresa= data['adresa']
			return jsonify(sqlQuery.commitBaza(f"""
				UPDATE public.dobavljaci
				set ime_dobavljaca='{imeDobavljaca}',email='{email}',
				telefon='{telefon}',adresa='{adresa}'
				where id_dobavljaca ={idDobavljaca};
						""",f"{notification['dobavljaci']['updateDobavljac']  }"))	
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#azuriranje sirovine
@app.route('/azurirajSirovinuReact',methods=['POST'])
@login_required
def azurirajSirovinuReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			imeSirovine = data['imeSirovine']
			cenaSirovine = data['cenaSirovine']
			idDobavljaca = data['idDobavljaca']
			idSirovine = data['idSirovine']
			rez=imeSirovine
			return jsonify(sqlQuery.commitBaza(f"""
				update public.sirovine
				set naziv_sirovine='{imeSirovine}',cena_sirovine={cenaSirovine},
				id_dobavljaci={idDobavljaca}
				where id_sirovine={idSirovine}
				""",f"{imeSirovine}"))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#za brisanje sirovine
@app.route('/obrisiSirovinu',methods=['POST'])
@login_required
def obrisiSirovinuReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			idSirovine=data['idSirovine']
			return jsonify(sqlQuery.commitBaza(f"""
				delete from public.sirovine
				where id_sirovine={idSirovine};
				""",f"{notification['sirovine']['deleteSirovina']}"))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/dajlistuKolacaReact', methods=['GET'])
@login_required
def dajlistuKolacaReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
				select id_kolaca,ime_kolaca,opis_kolaca
				from kolaci
				where dodata_receptura =true;	
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/napraviKolacReact' , methods=['POST'])
@login_required
def napraviKolacReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			imeKolaca = data['imeKolaca']
			postupak = data['postupak']
			return jsonify(sqlQuery.commitBaza(f"""
				insert into kolaci(ime_kolaca, opis_kolaca)
                values('{imeKolaca}','{postupak}');
				""",f"{notification['kolaci']['commitKolac']} {imeKolaca}."))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/azurirajKolacReact',methods=['POST'])
@login_required
def azurirajKolacReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			idKolaca = data['idKolaca']
			imeKolaca = data['imeKolaca']
			postupak = data['postupak']
			return jsonify(sqlQuery.commitBaza(f"""
				update kolaci
				set ime_kolaca='{imeKolaca}',opis_kolaca='{postupak}'
				where id_kolaca={idKolaca};
				""",f"{notification['kolaci']['updateKolac']} {imeKolaca}."))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/obrisiKolacReact', methods=['POST'])
@login_required
def obrisiKolacReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			idKolaca = data['idKolaca']
			return jsonify(sqlQuery.commitBaza(f"""
				delete from kolaci
				where id_kolaca={idKolaca};
				""",f"{notification['kolaci']['deleteKolac']} "))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#lista kolaca bez recepture
@app.route('/dajlistuKolacaBezReceptureReact')
@login_required
def dajlistuKolacaBezReceptureReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			return jsonify(sqlQuery.returnAll(f"""
				select id_kolaca,ime_kolaca,opis_kolaca
				from kolaci
				where dodata_receptura =false;
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#daje ime kolaca za prikaz u recepturama
@app.route('/dajImeKolacaReact/<int:idKolaca>')
@login_required
def dajImeKolacaReact(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
				select ime_kolaca from kolaci
				where id_kolaca={idKolaca};
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#1pravljenje recepture
#2dodavanje potvrde da je receptura napravljena u kolace
@app.route('/napraviRecepturuReact', methods=['POST'])
@login_required
def napraviRecepturuReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			idKolaca = data['idKolaca']
			kolicina= data['kolicina']
			idSirovine = data['idSirovine']
			return jsonify(sqlQuery.commitBaza(
				f"""
				insert into recepture(id_kolaca,id_sirovine,kolicina)
				values({idKolaca},{idSirovine},{kolicina});
				"""," "
			),sqlQuery.commitBaza(
				f"""
					update kolaci
					set dodata_receptura=True
					where id_kolaca={idKolaca};
				""",f"{notification['recepture']['commitReceptura']}"
			))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#daje cenu  jedne sirovinu na osnovu id-a koristi se za recepture
@app.route('/dajJednuSirovinuReact/<int:idSirovine>')
@login_required
def dajJednuSirovinuReact(idSirovine):
	if current_user.block()==False:
		if current_user.rola_1():
			return jsonify(sqlQuery.returnOne(f"""
				select id_sirovine,cena_sirovine
				from sirovine
				where id_sirovine={idSirovine};
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/listaKolacaNaslovReact')
@login_required
def listaKolacaNaslovReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			return jsonify(sqlQuery.returnAll("""
					select id_kolaca,ime_kolaca,opis_kolaca
					from kolaci
					where dodata_receptura =true;
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/dajRecepturuReact/<int:idKolaca>')
@login_required
def dajRecepturuReact(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			return jsonify(sqlQuery.returnAll(f"""
				select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,sirovine.cena_sirovine,
				round(cast(recepture.kolicina*(sirovine.cena_sirovine-sirovine.cena_sirovine*recepture.rabat/100)as numeric),2):: double precision,recepture.rabat
				from recepture
				INNER JOIN sirovine
				on recepture.id_sirovine=sirovine.id_sirovine
				where recepture.id_kolaca={idKolaca};
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])		
	else:
		return jsonify(notification['error']['blockUser'])
#za azuriranje recepture
@app.route('/azurirajKolicinuRecepturaReact', methods=['POST'])
@login_required
def azurirajKolicinuRecepturaReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data =request.get_json()
			idKolaca= data['idKolaca']
			idSirovine = data['idSirovine']
			kolicina = data['kolicina']
			imeSirovine=data['imeSirovine']
			return jsonify(sqlQuery.commitBaza(f"""
				update recepture
				set kolicina={kolicina}
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""",f"Za sirovinu {imeSirovine} {notification['recepture']['updateRecepture']} {kolicina}"))
		else:
			return jsonify(notification['error']['nemaPristupa'])	
	else:
		return jsonify(notification['error']['blockUser'])
#brise sirovinu iz recepture
@app.route('/ukloniSirovinuRecepturaReact', methods=['POST'])
@login_required
def ukloniSirovinuRecepturaReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data =request.get_json()
			idKolaca=data['idKolaca']
			idSirovine=data['idSirovine']
			imeSirovine=data['imeSirovine']
			return jsonify(sqlQuery.commitBaza(f"""
				delete from recepture
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""",f" {notification['recepture']['deleteSirovina']}{imeSirovine}"))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#dodaje sirovinu u potojiecu recepturu
@app.route('/dodajSirovinuURecepturu', methods=['POST'])
@login_required
def dodajSirovinuURecepturu():
	if current_user.block()==False:
		if current_user.rola_1():
			data =request.get_json()
			idKolaca=data['idKolaca']
			kolicina=data['kolicina']
			idSirovine=data['idSirovine']
			return jsonify(sqlQuery.commitBaza(f"""
				insert into recepture(id_kolaca,id_sirovine,kolicina)
				values({idKolaca},{idSirovine},{kolicina});
				""",f" {notification['recepture']['commitSirovina']}"))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/dajPostupakZaRecepturu/<int:idKolaca>')
@login_required
def dajPostupakZaRecepturu(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			return jsonify(sqlQuery.returnAll(f"""
				select opis_kolaca from public.kolaci
                where id_kolaca ={idKolaca};
				"""))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/azurirajRabat', methods=['POST'])
@login_required
def azuriraRabat():
	if current_user.block()==False:
		if current_user.rola_1():
			data =request.get_json()
			imeKolaca=data['imeKolaca']
			imeSirovine=data['imeSirovine']
			rabat=data['rabat']
			idSirovine=data['idSirovine']
			idKolaca=data['idKolaca']
			return jsonify(sqlQuery.commitBaza(f"""
				update recepture
				set rabat ={rabat}
				where id_kolaca={idKolaca} and id_sirovine={idSirovine};
				""",f"Za kolac {imeKolaca} {notification['recepture']['azurirajRabat']} {imeSirovine} u {rabat} %."))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
@app.route('/obrisiDobavljacaReact', methods=['POST'])
@login_required
def obrisiDobavljacaReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data=request.get_json()
			idDobavljaca = data['idDobavljaca']
			imeDobavljaca = data['imeDobavljaca']
			return jsonify(sqlQuery.commitBaza(f"""
				delete from public.dobavljaci
				where id_dobavljaca={idDobavljaca}
				""",f"{notification['dobavljaci']['deleteDobavljac']} {imeDobavljaca}."))
		else:
			return jsonify(notification['error']['nemaPristupa'])
	else:
		return jsonify(notification['error']['blockUser'])
#administrator
@app.route('/administrator', methods=['GET'])
@login_required
def administrator():
	if current_user.get_id() == 1: 
		#vraca verifikovane, ne verifikovane i blokirane korisnike
			return jsonify(sqlQuery.returnAll("""
				select id_korisnika,username,email,telefon,adresa,
				prva_rola,druga_rola,treca_rola,block_user
				from korisnici
				where id_korisnika >1 and verification =True and block_user=False;
					"""),
					sqlQuery.returnAll("""
						select id_korisnika,username,email,telefon,adresa,
				block_user
				from korisnici
				where id_korisnika >1 and block_user =True;
					"""
					),
					sqlQuery.returnAll("""
						select id_korisnika,username, email, telefon,adresa,block_user
				from korisnici
				where id_korisnika >1 and verification=False and block_user=False;
					"""
					))
	else:
		return jsonify(notification['error']['nemaPristupa'])
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
		return jsonify(sqlQuery.commitBaza(f"""
			update korisnici
			set prva_rola={rola_1},druga_rola={rola_2},treca_rola={rola_3},
			block_user={block_user}
			where id_korisnika = {idKorisnika};
			""",f"{notification['admin']['updateRole']}  {username}."))
	else:
		return jsonify(notification['error']['nemaPristupa'])

#odblokiraj korisnika
@app.route('/adminVratiKorisnika',methods=['POST'])
@login_required
def adminVratiKorisnika():
	if current_user.get_id() == 1:
		data= request.get_json()
		username=data['username']
		idKorisnika=data['idKorisnika']
		return jsonify(sqlQuery.commitBaza(f"""
			update korisnici 
			set block_user=false
			where id_korisnika={idKorisnika};
			""",f"{notification['admin']['odblokirajKorisnika']} {username} ."))
	else:
		return jsonify(notification['error']['nemaPristupa'])
#za brisanje korisnika
@app.route('/obrisiKorisnikaAdmin',methods=['POST'])
@login_required
def obrisiKorisnikaAdmin():
	if current_user.get_id() == 2:
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		username=data['username']
		return jsonify(sqlQuery.commitBaza(f"""
			delete from korisnici
			where id_korisnika={idKorisnika};
			""",f"{notification['admin']['deleteKorisnika']} {username} ."))
	else:
		return jsonify(notification['error']['nemaPristupa'])
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
		print('error cod 1285')



if __name__ == '__main__':
    # moze da se podesi IP adresa, port i mogucnost za automatsko cuvanje i usvajanje promena (koda)
    app.run('0.0.0.0', 5000, debug=True)
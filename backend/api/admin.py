from flask import Blueprint, jsonify,request
import json
import sql as sqlQuery
from messages import *
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
with open('./data.json', 'r') as f:
	notification = json.load(f)
#deklarisemo blueprint koga koristimo u rutama
adminApi = Blueprint('adminApi', __name__)

#daje listu svih korisnika iz baze
#verifikovane, ne verifikovane i blokirane
@adminApi.route('/administrator', methods=['GET'])
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
#za omogucava administratoru da menja role,blokira i odblokira korisnike
@adminApi.route('/adminAzurirajKorisnika',methods=['POST'])
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
			""",msgOneArg(username).updateRole()))
	else:
		return notification['error']['nemaPristupa']
#odblokiraj korisnika
@adminApi.route('/adminVratiKorisnika',methods=['POST'])
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
			""",msgOneArg(username).backUser()))
	else:
		return notification['error']['nemaPristupa']
#za brisanje korisnika
@adminApi.route('/obrisiKorisnikaAdmin',methods=['POST'])
@login_required
def obrisiKorisnikaAdmin():
	if current_user.get_id() == 1:
		data =request.get_json()
		idKorisnika=data['idKorisnika']
		username=data['username']
		return jsonify(sqlQuery.commitBaza(f"""
			delete from korisnici
			where id_korisnika={idKorisnika};
			""",msgOneArg(username).deleteUser()))
	else:
		return notification['error']['nemaPristupa']
@adminApi.route('/dajNutritivnuVrSirovine/<int:idSirovine>',methods=['GET'])
@login_required
def dajNutritivnuVrSirovine(idSirovine):
	if current_user.get_id() == 1:
		response=sqlQuery.returnAll(f"""
				    select sirovine.naziv_sirovine,sirovine.cena_sirovine,dobavljaci.ime_dobavljaca, sirovine.KCAL ,
					sirovine.kj, sirovine.masti, sirovine.zasicene_masti,sirovine.ugljeni_hidrati,
					sirovine.seceri_ugljeni_hidrati,sirovine.so,sirovine.proteini
					from sirovine
					INNER JOIN dobavljaci
					on sirovine.id_dobavljaci=dobavljaci.id_dobavljaca
					where id_sirovine={idSirovine};
				""")
		
		return jsonify(response)
	else:
		return notification['error']['nemaPristupa']
@adminApi.route('/azurirajNutritivnuVrednostSirovine',methods=['POST'])
@login_required
def azurirajNutritivnuVrednostSirovine():
	if current_user.get_id() == 1:
		data =request.get_json()
		idSirovine =data['idSirovine']
		imeSirovine=data['imeSirovine']
		kcal=data['kcal']
		Kj=data['Kj']
		masti=data['masti']
		zasMasti=data['zasMasti']
		uh=data['uh']
		seceri=data['seceri']
		so=data['so']
		proteini=data['proteini']
		if kcal==None:
			kcal='null'
		if Kj ==None:
			Kj='null'
		if masti ==None:
			masti='null'
		if zasMasti ==None:
			zasMasti='null'
		if uh ==None:
			uh='null'
		if seceri==None:
			seceri='null'
		if so==None:
			so='null'
		if proteini==None:
			proteini='null'
		return jsonify(sqlQuery.commitBaza(f"""
				update public.sirovine
				set kcal={kcal},Kj={Kj},masti={masti},
				zasicene_masti={zasMasti},ugljeni_hidrati={uh},
				seceri_ugljeni_hidrati={seceri},so={so},
				proteini={proteini}
				where id_sirovine={idSirovine};
			""",'sve je proslo bravooooooooooooooo'))
	else:
		return notification['error']['nemaPristupa']

		

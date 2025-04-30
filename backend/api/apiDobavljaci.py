from flask import Blueprint, jsonify,request
import json
import sql as sqlQuery
import metode
from messages import *
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
with open('./data.json', 'r') as f:
	notification = json.load(f)

apiDobavljaci = Blueprint('apiDobavljaci', __name__)

#lista dobavljaca
@apiDobavljaci.route('/dajDobavljaceReact',methods=['GET'])
@login_required
def dajDobavljaceReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
				select id_dobavljaca, ime_dobavljaca, telefon, email,adresa
				from dobavljaci;
				"""))
		else:
			return notification['error']['nemaPristupa']
	else:
		return jsonify(notification['error']['blockUser'])
### daje samo ime i Id dobavljaca....
@apiDobavljaci.route('/dajImeDobavljacaIdReact')
@login_required
def dajImeDobavljacaIdReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
					select id_dobavljaca, ime_dobavljaca from public.dobavljaci;
				"""))
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
##### Dodaje novog dobavljac
@apiDobavljaci.route('/dodajDobavljacaReact',methods=['POST'])
@login_required
def dodajDobavljacaReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			imeDobavljaca = data['imeDobavljaca']
			emailDobavljaca=data['emailDobavljaca']
			telefonDobavljaca=data['telefonDobavljaca']
			adresa=data['adresa']
			proveriDobavljaca=metode.proveriDobavljaca(imeDobavljaca)
			if proveriDobavljaca:
				return msgOneArg(imeDobavljaca).errorDobavljac()
			return jsonify(sqlQuery.commitBaza(f"""
				insert into dobavljaci(ime_dobavljaca,email,telefon,adresa)
				values('{imeDobavljaca}','{emailDobavljaca}','{telefonDobavljaca}','{adresa}')
				""",msgOneArg(imeDobavljaca).addDobavljac()))
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
###### Azurira dbavljimaca
@apiDobavljaci.route('/azurirajDobavljacaReact',methods=['POST'])
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
						""",msgOneArg(imeDobavljaca).updateDobavljac()))	
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#### Brise dobavljaca#############
@apiDobavljaci.route('/obrisiDobavljacaReact', methods=['POST'])
@login_required
def obrisiDobavljacaReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data=request.get_json()
			idDobavljaca = data['idDobavljaca']
			imeDobavljaca = data['imeDobavljaca']
			provera=sqlQuery.returnAll(f"""
		       select sirovine.naziv_sirovine from sirovine
				inner join dobavljaci
				on sirovine.id_dobavljaci = dobavljaci.id_dobavljaca
				where sirovine.id_dobavljaci ={idDobavljaca};
		       """)
			if provera ==[]:
				return jsonify(sqlQuery.commitBaza(f"""
					delete from public.dobavljaci
					where id_dobavljaca={idDobavljaca}
					""",msgOneArg(imeDobavljaca).delDobavljac()))
			else:
				return msgTwoArg(True,provera).errorDobavljac()	
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
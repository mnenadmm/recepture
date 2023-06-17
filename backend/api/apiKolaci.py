from flask import Blueprint, jsonify,request
import json
import sql as sqlQuery
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
with open('./data.json', 'r') as f:
	notification = json.load(f)
#deklarisemo blueprint koga koristimo u rutama
apiKolaci = Blueprint('apiKolaci', __name__)

####daje listu svih kolaca kolaca
@apiKolaci.route('/dajlistuKolacaReact', methods=['GET'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#####daje listu kolaca na kojima nije napravljena receptura
@apiKolaci.route('/dajlistuKolacaBezReceptureReact')
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#### vraca ime kolaca na osnovu id-a
@apiKolaci.route('/dajImeKolacaReact/<int:idKolaca>')
@login_required
def dajImeKolacaReact(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2() or current_user.rola_3():
			return jsonify(sqlQuery.returnAll(f"""
				select ime_kolaca from kolaci
				where id_kolaca={idKolaca};
				"""))
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
	
#daje nutritivnu tabeli kolaca
@apiKolaci.route('/dajNutritivnuVrednostKolaca/<int:idKolaca>', methods=['GET'])
def dajNutritivnuVrednostKolaca(idKolaca):
	return sqlQuery.returnAll(f"""select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,
							sirovine.kcal/0.1*recepture.kolicina,sirovine.kj/0.1*recepture.kolicina,
			   				sirovine.masti/0.1*recepture.kolicina,sirovine.zasicene_masti/0.1*recepture.kolicina,
			   				sirovine.ugljeni_hidrati/0.1*recepture.kolicina,sirovine.so/0.1*recepture.kolicina,
			   				sirovine.seceri_ugljeni_hidrati/0.1*recepture.kolicina,
			   				sirovine.proteini/0.1*recepture.kolicina
							from recepture
							INNER JOIN sirovine
							on recepture.id_sirovine=sirovine.id_sirovine
							where recepture.id_kolaca={idKolaca};""")
# lista kolaca na kojima je napravljena receptura
@apiKolaci.route('/listaKolacaNaslovReact')
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
###### kreira kolac######################################
@apiKolaci.route('/napraviKolacReact' , methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return jsonify(notification['error']['blockUser'])
####AZURIRA KOLAC###########################    
@apiKolaci.route('/azurirajKolacReact',methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
############### brise kolac#####################
@apiKolaci.route('/obrisiKolacReact', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
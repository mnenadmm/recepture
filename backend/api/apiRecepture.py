from flask import Blueprint, jsonify,request
import json
import sql as sqlQuery
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
with open('./data.json', 'r') as f:
	notification = json.load(f)
#deklarisemo blueprint koga koristimo u rutama
apiRecepture = Blueprint('apiRecepture', __name__)

#daje recepturu za kolac na osnovu id-a
@apiRecepture .route('/dajRecepturuReact/<int:idKolaca>')
@login_required
def dajRecepturuReact(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			bezVr= sqlQuery.returnAll(f"""
				select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,sirovine.cena_sirovine,
				round(cast(recepture.kolicina*(sirovine.cena_sirovine-sirovine.cena_sirovine*recepture.rabat/100)as numeric),2):: double precision,recepture.rabat
				from recepture
				INNER JOIN sirovine
				on recepture.id_sirovine=sirovine.id_sirovine
				where recepture.id_kolaca={idKolaca} and sirovine.kcal IS not NULL and sirovine.kj IS not NULL
				and sirovine.masti IS not null and sirovine.zasicene_masti IS not null
				and sirovine.ugljeni_hidrati IS not NULL and seceri_ugljeni_hidrati IS not NULL
				and sirovine.proteini IS not null
				order by recepture.id_recepture  NULLS LAST;
				""")
			saVr=sqlQuery.returnAll(f"""
				select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,sirovine.cena_sirovine,
				round(cast(recepture.kolicina*(sirovine.cena_sirovine-sirovine.cena_sirovine*recepture.rabat/100)as numeric),2):: double precision,recepture.rabat
				from recepture
				INNER JOIN sirovine
				on recepture.id_sirovine=sirovine.id_sirovine
				where recepture.id_kolaca={idKolaca} and sirovine.kcal IS NULL and sirovine.kj IS  NULL
				and sirovine.masti IS null and sirovine.zasicene_masti IS  null
				and sirovine.ugljeni_hidrati IS NULL and seceri_ugljeni_hidrati IS NULL
				and sirovine.proteini IS  null
				order by recepture.id_recepture  NULLS LAST;
				""")
			kalk=sqlQuery.returnAll(f"""
				select sirovine.naziv_sirovine,sirovine.id_sirovine,recepture.kolicina,sirovine.cena_sirovine,
				round(cast(recepture.kolicina*(sirovine.cena_sirovine-sirovine.cena_sirovine*recepture.rabat/100)as numeric),2):: double precision,recepture.rabat
				from recepture
				INNER JOIN sirovine
				on recepture.id_sirovine=sirovine.id_sirovine
				where recepture.id_kolaca={idKolaca}
				order by recepture.id_recepture  NULLS LAST;""")
			return jsonify(bezVr,saVr,kalk)
		else:
			return notification['error']['nemaPristupa']	
	else:
		return notification['error']['blockUser']
#1pravljenje recepture
#2dodavanje potvrde da je receptura napravljena u kolace
@apiRecepture.route('/napraviRecepturuReact', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return jsonify(notification['error']['blockUser'])
#### daje postupak za recepturu na osnovu unetog id-a
@apiRecepture.route('/dajPostupakZaRecepturu/<int:idKolaca>')
@login_required
def dajPostupakZaRecepturu(idKolaca):
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			return jsonify(sqlQuery.returnAll(f"""
				select opis_kolaca from public.kolaci
                where id_kolaca ={idKolaca};
				"""))
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#dodaje sirovinu u potojiecu recepturu
@apiRecepture.route('/dodajSirovinuURecepturu', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#azurira kolicinu sirovine u recepturi za odredjeni kolac
@apiRecepture.route('/azurirajKolicinuRecepturaReact', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#brise sirovinu iz recepture
@apiRecepture.route('/ukloniSirovinuRecepturaReact', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#azurira rabat za odredjenu sirovinu samo za tu recepturu
@apiRecepture.route('/azurirajRabat', methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
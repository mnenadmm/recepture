from flask import Blueprint, jsonify,request
import json
import sql as sqlQuery
from messages import *
import metode
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
with open('./data.json', 'r') as f:
	notification = json.load(f)
#deklarisemo blueprint koga koristimo u rutama
apiSirovine = Blueprint('apiSirovine', __name__)

	

#########################################################
##############sirovine<<<<<@@@@@@@@@@@@@@@@@@#######
@apiSirovine.route('/dodajSirovinuReact',methods=['POST','GET'])
@login_required
def dodajSirovinuReact():
	if current_user.block()==False:
		if current_user.rola_1() or current_user.rola_2():
			data = request.get_json()
			imeSirovine=data['imeSirovine']
			cenaSirovine= data['cenaSirovine']
			idDobavljaca = data['idDobavljaca']
			proveriSirovinu=metode.proveriSirovinu(imeSirovine)
			if proveriSirovinu:
				return msgOneArg(imeSirovine).errorSirovina()
			return  jsonify(sqlQuery.commitBaza(f"""
				insert into public.sirovine(naziv_sirovine,cena_sirovine,id_dobavljaci)
				values('{imeSirovine}',{cenaSirovine},{idDobavljaca});
				""",msgOneArg(imeSirovine).addSirovina()))	
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#azuriranje sirovine##########################################################
@apiSirovine.route('/azurirajSirovinuReact',methods=['POST'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#za brisanje sirovine###########################################
@apiSirovine.route('/obrisiSirovinu',methods=['POST'])
@login_required
def obrisiSirovinuReact():
	if current_user.block()==False:
		if current_user.rola_1():
			data = request.get_json()
			idSirovine=data['idSirovine']
			imeSirovine=data['imeSirovine']
			provera = sqlQuery.returnAll(f"""
					select kolaci.ime_kolaca from kolaci
					inner join recepture
					on kolaci.id_kolaca = recepture.id_kolaca
					where recepture.id_sirovine ={idSirovine};
				""")
			if provera ==[]:
				return jsonify(sqlQuery.commitBaza(f"""
							delete from public.sirovine
							where id_sirovine={idSirovine};
							""",msgOneArg(imeSirovine).delSirovina()))
			else:
				return msgTwoArg(True,provera).errorSirovina()	
		else:
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#daje listu sirovina 
@apiSirovine.route('/izlistaj/sirovine/react',methods=['GET','POST'])
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
				return notification['error']['nemaPristupa']
		else:
			return notification['error']['blockUser']
# daje sirovine po dobavljacu 
@apiSirovine.route('/sirovinePoDobavljacuReact/<int:idDobavljaca>',methods=['GET'])
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']
#daje cenu  jedne sirovinu na osnovu id-a koristi se za recepture
@apiSirovine.route('/dajJednuSirovinuReact/<int:idSirovine>')
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
			return notification['error']['nemaPristupa']
	else:
		return notification['error']['blockUser']

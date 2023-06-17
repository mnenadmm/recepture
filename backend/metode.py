import sql as sqlQuery


def proveriEmail(email):
	if sqlQuery.returnOne(f"""select email from public.korisnici where email = '{email}'; """):
		return True
	else:
		return False
#proverava da li je user zauzet
def proveriUser(username):
   
	if sqlQuery.returnOne(f"""select username from public.korisnici where username = '{username}' """):
		return True
	else:
		return False
def proveriToken(email):
	if sqlQuery.returnOne(f"""select verification from public.korisnici where email='{email}' and verification =True; """):
		return True
	else:
		return False
def proveriSirovinu(imeSirovine):
	if sqlQuery.returnOne(f"""select naziv_sirovine  from public.sirovine where naziv_sirovine ='{imeSirovine}'; """):
		return True
	else:
		return False
def proveriDobavljaca(imeDobavljaca):
	if sqlQuery.returnOne(f"""select ime_dobavljaca  from public.dobavljaci where ime_dobavljaca ='{imeDobavljaca}'; """):
		return True
	else:
		return False







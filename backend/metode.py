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





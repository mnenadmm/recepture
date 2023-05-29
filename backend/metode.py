import sql as sqlQuery

def proveriEmail(email):
	#
	# Primer kako moze da se zameni svi upiti kroz definisanu funkciju. Kao ulazni parametar je samo sql
	#
	if sqlQuery.returnAll(f"""select email from public.korisnici where email = '{email}'; """):
		return True
	else:
		return False

#proverava da li je user zauzet
def proveriUser(username):
   
	if sqlQuery.returnOne(f"""select username from public.korisnici where username = '{username}' """):
		return True
	else:
		return False



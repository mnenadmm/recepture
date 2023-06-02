from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Korisnici(db.Model):
	__tablename__ = 'korisnici'
	id_korisnika = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250),nullable=False,  unique=True)
	password = db.Column(db.String(250), nullable=False)
	email = db.Column(db.String(250),  unique=True)
	telefon = db.Column(db.String(250))
	adresa= db.Column(db.String(250))
	prva_rola = db.Column(db.Boolean,server_default="False")
	druga_rola = db.Column(db.Boolean,server_default="False")
	treca_rola = db.Column(db.Boolean,server_default="False")
	verification = db.Column(db.Boolean,server_default="False")
	block_user = db.Column(db.Boolean,server_default="False")
	
	def rola_1(self): #ime funkcije se mora razlikovati od vrednosti
		return self.prva_rola # prva_rola se povlaci iz baze
	def rola_2(self):
		return self.druga_rola
	def rola_3(self):
		return self.treca_rola
	def block(self):
		return self.block_user
		
	# ovo su metode koje dolaze uz biblioteku
	# oznacava da je korisnik verifikovan
	def is_authenticated(self):
		return True
	# korisnik je aktivan
	def is_active(self): 
		return True 
	# id korisnika
	def get_id(self):
		return self.id_korisnika
class Sirovine(db.Model):
	__tablename__ = 'sirovine'
	id_sirovine=db.Column(db.Integer, primary_key=True)
	naziv_sirovine=db.Column(db.String(250),nullable=False,  unique=True)
	cena_sirovine=db.Column(db.Integer)
	id_dobavljaci=db.Column(db.Integer,nullable=False)
class Dobavljaci(db.Model):
	__tablename__ = 'dobavljaci'
	id_dobavljaca = db.Column(db.Integer, primary_key=True)
	ime_dobavljaca =db.Column(db.String(250),nullable=False,  unique=True)
	email = db.Column(db.String(250))
	telefon = db.Column(db.Integer)
	adresa = db.Column(db.String(250))
class Kolaci(db.Model):
	__tablename__ = 'kolaci'
	ime_kolaca =db.Column(db.String(250),nullable=False,  unique=True)
	opis_kolaca =db.Column(db.String(250))
	proizvodna_cena_kolaca=db.Column(db.Float,server_default='0')
	id_kolaca=db.Column(db.Integer, primary_key=True)
	dodata_receptura=db.Column(db.Boolean,server_default="False")
class Recepture(db.Model):
	__tablename__= 'recepture'
	id_recepture =db.Column(db.Integer, primary_key=True)
	id_kolaca =db.Column(db.Integer,nullable=False)
	id_sirovine = db.Column(db.Integer,nullable=False)
	kolicina = db.Column(db.Integer,server_default='0')
	rabat=db.Column(db.Integer,server_default='0')

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Korisnici(db.Model):
	__tablename__ = 'korisnici'

	id_korisnika = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(250),nullable=False,  unique=True)
	password = db.Column(db.String(250), nullable=False)
	email = db.Column(db.String(250),  unique=True)
	prva_rola = db.Column(db.Boolean)
	druga_rola = db.Column(db.Boolean)
	treca_rola = db.Column(db.Boolean)
	verification = db.Column(db.Boolean)
	block_user = db.Column(db.Boolean)
	
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


import psycopg2

import konekcija

def returnOne(sql):
    try:
        baza = psycopg2.connect(**konekcija.konekcija)
        mycursor = baza.cursor()
        mycursor.execute(sql)
        rezultat = mycursor.fetchone()
    except:
        rezultat = False
        print('ovo je greska ')
    finally:
        mycursor.close()
        baza.close()
        return rezultat

def returnAll(sql):
    try:
        baza = psycopg2.connect(**konekcija.konekcija)
        mycursor = baza.cursor()
        mycursor.execute(sql)
        rezultat = mycursor.fetchall()
    except:
        msg={
            'error': True,
			'poruka': 'Neuspela veza sa bazom'
        }
        rezultat = msg
        print('ovo je greska ')
    finally:
        mycursor.close()
        baza.close()
        return rezultat
def commitBaza(sql,messages):
    try:
        baza = psycopg2.connect(**konekcija.konekcija)
        mycursor = baza.cursor()
        mycursor.execute(sql)
        baza.commit()
       
        rezultat =messages
    except:
        msg={
            'error': True,
			'poruka': 'Neuspela veza sa bazom sql'
        }
        rezultat = msg
    finally:
        mycursor.close()
        baza.close()
        return  rezultat
def vezba(sql):
    try:
        baza = psycopg2.connect(**konekcija.konekcija)
        mycursor = baza.cursor()
        mycursor.execute(sql)
        baza.commit()
        
        rezultat =True
    except:
        msg={
            'error': True,
			'poruka': 'Neuspela veza sa bazom'
        }
        rezultat = False
    finally:
        mycursor.close()
        baza.close()
        return  rezultat





        
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
        rezultat = False
        print('ovo je greska ')
    finally:
        mycursor.close()
        baza.close()
        return rezultat
        
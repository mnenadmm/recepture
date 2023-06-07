
import json

with open('./data.json', 'r') as file:
        notification = json.load(file)
        file.close()
#arg 1 je ime kljuca arg 2 je vrednost
def write_jsonOneArg(i,new_data, filename='data.json'):
    notification[i]=new_data
    a_file = open("./data.json", "w")
    json.dump(notification, a_file,indent = 4)
    a_file.close()       
        
#clasa za messages koja uzima jedan argument
class msgOneArg:
    def __init__(self, x):
        self.x=x   
    
    def changePassword(self):
        return "Uspesno ste promenili password za korisnika  "+self.x
    def errorEmail(self):
        y = {
            "errorEmail": True,
            "poruka": "Email "+self.x+" je zauzet"
            }
        i="probaEmail"
        write_jsonOneArg(i,y)
        return notification[i]
    def errorUser(self):
        y = {
            "errorUser": True,
            "poruka": "Username "+self.x+" je zauzet."
            }
        i="probaUser"
        write_jsonOneArg(i,y)
        return notification[i]
   
    def sendEmail(self):
        y = {
            "error": False,
            "poruka":"Na email "+self.x+" poslat je verifikacijioni token."
        }
        i="kreirajKorisnika"
        write_jsonOneArg(i,y)
        return notification[i]
    def deleteUser(self):
        y ={
            "deleteUser":"Obrisali ste korisnika "+self.x+" ."
        }
        i = "admin"
        write_jsonOneArg(i,y)
        return notification[i]['deleteUser']
    def backUser(self):
        y ={
            "backUser": "Odblokirali ste korisnika "+self.x+" ."
        }
        i = "admin" 
        write_jsonOneArg(i,y)  
        return notification[i]['backUser']
    def updateRole(self):
        y ={
            "updateRole": "Azurirali ste role za korisnika "+self.x+" ."
        }
        i = "admin" 
        write_jsonOneArg(i,y)  
        return notification[i]['updateRole']
    def delDobavljac(self):
        y ={
            "deleteDobavljac": "Obrisali ste dobavljaca "+self.x+" ."
        }
        i = "dobavljaci"
        write_jsonOneArg(i,y) 
        return notification[i]["deleteDobavljac"]
    def addDobavljac(self):
        y = {
            "commitDobavljac": "Dodali ste dobavljaca "+self.x+" ."
        }
        i = "dobavljaci"
        write_jsonOneArg(i,y) 
        return notification[i]["commitDobavljac"]
    def updateDobavljac(self):
        y ={
            "updateDobavljac":"Za dobavljaca "+self.x+" ste promenili "
        }
        i = "dobavljaci"
        write_jsonOneArg(i,y)
        return notification[i]["updateDobavljac"]
      
 #clasa za messages koja uzima dva argumenta   
class msgTwoArg:
    def __init__(self, x,y):
        self.x=x
        self.y=y
    def changeSomething(self):
        return "Vas email je "+self.x+" a vase ime je "
    def errorDobavljac(self):
        y={
            "proveraSirovine": self.x,
            "poruka": self.y
        }
        i = "dobavljaci"
        write_jsonOneArg(i,y)
        return  notification[i]
    def errorSirovina(self):
        y={
            "proveraRecepture": self.x,
            "poruka": self.y
        }
        i = "sirovine"
        write_jsonOneArg(i,y)
        return  notification[i]

            


     

    
        

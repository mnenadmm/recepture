from flask import  jsonify,request
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
        return jsonify({
			'errorEmail': notification[i]['errorEmail'],
	      	"poruka": notification[i]['poruka']})
    def errorUser(self):
        y = {
            "errorUser": True,
            "poruka": "User "+self.x+" je zauzet"
            }
        i="probaUser"
        write_jsonOneArg(i,y)
        return jsonify({
			'errorUser': notification[i]['errorUser'],
	      	"poruka": notification[i]['poruka']})

	        




                
            
 #clasa za messages koja uzima dva argumenta   
class msgTwoArg:
    def __init__(self, x,y):
        self.x=x
        self.y=y
    def changeSomething(self):
        return "You are changed something "+self.x+" and something "+self.y
    



     

    
        

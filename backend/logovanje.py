from flask import Blueprint

logovanje = Blueprint('logovanje', __name__)

@logovanje.route('/logs')
def logovanje():
    return "logovnje"
    #return jsonify(sqlQuery.returnAll("select * from recepture;"))



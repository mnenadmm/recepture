from app import app

@app.route('/proba', methods=['GET', 'POST'])
def login():
    return True

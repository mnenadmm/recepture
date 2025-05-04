# kreiraj_tabele.py
from applicationSetup import create_app

[app, db, _, _] = create_app()

with app.app_context():
    try:
        db.create_all()
        print("✔️ Tabele su uspešno kreirane.")
    except Exception as e:
        print(f"❌ Greška pri kreiranju tabela: {e}")
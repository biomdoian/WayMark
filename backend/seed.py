# backend/seed.py
from app import app
from models import db, User, Trip, WayMark

with app.app_context():
    db.drop_all()
    db.create_all()

    # 1. Create User
    ian = User(username="Ian Biomdo", email="ian@example.com", password_hash="123")
    db.session.add(ian)
    db.session.commit()

    # 2. Create a Trip
    trip = Trip(
        title="Nairobi to Nakuru POV",
        subtitle="A rainy drive through the Rift Valley escarpment.",
        body="## The Escarpment\nThe view was misty as I passed Mai Mahiu...",
        user_id=ian.id,
        video_url="https://res.cloudinary.com/demo/video/upload/dog.mp4"
    )
    db.session.add(trip)
    db.session.commit()

    # 3. Add a Pin
    pin = WayMark(label="View Point", latitude=-1.23, longitude=36.67, trip_id=trip.id)
    db.session.add(pin)
    db.session.commit()

    print("Database Seeded! Refresh your browser.")
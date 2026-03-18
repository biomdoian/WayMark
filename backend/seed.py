from app import app
from models import db, User, Trip, WayMark

with app.app_context():
    print("Deleting existing data...")
    WayMark.query.delete()
    Trip.query.delete()
    User.query.delete()

    print("Creating sample user...")
    ian = User(username="Ian_POV", email="ian@example.com", password_hash="hashed_pw")
    db.session.add(ian)
    db.session.commit()

    print("Creating sample POV drive...")
    drive_1 = Trip(
        title="Sunset Drive through Nairobi",
        description="A smooth evening cruise capturing the city lights.",
        video_url="https://your-video-link.com/nairobi-pov.mp4",
        user_id=ian.id
    )
    db.session.add(drive_1)
    db.session.commit()

    print("Adding WayMarks...")
    m1 = WayMark(
        label="Kenyatta Avenue Junction",
        story="This is where the city really comes alive at night.",
        latitude=-1.286389,
        longitude=36.817223,
        timestamp_in_video=120, # 2 minutes in
        trip_id=drive_1.id
    )
    
    db.session.add(m1)
    db.session.commit()

    print("Database seeded successfully! 🚗💨")
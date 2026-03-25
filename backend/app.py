from flask import Flask, make_response, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Trip, WayMark, User
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

# Configure CORS to allow your React frontend on port 8080
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})

@app.route('/')
def home():
    return jsonify({"message": "WayMark API is running!"})

# --- USER & AUTH ROUTES ---

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    try:
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({"error": "User already exists"}), 400
            
        new_user = User(
            username=data.get('username') or data.get('full_name'),
            email=data.get('email'),
            bio="Adventurer and WayMark storyteller." # Default bio
        )
        new_user.password_hash = data.get('password') 
        
        db.session.add(new_user)
        db.session.commit()
        
        # Return the full user object so the frontend can log them in immediately
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and user.password_hash == data.get('password'):
        # Return full dictionary so frontend has ID, Username, Email, and Bio
        return jsonify(user.to_dict()), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route('/users/<int:id>', methods=['PATCH'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    data = request.get_json()
    
    try:
        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']
        if 'bio' in data:
            user.bio = data['bio']
            
        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- CHRONICLE ROUTES ---

@app.route('/chronicles', methods=['GET'])
def get_chronicles():
    try:
        trips = Trip.query.all()
        result = []
        for trip in trips:
            trip_dict = {
                "id": str(trip.id),
                "title": trip.title,
                "subtitle": trip.subtitle,
                "body": trip.body,
                "video_url": trip.video_url,
                "status": trip.status,
                "linkedWaymarks": [
                    {
                        "id": str(wm.id), 
                        "title": wm.label, 
                        "lat": wm.latitude, 
                        "lng": wm.longitude
                    } for wm in trip.waymarks
                ],
                "author": {"name": trip.user.username if trip.user else "Explorer", "avatarUrl": ""},
                "publishedAt": "Mar 25, 2026"
            }
            result.append(trip_dict)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/chronicles', methods=['POST'])
def create_chronicle():
    data = request.get_json()
    try:
        new_trip = Trip(
            title=data.get('title'),
            subtitle=data.get('subtitle'),
            body=data.get('body'),
            status=data.get('status', 'published'),
            user_id=data.get('user_id'),
            video_url=data.get('video_url')
        )
        db.session.add(new_trip)
        db.session.commit()
        return jsonify({"message": "Chronicle created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

@app.route('/waymarks', methods=['POST'])
def add_waymark():
    data = request.get_json()
    try:
        wm = WayMark(
            label=data.get('title'),
            latitude=data.get('lat'),
            longitude=data.get('lng'),
            trip_id=data.get('trip_id')
        )
        db.session.add(wm)
        db.session.commit()
        return jsonify({"message": "Waymark added successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5555, debug=True)
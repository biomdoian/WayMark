from flask import Flask, make_response, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from models import db, Trip, WayMark
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

@app.route('/')
def index():
    return {"message": "WayMark API is running!"}

@app.route('/trips', methods=['GET'])
def get_trips():
    trips = Trip.query.all()
    # Returns all trips and their nested waypoints
    return make_response(
        [trip.to_dict() for trip in trips], 
        200
    )

@app.route('/waypoints', methods=['POST'])
def create_waypoint():
    data = request.get_json()
    try:
        new_waymark = WayMark(
            label=data.get('label'),
            story=data.get('story'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            timestamp_in_video=data.get('timestamp_in_video'),
            trip_id=data.get('trip_id')
        )
        db.session.add(new_waymark)
        db.session.commit()
        return make_response(new_waymark.to_dict(), 201)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

# NEW: Delete endpoint to remove a specific pin
@app.route('/waypoints/<int:id>', methods=['DELETE'])
def delete_waypoint(id):
    waymark = WayMark.query.get(id)
    if not waymark:
        return make_response({"error": "WayMark not found"}, 404)
    
    try:
        db.session.delete(waymark)
        db.session.commit()
        return make_response({"message": "WayMark deleted successfully"}, 200)
    except Exception as e:
        db.session.rollback()
        return make_response({"error": str(e)}, 400)

@app.route('/trips/<int:id>', methods=['GET'])
def get_trip_by_id(id):
    trip = Trip.query.filter_by(id=id).first()
    if not trip:
        return make_response({"error": "Trip not found"}, 404)
    return make_response(trip.to_dict(), 200)

if __name__ == '__main__':
    app.run(port=5555, debug=True)
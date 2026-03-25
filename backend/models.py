from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

db = SQLAlchemy()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    # Relationships
    trips = db.relationship('Trip', backref='user', lazy=True)
    
    serialize_rules = ('-trips.user', '-password_hash')

class Trip(db.Model, SerializerMixin):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    video_url = db.Column(db.String) # Cloudinary URL stored here
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationship to Waypoints (Pins)
    waymarks = db.relationship('WayMark', backref='trip', cascade="all, delete-orphan")
    
    serialize_rules = ('-waymarks.trip', '-user.trips')

class WayMark(db.Model, SerializerMixin):
    __tablename__ = 'waymarks'
    
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100)) 
    story = db.Column(db.Text)      
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    timestamp_in_video = db.Column(db.Integer) 
    
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    
    serialize_rules = ('-trip.waymarks',)
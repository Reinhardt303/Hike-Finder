from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from config import bcrypt, db

class Hiker(db.Model, SerializerMixin):
    __tablename__ = 'hikers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String) 
    city = db.Column(db.String)
    state = db.Column(db.String)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String) 
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    def __init__(self, username, password, name=None, city=None, state=None):
        self.username = username
        self.password_hash = password  
        self.name = name
        self.city = city
        self.state = state

    reviews = db.relationship("Review", back_populates='hiker', cascade='all, delete-orphan')
    hikes = association_proxy('reviews', 'hike')

    serialize_rules = ('-reviews.hiker','-reviews.hiker.reviews','-_password_hash')
    
    @validates("username")
    def validate_username(self, key, value):
        if not isinstance(value, str) or not (3 <= len(value) <= 15):
            raise ValueError("Username must be present and between 3 and 15 characters.")
        return value
    
    @hybrid_property
    def password_hash(self): # type: ignore
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter # type: ignore
    def password_hash(self, password):
        if password:
            password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
            self._password_hash = password_hash
        else:
            raise ValueError("Password must not be empty.")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Hike(db.Model, SerializerMixin):
    __tablename__ = 'hikes'

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    name = db.Column(db.String) 
    city = db.Column(db.String)
    state = db.Column(db.String)
    length = db.Column(db.Integer)
    difficulty = db.Column(db.Integer)

    def __init__(self, name, city, state, length, difficulty):
        self.name = name
        self.city = city
        self.state = state
        self.length = length
        self.difficulty = difficulty

    @validates('difficulty')
    def validate_difficulty(self, key, value):
        if not isinstance(value, int) or not (1 <= value <= 5):
            raise ValueError('This must be an integer between 1 and 5')
        return value

    reviews = db.relationship("Review", back_populates='hike', cascade='all, delete-orphan') 
    hikers = association_proxy('reviews', 'hiker') 

    serialize_rules = ('-reviews.hike','-reviews.hiker.reviews','-_password_hash',)

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    review_text = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    hiker_id = db.Column(db.Integer, db.ForeignKey('hikers.id'), nullable=False)
    hike_id = db.Column(db.Integer, db.ForeignKey('hikes.id'), nullable=False)

    def __init__(self, review_text=None, hiker_id=None, hike_id=None):
        self.review_text = review_text
        self.hiker_id = hiker_id
        self.hike_id = hike_id

    hike = db.relationship('Hike', back_populates='reviews')
    hiker = db.relationship('Hiker', back_populates='reviews')

    serialize_rules = ('-hike.reviews', '-hiker.reviews', '-_password_hash')
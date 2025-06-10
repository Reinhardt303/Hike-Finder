from random import choice as rc
from faker import Faker
from app import app
from models import db, Hike, Hiker, Review

fake = Faker()

def create_hikers():
    hikers = []
    for _ in range(20):
        h = Hiker(
            name=fake.name(),
            city=fake.city(),
            state=fake.state(),
            username=fake.user_name(),
            password = fake.password() 
        )
        hikers.append(h)
    return hikers

def create_hikes():
    hikes = []
    for _ in range(29):
        hi = Hike(
            name=f"{fake.word().capitalize()} Trail", 
            city=fake.city(), 
            state=fake.state(), 
            length=fake.random_int(min=1, max=20), 
            difficulty=fake.random_int(min=1, max=5) 
        )
        hikes.append(hi)
    return hikes

def create_reviews(hikes, hikers):
    reviews = []
    for _ in range(40):
        r = Review(
            review_text=fake.sentence(nb_words=6),
            hiker_id=rc(hikers).id,
            hike_id=rc(hikes).id
        )
        reviews.append(r)
    return reviews

if __name__ == '__main__':
    with app.app_context():
        print("Clearing existing data...")
        Review.query.delete()
        Hiker.query.delete()
        Hike.query.delete()
        db.session.commit()  

        print("Seeding hikers...")
        hikers = create_hikers()
        db.session.add_all(hikers)
        db.session.commit()  

        print("Seeding hikes...")
        hikes = create_hikes()
        db.session.add_all(hikes)
        db.session.commit()  

        print("Seeding reviews...")
        reviews = create_reviews(hikes, hikers)
        db.session.add_all(reviews)
        db.session.commit()

        print("Seeding complete.")

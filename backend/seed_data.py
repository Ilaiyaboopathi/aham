import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.aham_cms

async def seed_banners():
    """Seed hero banners from existing frontend data"""
    banners = [
        {
            "title_en": "Get a Home Loan without Income Proof",
            "title_ta": "வருமான சான்றிதழ் இல்லாமல் வீட்டுக் கடன் பெறுங்கள்",
            "subtitle_en": "Turn your dream home into reality with our flexible documentation process",
            "subtitle_ta": "எங்கள் நெகிழ்வான ஆவண செயல்முறை மூலம் உங்கள் கனவு வீட்டை நனவாக்குங்கள்",
            "cta_text_en": "Apply Now",
            "cta_text_ta": "இப்போது விண்ணப்பிக்கவும்",
            "cta_action": "enquiry",
            "image_url": "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxob21lJTIwb3duZXJzaGlwfGVufDB8fHx8MTc2MDAxMzIwN3ww&ixlib=rb-4.1.0&q=85",
            "highlights": ["No Income Proof Required", "Quick Approval", "Competitive Rates"],
            "order_index": 0,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Check Your Eligibility in Minutes",
            "title_ta": "நிமிடங்களில் உங்கள் தகுதியை சரிபார்க்கவும்",
            "subtitle_en": "Get instant loan eligibility assessment with our AI-powered scorecard",
            "subtitle_ta": "எங்கள் AI-இயங்கும் ஸ்கோர்கார்டு மூலம் உடனடி கடன் தகுதி மதிப்பீட்டைப் பெறுங்கள்",
            "cta_text_en": "Check Eligibility",
            "cta_text_ta": "தகுதியை சரிபார்க்கவும்",
            "cta_action": "scorecard",
            "image_url": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85",
            "highlights": ["Instant Assessment", "5-Minute Process", "Personalized Results"],
            "order_index": 1,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "PMAY Subsidy Available",
            "title_ta": "PMAY மானியம் கிடைக்கிறது",
            "subtitle_en": "Get up to ₹2.67 lakhs government subsidy on your home loan",
            "subtitle_ta": "உங்கள் வீட்டுக் கடனில் ₹2.67 லட்சம் வரை அரசு மானியம் பெறுங்கள்",
            "cta_text_en": "Learn More",
            "cta_text_ta": "மேலும் அறிக",
            "cta_action": "pmay",
            "image_url": "https://images.unsplash.com/photo-1730130596425-197566414dc4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lfGVufDB8fHx8MTc2MDAxMzE5Nnww&ixlib=rb-4.1.0&q=85",
            "highlights": ["Government Subsidy", "Up to ₹2.67 Lakhs", "PMAY Certified"],
            "order_index": 2,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Calculate Your EMI Instantly",
            "title_ta": "உங்கள் EMI ஐ உடனடியாக கணக்கிடுங்கள்",
            "subtitle_en": "Plan your finances with our advanced EMI calculator",
            "subtitle_ta": "எங்கள் மேம்பட்ட EMI கால்குலேட்டர் மூலம் உங்கள் நிதியைத் திட்டமிடுங்கள்",
            "cta_text_en": "Calculate Now",
            "cta_text_ta": "இப்போது கணக்கிடுங்கள்",
            "cta_action": "emi",
            "image_url": "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg",
            "highlights": ["Instant Calculation", "Multiple Scenarios", "Download Reports"],
            "order_index": 3,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.banners.delete_many({})
    await db.banners.insert_many(banners)
    print(f"✅ Seeded {len(banners)} banners")

async def seed_products():
    """Seed loan products from existing frontend data"""
    products = [
        {
            "title_en": "Home Construction Loan",
            "title_ta": "வீடு கட்டுமான கடன்",
            "description_en": "Build your dream home with our construction loan offering stage-wise disbursement and competitive interest rates",
            "description_ta": "கட்டம் வாரியான வழங்கல் மற்றும் போட்டி வட்டி விகிதங்களை வழங்கும் எங்கள் கட்டுமான கடன் மூலம் உங்கள் கனவு வீட்டைக் கட்டுங்கள்",
            "icon": "HomeIcon",
            "image_url": "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxob21lJTIwb3duZXJzaGlwfGVufDB8fHx8MTc2MDAxMzIwN3ww&ixlib=rb-4.1.0&q=85",
            "features": ["Stage-wise disbursement", "Competitive rates", "Flexible repayment"],
            "gradient": "from-blue-500 to-indigo-600",
            "order_index": 0,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Plot + Construction Loan",
            "title_ta": "நில + கட்டுமான கடன்",
            "description_en": "Single loan solution for both plot purchase and construction with end-to-end support",
            "description_ta": "நிலம் வாங்குதல் மற்றும் கட்டுமானம் ஆகிய இரண்டிற்கும் முழுமையான ஆதரவுடன் ஒற்றை கடன் தீர்வு",
            "icon": "BuildingOffice2Icon",
            "image_url": "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg",
            "features": ["Single loan solution", "Land + Construction", "End-to-end support"],
            "gradient": "from-green-500 to-emerald-600",
            "order_index": 1,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "NRI Home Loan",
            "title_ta": "NRI வீட்டுக் கடன்",
            "description_en": "Special home loan schemes for NRIs with remote processing and overseas income consideration",
            "description_ta": "தொலைநிலை செயலாக்கம் மற்றும் வெளிநாட்டு வருமானத்தை கருத்தில் கொண்டு NRI களுக்கான சிறப்பு வீட்டு கடன் திட்டங்கள்",
            "icon": "GlobeAsiaAustraliaIcon",
            "image_url": "https://images.unsplash.com/photo-1730130596425-197566414dc4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmYW1pbHklMjBob21lfGVufDB8fHx8MTc2MDAxMzE5Nnww&ixlib=rb-4.1.0&q=85",
            "features": ["NRI special rates", "Remote processing", "Overseas income"],
            "gradient": "from-purple-500 to-violet-600",
            "order_index": 2,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Home Renovation Loan",
            "title_ta": "வீடு புதுப்பித்தல் கடன்",
            "description_en": "Upgrade and renovate your existing home with quick approval and modern upgrade support",
            "description_ta": "விரைவான ஒப்புதல் மற்றும் நவீன மேம்படுத்தல் ஆதரவுடன் உங்கள் தற்போதைய வீட்டை மேம்படுத்தி புதுப்பிக்கவும்",
            "icon": "WrenchScrewdriverIcon",
            "image_url": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85",
            "features": ["Home improvements", "Quick approval", "Modern upgrades"],
            "gradient": "from-orange-500 to-red-600",
            "order_index": 3,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Home Extension Loan",
            "title_ta": "வீடு விரிவாக்க கடன்",
            "description_en": "Expand your living space with additional floors or rooms to enhance property value",
            "description_ta": "சொத்து மதிப்பை அதிகரிக்க கூடுதல் தளங்கள் அல்லது அறைகள் மூலம் உங்கள் வாழும் இடத்தை விரிவாக்குங்கள்",
            "icon": "PlusIcon",
            "image_url": "https://images.unsplash.com/photo-1626178793926-22b28830aa30?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85",
            "features": ["Space expansion", "Additional floors", "Value enhancement"],
            "gradient": "from-teal-500 to-cyan-600",
            "order_index": 4,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Loan Against Property",
            "title_ta": "சொத்து மீதான கடன்",
            "description_en": "Mortgage your property to get funds for business or personal needs with attractive rates",
            "description_ta": "கவர்ச்சிகரமான விகிதங்களில் வணிகம் அல்லது தனிப்பட்ட தேவைகளுக்கு நிதி பெற உங்கள் சொத்தை அடமானம் வைக்கவும்",
            "icon": "BanknotesIcon",
            "image_url": "https://images.pexels.com/photos/7937708/pexels-photo-7937708.jpeg",
            "features": ["Loan against property", "Business funding", "Personal needs"],
            "gradient": "from-pink-500 to-rose-600",
            "order_index": 5,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.products.delete_many({})
    await db.products.insert_many(products)
    print(f"✅ Seeded {len(products)} products")

async def seed_testimonials():
    """Seed testimonials from existing frontend data"""
    testimonials = [
        {
            "name": "Rajesh Kumar",
            "location": "Mumbai, Maharashtra",
            "rating": 5,
            "comment_en": "AHAM made my dream of owning a home come true! Their no-income-proof process was exactly what I needed as a freelance consultant. The team was supportive throughout.",
            "comment_ta": "AHAM எனது வீடு வாங்கும் கனவை நனவாக்கியது! ஒரு ஃப்ரீலான்ஸ் ஆலோசகராக நான் தேவைப்பட்டது அவர்களின் வருமான-சான்றிதழ் இல்லாத செயல்முறையே. குழு முழுவதும் ஆதரவாக இருந்தது.",
            "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "loan_type": "Home Construction Loan",
            "order_index": 0,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "name": "Priya Sharma",
            "location": "Bangalore, Karnataka",
            "rating": 5,
            "comment_en": "Excellent service and quick processing! I got my home loan approved in just 10 days. The interest rates were competitive and the staff was very professional.",
            "comment_ta": "சிறந்த சேவை மற்றும் விரைவான செயலாக்கம்! வெறும் 10 நாட்களில் எனது வீட்டுக் கடன் அங்கீகரிக்கப்பட்டது. வட்டி விகிதங்கள் போட்டித்தன்மை வாய்ந்தவை மற்றும் ஊழியர்கள் மிகவும் தொழில்முறை.",
            "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612b05b?w=150&h=150&fit=crop&crop=face",
            "loan_type": "Plot + Construction Loan",
            "order_index": 1,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "name": "Amit Patel",
            "location": "Ahmedabad, Gujarat",
            "rating": 5,
            "comment_en": "As an NRI, I was worried about the documentation process. But AHAM team handled everything smoothly. I could complete most formalities online.",
            "comment_ta": "ஒரு NRI ஆக, ஆவணச் செயல்முறை குறித்து நான் கவலைப்பட்டேன். ஆனால் AHAM குழு அனைத்தையும் சுமூகமாக கையாண்டது. பெரும்பாலான முறைமைகளை ஆன்லைனில் முடிக்க முடிந்தது.",
            "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "loan_type": "NRI Home Loan",
            "order_index": 2,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "name": "Sunita Reddy",
            "location": "Hyderabad, Telangana",
            "rating": 5,
            "comment_en": "I renovated my entire house with their renovation loan. The stage-wise disbursement helped me manage the project better. Great experience overall!",
            "comment_ta": "அவர்களின் புதுப்பித்தல் கடன் மூலம் எனது முழு வீட்டையும் புதுப்பித்தேன். கட்டம் வாரியான வழங்கல் திட்டத்தை சிறப்பாக நிர்வகிக்க உதவியது. ஒட்டுமொத்தமாக சிறந்த அனுபவம்!",
            "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            "loan_type": "Home Renovation Loan",
            "order_index": 3,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "name": "Vikram Singh",
            "location": "Jaipur, Rajasthan",
            "rating": 5,
            "comment_en": "Transparent process, no hidden charges, and excellent customer support. AHAM is definitely the best choice for home loans in India.",
            "comment_ta": "வெளிப்படையான செயல்முறை, மறைக்கப்பட்ட கட்டணங்கள் இல்லை, மற்றும் சிறந்த வாடிக்கையாளர் ஆதரவு. இந்தியாவில் வீட்டுக் கடன்களுக்கு AHAM நிச்சயமாக சிறந்த தேர்வு.",
            "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "loan_type": "Home Extension Loan",
            "order_index": 4,
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.testimonials.delete_many({})
    await db.testimonials.insert_many(testimonials)
    print(f"✅ Seeded {len(testimonials)} testimonials")

async def seed_articles():
    """Seed articles from existing frontend data"""
    articles = [
        {
            "title_en": "PMAY 2.0 Guidelines: Complete Guide to Government Housing Subsidy",
            "title_ta": "PMAY 2.0 வழிகாட்டுதல்கள்: அரசு வீட்டு மானியத்திற்கான முழுமையான வழிகாட்டி",
            "slug": "pmay-2-guidelines-complete-guide",
            "content_en": "Learn about the updated PMAY 2.0 scheme, eligibility criteria, and how to apply for government housing subsidies up to ₹2.67 lakhs. The Pradhan Mantri Awas Yojana (PMAY) is a flagship initiative by the Government of India to provide affordable housing to all.",
            "content_ta": "புதுப்பிக்கப்பட்ட PMAY 2.0 திட்டம், தகுதி அளவுகோல்கள் மற்றும் ₹2.67 லட்சம் வரை அரசு வீட்டு மானியங்களுக்கு எவ்வாறு விண்ணப்பிப்பது என்பது பற்றி அறியுங்கள். பிரதான் மந்திரி ஆவாஸ் யோஜனா (PMAY) அனைவருக்கும் மலிவு வீடுகளை வழங்க இந்திய அரசின் முக்கிய முன்முயற்சியாகும்.",
            "thumbnail_url": "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Home Loan Interest Rates in 2025: What to Expect",
            "title_ta": "2025 இல் வீட்டுக் கடன் வட்டி விகிதங்கள்: எதிர்பார்க்க வேண்டியவை",
            "slug": "home-loan-interest-rates-2025",
            "content_en": "Analysis of current home loan interest rate trends and predictions for 2025. Find out how to get the best rates for your home loan. Interest rates have been fluctuating based on RBI monetary policy and market conditions.",
            "content_ta": "தற்போதைய வீட்டுக் கடன் வட்டி விகித போக்குகள் மற்றும் 2025 க்கான கணிப்புகளின் பகுப்பாய்வு. உங்கள் வீட்டுக் கடனுக்கு சிறந்த விகிதங்களை எவ்வாறு பெறுவது என்பதைக் கண்டறியவும். RBI பணவியல் கொள்கை மற்றும் சந்தை நிலைமைகளின் அடிப்படையில் வட்டி விகிதங்கள் ஏற்ற இறக்கமாக உள்ளன.",
            "thumbnail_url": "https://images.unsplash.com/photo-1626178793926-22b28830aa30?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxob3VzaW5nJTIwZmluYW5jZSUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3NjAwMTMyMDF8MA&ixlib=rb-4.1.0&q=85",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "title_en": "Home Loan Without Income Proof: A Complete Guide",
            "title_ta": "வருமான சான்று இல்லாமல் வீட்டுக் கடன்: ஒரு முழுமையான வழிகாட்டி",
            "slug": "home-loan-without-income-proof-guide",
            "content_en": "Discover how to get a home loan without traditional income documents. Learn about alternative documentation and eligibility criteria. Many self-employed individuals and freelancers can benefit from this scheme.",
            "content_ta": "பாரம்பரிய வருமான ஆவணங்கள் இல்லாமல் வீட்டுக் கடனை எவ்வாறு பெறுவது என்பதைக் கண்டறியுங்கள். மாற்று ஆவணங்கள் மற்றும் தகுதி அளவுகோல்கள் பற்றி அறியுங்கள். பல சுயதொழில் செய்பவர்கள் மற்றும் ஃப்ரீலான்சர்கள் இந்த திட்டத்தில் பயனடையலாம்.",
            "thumbnail_url": "https://images.unsplash.com/photo-1628133287836-40bd5453bed1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxob21lJTIwb3duZXJzaGlwfGVufDB8fHx8MTc2MDAxMzIwN3ww&ixlib=rb-4.1.0&q=85",
            "published_date": datetime.now(timezone.utc).isoformat(),
            "status": True,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.articles.delete_many({})
    await db.articles.insert_many(articles)
    print(f"✅ Seeded {len(articles)} articles")

async def main():
    print("🌱 Starting data migration from frontend to CMS...")
    print("=" * 60)
    
    await seed_banners()
    await seed_products()
    await seed_testimonials()
    await seed_articles()
    
    print("=" * 60)
    print("✅ All existing frontend data migrated to CMS successfully!")
    print("🎉 You can now edit this content through the Admin Panel at /admin")

if __name__ == "__main__":
    asyncio.run(main())

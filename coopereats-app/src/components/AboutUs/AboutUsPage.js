import "./AboutUs.css"
import Hero from "./Hero"

function AboutUsPage() {
    const teamMembers = [
        { name: "Justin Koe", email: "justin.koe@cooper.edu", image: "/images/justin.jpg" },
        { name: "Diego Toribio", email: "diego.toribio@cooper.edu", image: "/images/diego.jpg" },
        { name: "Eric Taeyoo Kim", email: "taeyoo.kim@cooper.edu", image: "/images/taeyoo.jpg" },
        { name: "Hailey Chung", email: "hayoon.chung@cooper.edu", image: "/images/hailey.jpg" }
    ];
    return (
        <>
        <Hero/>
        <div className="about-container">
            <h1>Meet Our Team</h1>
            <div className="team-container">
                    {teamMembers.map(member => (
                        <div className="team-member" key={member.name}>
                            <img src={member.image} alt={`Profile of ${member.name}`} className="team-member-photo" />
                            <h3>{member.name}</h3>
                            <p>{member.email}</p>
                        </div>
                    ))}
            </div>
            <h1>Our History</h1>
            <p>
            CooperEats was born out of a passion to save each student and faculty's time during busy lunch times. 
            Founded in 2024, our journey began with a simple idea: to make ordering and paying for food at Frankie's Cafe more convenient. 
            Since then, we've grown to serve the Cooper Union community to bring a diverse array of food options to our users.
            </p>
            <h1>Our Mission</h1>
            <p>
            Our mission is to bring convenience to the Cooper Union community. At CooperEats, we believe in the power of food to bring people together, 
            create joy, and foster community. Whether it's a quick bite or a drink, we're dedicated to providing our users with an exceptional user experience 
            by offering convenient access to a wide variety of menus offered by Frankie'ss Cafe.
            </p> 
            <h1>Our vision</h1>
            <p>
            Our vision is to create a world where anyone can enjoy the perfect meal, anytime, anywhere. Looking to the future, we aim to expand our reach,
            continuously improve our services, and introduce new ways to enrich the user experience.
            </p>     
        </div>
    </>
    );
}

export default AboutUsPage;
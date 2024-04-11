import "./AboutUs.css"
import Hero from "./Hero"

function AboutUsPage() {
    return (
        <>
        <Hero/>
        <div className="about-container">
            <h1>Our History</h1>
            <p>
            CooperEats was born out of a passion for connecting people with the best culinary experiences right at their fingertips. 
            Founded in 2024, our journey began with a simple idea: to make discovering and enjoying local and global cuisines easier, 
            faster, and more rewarding. Since then, we've grown from a small startup into a leading online eating platform, serving thousands of 
            customers and partnering with hundreds of restaurants and chefs to bring a diverse array of food options to our users.
            </p>
            <h1>Our Mission</h1>
            <p>
            Our mission is to revolutionize the way people think about and enjoy food. At CooperEats, we believe in the power of food to bring people together, 
            create joy, and foster community. Whether it's a quick bite or a lavish meal, we're dedicated to providing our users with an exceptional dining experience 
            by offering convenient access to a wide variety of culinary delights. Through innovation, quality service, and a commitment to sustainability, we strive to 
            be the go-to platform for food lovers everywhere.
            </p> 
            <h1>Our vision</h1>
            <p>
            Our vision is to create a world where anyone can enjoy the perfect meal, anytime, anywhere. We envision CooperEats as more than just a food delivery service; 
            we see it as a global community of food enthusiasts, chefs, and restaurateurs united by a shared love for great food. Looking to the future, we aim to expand our reach,
            continuously improve our services, and introduce new ways to enrich the eating experience. By fostering a culture of discovery, excellence, and inclusivity, 
            we hope to inspire our community to explore new flavors, celebrate diverse cuisines, and make lasting memories around the table.
            </p>     
        </div>
    </>
    );
}

export default AboutUsPage;

import { MessageSquare, Users, Globe, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MotionWrapper } from "@/components/ui/MotionWrapper";

const About = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "AI enthusiast with 10+ years in tech. Previously at Google AI and MIT Media Lab.",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Former AI researcher at Stanford. Expert in machine learning and NLP technologies.",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "Elena Rodriguez",
      role: "Head of Content",
      bio: "Tech journalist with experience at TechCrunch and Wired. AI communication specialist.",
      avatar: "https://via.placeholder.com/150"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      bio: "Full-stack developer with a passion for creating intuitive user interfaces and experiences.",
      avatar: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <MotionWrapper animation="fadeIn">
          <section className="py-16 md:py-24 bg-secondary/30 dark:bg-transparent">
            <div className="container-tight text-center">
              <span className="inline-block rounded-full bg-secondary/80 px-4 py-1.5 text-sm font-medium text-foreground/80 mb-6">
                About AI Any Tool
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Simplifying Your <span className="text-gradient">AI Tool</span> Discovery Journey
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                We help professionals and teams find the right AI solutions faster, with confident decision-making backed by expert curation and user reviews
              </p>
            </div>
          </section>
        </MotionWrapper>
        
        {/* Mission Section */}
        <MotionWrapper animation="fadeIn" delay="delay-200">
          <section className="py-16 md:py-24">
            <div className="container-tight">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                  <p className="text-muted-foreground mb-4">
                    In today's rapidly evolving AI landscape, finding the right tools can be overwhelming. We've created AI Any Tool to simplify this process - providing a trusted platform where users can discover, compare, and choose the best AI-powered solutions for their specific needs.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    We believe that artificial intelligence should be accessible to everyone. Our mission is to democratize access to AI technology by creating a comprehensive, user-friendly directory that helps individuals and businesses harness the power of AI to solve real-world problems.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/tools" 
                      className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                    >
                      Explore Tools
                    </Link>
                    <Link 
                      to="/contact" 
                      className="rounded-lg border border-input bg-background px-6 py-3 font-medium hover:bg-secondary/50 transition-colors text-center"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="order-1 md:order-2 relative">
                  <div className="rounded-2xl overflow-hidden border border-border/40 shadow-lg">
                    <img 
                      src="https://via.placeholder.com/600x400" 
                      alt="AI Any Tool Mission" 
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Floating stats card */}
                  <div className="absolute -bottom-6 -left-6 md:bottom-6 md:left-auto md:-right-6 bg-background rounded-xl border border-border/40 p-4 shadow-lg w-48">
                    <div className="text-3xl font-bold text-primary">300+</div>
                    <div className="text-sm text-muted-foreground">AI tools curated and reviewed</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </MotionWrapper>
        
        {/* Values Section */}
        <MotionWrapper animation="fadeIn" delay="delay-300">
          <section className="py-16 md:py-24 bg-secondary/30 dark:bg-transparent">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Our Core Values</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  The principles that guide our platform and curation process
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Users,
                    title: "User-Centric",
                    description: "We always prioritize the needs of our users, creating a platform that makes AI tool discovery effortless and enjoyable."
                  },
                  {
                    icon: Award,
                    title: "Quality First",
                    description: "We maintain high standards for the tools featured on our platform, ensuring they deliver real value to users."
                  },
                  {
                    icon: MessageSquare,
                    title: "Transparent Reviews",
                    description: "We believe in honest, unbiased tool assessments that help users make informed decisions."
                  },
                  {
                    icon: Globe,
                    title: "Inclusive Innovation",
                    description: "We showcase diverse AI tools that can benefit users across different industries, skill levels, and use cases."
                  }
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border/40 hover:shadow-card transition-all duration-300"
                  >
                    <div className="rounded-full p-3 bg-primary/10 text-primary">
                      <value.icon size={24} />
                    </div>
                    <h3 className="mt-4 text-xl font-medium">{value.title}</h3>
                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </MotionWrapper>
        
        {/* Team Section */}
        <MotionWrapper animation="fadeIn" delay="delay-400">
          <section className="py-16 md:py-24">
            <div className="container-wide">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Meet Our Team</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  The passionate experts behind AI Any Tool
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border/40 hover:shadow-card transition-all duration-300"
                  >
                    <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="mt-3 text-muted-foreground text-sm">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </MotionWrapper>
        
        {/* Stats Section */}
        <MotionWrapper animation="fadeIn" delay="delay-500">
          <section className="py-16 md:py-24 bg-secondary/30 dark:bg-transparent">
            <div className="container-tight">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "300+", label: "AI Tools" },
                  { value: "18", label: "Categories" },
                  { value: "1000+", label: "User Reviews" },
                  { value: "50k+", label: "Monthly Users" }
                ].map((stat, index) => (
                  <div key={index} className="text-center p-6 rounded-xl bg-background border border-border/40">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </MotionWrapper>
        
        {/* CTA Section */}
        <MotionWrapper animation="fadeIn" delay="delay-600">
          <section className="py-16 md:py-24">
            <div className="container-tight">
              <div className="rounded-xl bg-background border border-border/40 p-8 md:p-12 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Join Our AI Tool Directory
                </h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                  Are you an AI tool developer? Get your product featured on our platform and reach thousands of potential users.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/submit-tool" 
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Submit Your Tool
                  </Link>
                  <Link 
                    to="/contact" 
                    className="rounded-lg border border-input bg-background px-6 py-3 font-medium hover:bg-secondary/50 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </MotionWrapper>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;

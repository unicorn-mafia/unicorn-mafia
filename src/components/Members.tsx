import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Building } from "lucide-react";

const Members = () => {
  const members = [
    {
      name: "Alex Chen",
      role: "AI Research Lead",
      company: "DeepMind",
      location: "London",
      specialties: ["Machine Learning", "Computer Vision", "NLP"],
      achievements: "Winner of 3 major AI hackathons"
    },
    {
      name: "Sarah Williams",
      role: "Founding Engineer",
      company: "Stripe",
      location: "London",
      specialties: ["Fintech", "Backend Systems", "Scalability"],
      achievements: "Built payment systems serving millions"
    },
    {
      name: "Marcus Rodriguez",
      role: "Hardware Architect",
      company: "ARM",
      location: "Cambridge",
      specialties: ["Chip Design", "IoT", "Edge Computing"],
      achievements: "15+ patents in semiconductor tech"
    },
    {
      name: "Priya Patel",
      role: "VP of Engineering",
      company: "Revolut",
      location: "London",
      specialties: ["Mobile Apps", "DevOps", "Team Leadership"],
      achievements: "Scaled engineering teams from 5 to 200+"
    },
    {
      name: "David Kim",
      role: "Quantum Computing Researcher",
      company: "Oxford University",
      location: "Oxford",
      specialties: ["Quantum Algorithms", "Cryptography", "Research"],
      achievements: "Published 20+ papers in top journals"
    },
    {
      name: "Emma Thompson",
      role: "Startup Founder",
      company: "ClimaTech AI",
      location: "London",
      specialties: ["Climate Tech", "Sustainability", "AI"],
      achievements: "Raised €10M Series A in 2024"
    }
  ];

  return (
    <section id="members" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Elite Members
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Meet some of our exceptional members who are shaping the future of technology 
            across Europe's most innovative companies and institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {members.map((member, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{member.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">{member.achievements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-secondary border border-primary/20">
            <p className="text-muted-foreground">Want to see the full directory?</p>
            <Button variant="hero" className="group">
              View All Members
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Members;
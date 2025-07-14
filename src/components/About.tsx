import { Card, CardContent } from "@/components/ui/card";
import { Brain, Code, Cpu, Trophy } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Pioneering the future with cutting-edge artificial intelligence and machine learning innovations."
    },
    {
      icon: Code,
      title: "Software Excellence",
      description: "Building scalable, robust software solutions that power the next generation of technology."
    },
    {
      icon: Cpu,
      title: "Hardware Innovation",
      description: "Creating breakthrough hardware technologies that push the boundaries of what's possible."
    },
    {
      icon: Trophy,
      title: "Proven Track Record",
      description: "Consistently delivering results with members featured in top 3 of major hackathons across Europe."
    }
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Who We Are
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            We are London's most exclusive collective of tech visionaries, bringing together 
            the brightest minds from startups, established companies, and cutting-edge research 
            environments across Europe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-secondary border border-primary/20">
            <div className="text-2xl font-bold text-primary">200M+</div>
            <div className="text-muted-foreground">Combined years of tech expertise</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
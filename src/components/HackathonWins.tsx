import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, Calendar } from "lucide-react";

const HackathonWins = () => {
  const wins = [
    {
      event: "TechCrunch Disrupt London",
      position: "1st Place",
      date: "2024",
      category: "AI Innovation",
      prize: "€50,000",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      event: "European Fintech Hackathon",
      position: "2nd Place",
      date: "2024",
      category: "Fintech Solutions",
      prize: "€30,000",
      icon: Medal,
      color: "text-gray-400"
    },
    {
      event: "Berlin AI Summit Hack",
      position: "1st Place",
      date: "2024",
      category: "Machine Learning",
      prize: "€40,000",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      event: "London Climate Tech Challenge",
      position: "3rd Place",
      date: "2024",
      category: "Climate Tech",
      prize: "€20,000",
      icon: Award,
      color: "text-amber-600"
    },
    {
      event: "Paris Blockchain Summit",
      position: "1st Place",
      date: "2023",
      category: "Web3 & Blockchain",
      prize: "€35,000",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      event: "Amsterdam IoT Hackathon",
      position: "2nd Place",
      date: "2023",
      category: "IoT & Hardware",
      prize: "€25,000",
      icon: Medal,
      color: "text-gray-400"
    }
  ];

  return (
    <section id="wins" className="py-24 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Proven Excellence
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our members consistently dominate Europe's most prestigious hackathons, 
            with top-3 finishes across every major tech competition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {wins.map((win, index) => (
            <Card key={index} className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <win.icon className={`w-8 h-8 ${win.color}`} />
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {win.position}
                  </Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{win.event}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{win.date}</span>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground">Category</div>
                  <div className="font-medium">{win.category}</div>
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground">Prize</div>
                  <div className="font-bold text-primary">{win.prize}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-8 px-12 py-6 rounded-2xl bg-gradient-primary">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">€200K+</div>
              <div className="text-primary-foreground/80 text-sm">Total Prize Money</div>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">15+</div>
              <div className="text-primary-foreground/80 text-sm">Major Events</div>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">85%</div>
              <div className="text-primary-foreground/80 text-sm">Top 3 Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HackathonWins;
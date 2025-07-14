import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageCircle, Calendar, ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Join the Elite
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Think you have what it takes? We're always looking for exceptional 
            talent to join London's most exclusive tech collective.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Email Us</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Send us your portfolio and let's discuss how you can contribute to our collective.
              </p>
              <Button variant="outline" size="sm" className="group">
                hello@unicornmafia.london
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Telegram</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Join our private Telegram channel for real-time discussions and opportunities.
              </p>
              <Button variant="outline" size="sm" className="group">
                @UnicornMafiaLDN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-glow transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Events</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Attend our exclusive meetups and networking events across London.
              </p>
              <Button variant="outline" size="sm" className="group">
                View Events
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-6 px-12 py-8 rounded-2xl bg-gradient-primary max-w-2xl">
            <h3 className="text-2xl font-bold text-primary-foreground">Ready to Make Your Mark?</h3>
            <p className="text-primary-foreground/80 text-center leading-relaxed">
              If you're building something exceptional, have a track record of innovation, 
              or are making waves in the tech industry, we want to hear from you.
            </p>
            <Button variant="secondary" size="lg" className="group">
              Apply for Membership
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 London Unicorn Mafia. Building the future, one innovation at a time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
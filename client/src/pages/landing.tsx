import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Users, FileText, Calendar, MapPin, GraduationCap, Target, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Research_field_work_Nigeria_community_fdfd2ff8.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Cultural & Religious Pluralism Barometer</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#requirements" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Requirements</a>
            <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/applicant-login">
              <Button variant="outline" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/apply">
              <Button data-testid="button-apply-header">Apply Now</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <Badge className="mb-6 bg-primary/20 backdrop-blur-sm border-primary/30 text-white hover:bg-primary/30" data-testid="badge-locations">
            Plateau & Kaduna States, Nigeria
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            Field Officers Recruitment
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90" data-testid="text-hero-subtitle">
            Join the Cultural and Religious Pluralism Barometer research project to assess identity-related tensions and promote peaceful coexistence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="bg-primary/90 backdrop-blur-sm hover:bg-primary border-primary-border text-lg px-8" data-testid="button-apply-hero">
                Apply Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20 text-lg px-8" data-testid="button-learn-more">
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-about-title">About the Barometer</h2>
            <p className="text-lg text-muted-foreground" data-testid="text-about-description">
              The Cultural and Religious Pluralism Barometer is an innovative assessment tool developed by the Pharos Observatory 
              to measure identity-related tensions within society. This project in Plateau and Kaduna States uses evidence-based 
              methodology combining facts, perceptions, and opinions to identify forces of fragmentation and cohesion, providing 
              actionable recommendations for peacebuilding.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle data-testid="text-card-objective">Our Objective</CardTitle>
                </div>
                <CardDescription>
                  To assess and report on the level of identity-related tensions in Plateau and Kaduna States, 
                  providing evidence-based diagnosis and recommendations to decision-makers and civil society 
                  for preserving the common good and promoting peaceful coexistence.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="hover-elevate">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle data-testid="text-card-impact">Expected Impact</CardTitle>
                </div>
                <CardDescription>
                  Alert stakeholders of conflict risks, support advocacy actions, and guide the implementation 
                  of appropriate solutions to bring peace to communities. The Barometer identifies both fragmentation 
                  forces and cohesion opportunities for sustainable peacebuilding.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section id="requirements" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-requirements-title">Field Officer Requirements</h2>
            <p className="text-lg text-muted-foreground">
              We're recruiting dedicated field officers to conduct interviews and facilitate focus group discussions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover-elevate" data-testid="card-requirement-education">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">
                  Minimum of Bachelor's degree in Social Sciences, Development Studies, 
                  Public Health, or related fields.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate" data-testid="card-requirement-experience">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Research Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Experience with qualitative research methods, particularly Key Informant Interviews (KII) 
                  and Focus Group Discussions (FGD) is highly preferred.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate" data-testid="card-requirement-location">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Must be based in or willing to work in Kaduna State or Plateau State (Jos) 
                  for the duration of the research project.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate" data-testid="card-requirement-availability">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Availability</h3>
                <p className="text-sm text-muted-foreground">
                  Full-time commitment required. Must be available to start within 
                  the specified timeframe.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate" data-testid="card-requirement-skills">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Core Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Cultural sensitivity, strong communication, analytical thinking, 
                  conflict resolution awareness, and community engagement skills.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate" data-testid="card-requirement-language">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Language</h3>
                <p className="text-sm text-muted-foreground">
                  Fluency in English required. Knowledge of local languages (Hausa) 
                  is an advantage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-benefits-title">Why Join Us</h2>
            <p className="text-lg text-muted-foreground">
              This is more than just a job – it's an opportunity to make a real difference
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-benefit-professional">Professional Development</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Experience with the Pharos Observatory's innovative Barometer methodology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Contribute to critical peacebuilding and conflict prevention research</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Training in cultural and religious pluralism assessment techniques</span>
                  </li>
                </ul>
              </div>
              <Card className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">100+</div>
                  <p className="text-sm text-muted-foreground">Community members you'll engage with during the project</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Card className="hover-elevate md:order-2">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">6-12</div>
                  <p className="text-sm text-muted-foreground">Months project duration with potential for extension</p>
                </CardContent>
              </Card>
              <div className="md:order-1">
                <h3 className="text-2xl font-semibold mb-4" data-testid="text-benefit-impact">Meaningful Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Direct contribution to community development initiatives</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Work on projects that influence local and national policy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Build lasting relationships with communities in Kaduna and Jos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-cta-title">Ready to Make a Difference?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Submit your application today and join our team of dedicated researchers 
            working to create positive change in Northern Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-primary-foreground text-lg px-8" data-testid="button-apply-cta">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-semibold">Cultural & Religious Pluralism Barometer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Assessing identity-related tensions and promoting peacebuilding in Plateau and Kaduna States, Nigeria.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-muted-foreground hover:text-foreground">About</a></li>
                <li><a href="#requirements" className="text-muted-foreground hover:text-foreground">Requirements</a></li>
                <li><a href="#benefits" className="text-muted-foreground hover:text-foreground">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                For inquiries about the application process, please check your application status 
                after submitting your form.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Cultural & Religious Pluralism Barometer. All rights reserved.</p>
            <p className="mt-2">Designed by Desmond Ignatius | 08160038381</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

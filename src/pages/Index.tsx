 import { useNavigate, Link } from 'react-router-dom';
 import { Button } from '@/components/ui/button';
 import { Header } from '@/components/Header';
 import { Footer } from '@/components/Footer';
 import { useVoting } from '@/contexts/VotingContext';
 import schoolLogo from '@/assets/school-logo.jpg';
 import { 
   Vote, 
   Users, 
   BarChart3, 
   Shield, 
   CheckCircle, 
   Clock,
   ArrowRight,
   Star
 } from 'lucide-react';
 
 const Index = () => {
   const navigate = useNavigate();
   const { election, isLoggedIn, user, stats, positions, candidates } = useVoting();
 
   const features = [
     {
       icon: Vote,
       title: 'Secure Voting',
       description: 'Cast your vote securely with our encrypted voting system ensuring privacy and integrity.',
     },
     {
       icon: Users,
       title: 'Fair Elections',
       description: 'Every student gets one vote, ensuring a democratic and fair election process.',
     },
     {
       icon: BarChart3,
       title: 'Real-time Results',
       description: 'View live election results as votes are counted in real-time.',
     },
     {
       icon: Shield,
       title: 'Verified Voters',
       description: 'Only registered students can vote, preventing fraud and duplicate voting.',
     },
   ];
 
   const displayStats = [
     { value: stats?.totalVoters || 0, label: 'Registered Voters' },
     { value: stats?.totalVoted || 0, label: 'Votes Cast' },
     { value: positions.length, label: 'Positions' },
     { value: candidates.length, label: 'Candidates' },
   ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 gradient-hero opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
          
          <div className="relative container mx-auto px-4 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Content */}
              <div className="flex-1 text-center lg:text-left animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
                  <Star className="h-4 w-4" />
                  SSG Election {election?.schoolYear}
                </div>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                  Congressman Pablo Malasarte
                  <span className="block text-accent">National High School</span>
                </h1>
                
                <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl">
                  Official Supreme Student Government Election Platform. 
                  Exercise your right to vote and shape the future of our school community.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isLoggedIn ? (
                    <Button 
                      variant="hero" 
                      size="xl"
                      onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/vote')}
                      className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {user?.role === 'admin' ? 'Go to Admin Panel' : 'Cast Your Vote'}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="hero" 
                        size="xl"
                        onClick={() => navigate('/auth')}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        Vote Now
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="glass" 
                        size="xl"
                        onClick={() => navigate('/candidates')}
                        className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                      >
                        View Candidates
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 animate-float">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl" />
                  <img 
                    src={schoolLogo} 
                    alt="CPMNHS Logo" 
                    className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full object-cover shadow-2xl border-4 border-primary-foreground/20"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {displayStats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Election Status */}
        {election && stats && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="glass-card rounded-2xl p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className={`p-4 rounded-full ${election.isActive ? 'bg-success/10' : 'bg-muted'}`}>
                      {election.isActive ? (
                        <CheckCircle className="h-10 w-10 text-success" />
                      ) : (
                        <Clock className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {election.name}
                      </h2>
                      <p className="text-muted-foreground">
                        {election.isActive 
                          ? 'Voting is currently open. Cast your vote now!'
                          : 'Voting period has ended.'}
                      </p>
                    </div>
                    {election.isActive && !isLoggedIn && (
                      <Button 
                        variant="hero" 
                        size="lg"
                        onClick={() => navigate('/auth')}
                      >
                        Start Voting
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Voter Turnout</span>
                      <span className="font-semibold text-foreground">
                        {stats.participationRate}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full gradient-primary rounded-full transition-all duration-1000"
                        style={{ width: `${stats.participationRate}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.totalVoted} of {stats.totalVoters} students have voted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Use Our Voting System?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform ensures a fair, transparent, and efficient election process for all students.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Make Your Voice Heard?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your vote matters. Be part of the change you want to see in our school.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="hero" 
                  size="xl"
                  onClick={() => navigate('/auth')}
                >
                  Cast Your Vote Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => navigate('/candidates')}
                >
                  Meet the Candidates
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;

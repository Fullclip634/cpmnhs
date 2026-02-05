 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Header } from '@/components/Header';
 import { Footer } from '@/components/Footer';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { useVoting } from '@/contexts/VotingContext';
 import { 
   Users, 
   Vote, 
   BarChart3, 
   Settings, 
   UserPlus, 
   FileText,
   Clock,
   CheckCircle,
   TrendingUp,
   Shield,
   Loader2
 } from 'lucide-react';
 
 export default function AdminDashboard() {
   const { user, isLoggedIn, election, candidates, positions, getResults, stats, isLoading } = useVoting();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!isLoading && !isLoggedIn) {
       navigate('/auth');
     }
   }, [isLoading, isLoggedIn, navigate]);
 
   if (isLoading) {
     return (
       <div className="min-h-screen flex flex-col bg-background">
         <Header />
         <main className="flex-1 flex items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </main>
         <Footer />
       </div>
     );
   }
 
   // Redirect if not admin
   if (!isLoggedIn || user?.role !== 'admin') {
     return (
       <div className="min-h-screen flex flex-col bg-background">
         <Header />
         <main className="flex-1 flex items-center justify-center p-4">
           <Card className="glass-card max-w-md w-full text-center p-8">
             <CardContent className="pt-6">
               <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
               <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
               <p className="text-muted-foreground mb-6">
                 You need admin privileges to access this page.
               </p>
               <Button variant="hero" onClick={() => navigate('/auth')}>
                 Admin Login
               </Button>
             </CardContent>
           </Card>
         </main>
         <Footer />
       </div>
     );
   }
 
   const results = getResults();
   const voterTurnout = stats?.participationRate || 0;
 
   const displayStats = [
     {
       title: 'Total Voters',
       value: stats?.totalVoters || 0,
       icon: Users,
       color: 'text-primary',
       bgColor: 'bg-primary/10',
     },
     {
       title: 'Votes Cast',
       value: stats?.totalVoted || 0,
       icon: Vote,
       color: 'text-success',
       bgColor: 'bg-success/10',
     },
     {
       title: 'Voter Turnout',
       value: `${voterTurnout}%`,
       icon: TrendingUp,
       color: 'text-accent',
       bgColor: 'bg-accent/10',
     },
     {
       title: 'Positions',
       value: positions.length,
       icon: FileText,
       color: 'text-secondary-foreground',
       bgColor: 'bg-secondary',
     },
   ];

  const actions = [
    {
      title: 'Manage Candidates',
      description: 'Add, edit, or remove candidates',
      icon: UserPlus,
      onClick: () => {},
    },
    {
      title: 'Manage Voters',
      description: 'View and manage registered voters',
      icon: Users,
      onClick: () => {},
    },
    {
      title: 'View Results',
      description: 'See detailed election results',
      icon: BarChart3,
      onClick: () => navigate('/results'),
    },
    {
      title: 'Election Settings',
      description: 'Configure election parameters',
      icon: Settings,
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name}. Manage and monitor the election.
            </p>
          </div>

          {/* Election Status */}
          <Card className="glass-card mb-8 animate-fade-in">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className={`p-3 rounded-xl ${election?.isActive ? 'bg-success/10' : 'bg-muted'}`}>
                  {election?.isActive ? (
                    <CheckCircle className="h-8 w-8 text-success" />
                  ) : (
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl font-bold">{election?.name}</h2>
                  <p className="text-muted-foreground text-sm">
                    {election?.isActive 
                      ? 'Election is currently active' 
                      : 'Election is not active'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant={election?.isActive ? 'destructive' : 'success'}>
                    {election?.isActive ? 'End Election' : 'Start Election'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {displayStats.map((stat, index) => (
              <Card 
                key={index} 
                className="glass-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {actions.map((action, index) => (
              <Card 
                key={index} 
                className="glass-card cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={action.onClick}
              >
                <CardContent className="pt-6">
                  <action.icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Leaders */}
          <h2 className="font-display text-xl font-bold mb-4">Current Leaders</h2>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Position</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Leading Candidate</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Party</th>
                      <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Votes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(({ position, candidates: positionCandidates }) => {
                      const leader = positionCandidates[0];
                      if (!leader) return null;
                      return (
                        <tr key={position.id} className="border-b border-border last:border-0">
                          <td className="py-3 px-4 font-medium">{position.name}</td>
                          <td className="py-3 px-4">{leader.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{leader.party}</td>
                          <td className="py-3 px-4 text-right font-semibold text-primary">{leader.votes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

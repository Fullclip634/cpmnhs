 import { Header } from '@/components/Header';
 import { Footer } from '@/components/Footer';
 import { CandidateCard } from '@/components/CandidateCard';
 import { useVoting } from '@/contexts/VotingContext';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Users, Loader2 } from 'lucide-react';
 
 export default function CandidatesPage() {
   const { candidates, positions, isLoading } = useVoting();
 
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
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Header />
       
       <main className="flex-1 py-12">
         <div className="container mx-auto px-4">
           {/* Header */}
           <div className="text-center mb-12 animate-slide-up">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
               <Users className="h-4 w-4" />
               Meet Your Candidates
             </div>
             <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
               SSG Election Candidates
             </h1>
             <p className="text-muted-foreground max-w-2xl mx-auto">
               Get to know the students running for the Supreme Student Government positions. 
               Click on each position to view the candidates.
             </p>
           </div>
 
           {positions.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-muted-foreground">No positions available yet. Check back later!</p>
             </div>
           ) : (
             <Tabs defaultValue={positions[0]?.id} className="w-full">
               <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto mb-8">
                 {positions.map((position) => (
                   <TabsTrigger
                     key={position.id}
                     value={position.id}
                     className="px-6 py-3 rounded-xl data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md border border-border data-[state=active]:border-transparent transition-all"
                   >
                     {position.name}
                   </TabsTrigger>
                 ))}
               </TabsList>
 
               {positions.map((position) => {
                 const positionCandidates = candidates.filter(c => c.positionId === position.id);
                 
                 return (
                   <TabsContent key={position.id} value={position.id}>
                     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                       {positionCandidates.map((candidate, index) => (
                         <div 
                           key={candidate.id}
                           className="animate-fade-in"
                           style={{ animationDelay: `${index * 100}ms` }}
                         >
                           <CandidateCard
                             candidate={candidate}
                             position={position}
                           />
                         </div>
                       ))}
                     </div>
                     
                     {positionCandidates.length === 0 && (
                       <div className="text-center py-12">
                         <p className="text-muted-foreground">No candidates for this position yet.</p>
                       </div>
                     )}
                   </TabsContent>
                 );
               })}
             </Tabs>
           )}
         </div>
       </main>
 
       <Footer />
     </div>
   );
 }

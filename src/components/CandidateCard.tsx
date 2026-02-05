 import { Card, CardContent } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Check, User } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface Candidate {
   id: string;
   name: string;
   party?: string | null;
   photoUrl?: string | null;
   motto?: string | null;
   gradeLevel?: string | null;
   section?: string | null;
   votes?: number;
 }
 
 interface Position {
   id: string;
   name: string;
   displayOrder?: number;
   maxVotes?: number;
 }
 
 interface CandidateCardProps {
   candidate: Candidate;
   position: Position;
   isSelected?: boolean;
   onSelect?: () => void;
   showVotes?: boolean;
   rank?: number;
 }
 
 export function CandidateCard({
   candidate,
   position,
   isSelected,
   onSelect,
   showVotes,
   rank,
 }: CandidateCardProps) {
   return (
     <Card
       className={cn(
         "relative overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group",
         isSelected && "ring-2 ring-primary shadow-glow",
         rank === 1 && showVotes && "ring-2 ring-accent"
       )}
       onClick={onSelect}
     >
       {rank && showVotes && (
         <div className={cn(
           "absolute top-0 right-0 px-3 py-1 text-sm font-bold rounded-bl-lg",
           rank === 1 ? "gradient-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
         )}>
           #{rank}
         </div>
       )}
       
       <CardContent className="p-6">
         <div className="flex flex-col items-center text-center">
           {/* Photo */}
           <div className={cn(
             "relative w-24 h-24 rounded-full mb-4 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105",
             isSelected ? "bg-primary" : "bg-secondary"
           )}>
             {candidate.photoUrl ? (
               <img 
                 src={candidate.photoUrl} 
                 alt={candidate.name}
                 className="w-full h-full object-cover"
               />
             ) : (
               <User className={cn(
                 "h-12 w-12",
                 isSelected ? "text-primary-foreground" : "text-secondary-foreground"
               )} />
             )}
             {isSelected && (
               <div className="absolute inset-0 bg-primary/80 flex items-center justify-center animate-scale-in">
                 <Check className="h-10 w-10 text-primary-foreground" />
               </div>
             )}
           </div>
 
           {/* Name */}
           <h3 className="font-display text-lg font-bold text-foreground mb-1">
             {candidate.name}
           </h3>
 
           {/* Party */}
           {candidate.party && (
             <Badge variant="secondary" className="mb-3">
               {candidate.party}
             </Badge>
           )}
 
           {/* Info */}
           {candidate.gradeLevel && candidate.section && (
             <p className="text-sm text-muted-foreground mb-2">
               Grade {candidate.gradeLevel} - {candidate.section}
             </p>
           )}
 
           {/* Motto */}
           {candidate.motto && (
             <p className="text-sm italic text-muted-foreground">
               "{candidate.motto}"
             </p>
           )}
 
           {/* Votes */}
           {showVotes && candidate.votes !== undefined && (
             <div className="mt-4 pt-4 border-t border-border w-full">
               <p className="text-2xl font-bold text-primary">{candidate.votes}</p>
               <p className="text-xs text-muted-foreground uppercase tracking-wide">Votes</p>
             </div>
           )}
 
           {/* Select Button */}
           {onSelect && (
             <Button
               variant={isSelected ? "default" : "outline"}
               className="mt-4 w-full"
               onClick={(e) => {
                 e.stopPropagation();
                 onSelect();
               }}
             >
               {isSelected ? (
                 <>
                   <Check className="h-4 w-4 mr-2" />
                   Selected
                 </>
               ) : (
                 "Vote"
               )}
             </Button>
           )}
         </div>
       </CardContent>
     </Card>
   );
 }

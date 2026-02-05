 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { Header } from '@/components/Header';
 import { Footer } from '@/components/Footer';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import { useVoting } from '@/contexts/VotingContext';
 import schoolLogo from '@/assets/school-logo.jpg';
 import { Eye, EyeOff, LogIn, UserPlus, User, Lock, Mail, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
 
 export default function AuthPage() {
   const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
   
   // Login state
   const [loginEmail, setLoginEmail] = useState('');
   const [loginPassword, setLoginPassword] = useState('');
   const [showLoginPassword, setShowLoginPassword] = useState(false);
   const [isLoggingIn, setIsLoggingIn] = useState(false);
   
   // Signup state
   const [signupEmail, setSignupEmail] = useState('');
   const [signupPassword, setSignupPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [fullName, setFullName] = useState('');
   const [studentId, setStudentId] = useState('');
   const [gradeLevel, setGradeLevel] = useState('');
   const [section, setSection] = useState('');
   const [showSignupPassword, setShowSignupPassword] = useState(false);
   const [isSigningUp, setIsSigningUp] = useState(false);
   
   const { signIn, signUp, isLoggedIn, user } = useVoting();
   const navigate = useNavigate();
 
   // Redirect if already logged in
   useEffect(() => {
     if (isLoggedIn && user) {
       if (user.role === 'admin') {
         navigate('/admin');
       } else {
         navigate('/vote');
       }
     }
   }, [isLoggedIn, user, navigate]);
 
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!loginEmail.trim() || !loginPassword.trim()) {
       return;
     }
 
     setIsLoggingIn(true);
     
     try {
       const { error } = await signIn(loginEmail, loginPassword);
       
       if (!error) {
         // Navigation handled by useEffect
       }
     } finally {
       setIsLoggingIn(false);
     }
   };
 
   const handleSignup = async (e: React.FormEvent) => {
     e.preventDefault();
     
     if (!signupEmail.trim() || !signupPassword.trim() || !fullName.trim() || !studentId.trim()) {
       return;
     }
 
     if (signupPassword !== confirmPassword) {
       return;
     }
 
     setIsSigningUp(true);
     
     try {
       const { error } = await signUp(signupEmail, signupPassword, {
         fullName,
         studentId,
         gradeLevel,
         section,
       });
       
       if (!error) {
         // Show success and switch to login
         setActiveTab('login');
         setLoginEmail(signupEmail);
       }
     } finally {
       setIsSigningUp(false);
     }
   };
 
   return (
     <div className="min-h-screen flex flex-col bg-background">
       <Header />
       
       <main className="flex-1 flex items-center justify-center p-4 py-12">
         <div className="w-full max-w-md animate-slide-up">
           <Card className="glass-card border-0 shadow-xl">
             <CardHeader className="text-center pb-2">
               <div className="flex justify-center mb-4">
                 <div className="relative">
                   <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                   <img 
                     src={schoolLogo} 
                     alt="CPMNHS Logo" 
                     className="relative w-20 h-20 rounded-full object-cover shadow-lg border-2 border-primary/20"
                   />
                 </div>
               </div>
               <CardTitle className="font-display text-2xl">CPMNHS Voting System</CardTitle>
               <CardDescription>
                 Sign in or create an account to participate in the election
               </CardDescription>
             </CardHeader>
             
             <CardContent className="pt-6">
               <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
                 <TabsList className="grid w-full grid-cols-2 mb-6">
                   <TabsTrigger value="login" className="flex items-center gap-2">
                     <LogIn className="h-4 w-4" />
                     Login
                   </TabsTrigger>
                   <TabsTrigger value="signup" className="flex items-center gap-2">
                     <UserPlus className="h-4 w-4" />
                     Sign Up
                   </TabsTrigger>
                 </TabsList>
 
                 <TabsContent value="login">
                   <form onSubmit={handleLogin} className="space-y-5">
                     <div className="space-y-2">
                       <Label htmlFor="login-email" className="text-sm font-medium">
                         Email
                       </Label>
                       <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="login-email"
                           type="email"
                           placeholder="Enter your email"
                           value={loginEmail}
                           onChange={(e) => setLoginEmail(e.target.value)}
                           className="pl-10 h-12"
                           required
                         />
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="login-password" className="text-sm font-medium">
                         Password
                       </Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="login-password"
                           type={showLoginPassword ? 'text' : 'password'}
                           placeholder="Enter your password"
                           value={loginPassword}
                           onChange={(e) => setLoginPassword(e.target.value)}
                           className="pl-10 pr-10 h-12"
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowLoginPassword(!showLoginPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                         >
                           {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                         </button>
                       </div>
                     </div>
 
                     <Button 
                       type="submit" 
                       variant="hero" 
                       size="lg" 
                       className="w-full"
                       disabled={isLoggingIn}
                     >
                       {isLoggingIn ? (
                         <span className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           Logging in...
                         </span>
                       ) : (
                         <>
                           <LogIn className="h-5 w-5" />
                           Login to Vote
                         </>
                       )}
                     </Button>
                   </form>
                 </TabsContent>
 
                 <TabsContent value="signup">
                   <form onSubmit={handleSignup} className="space-y-4">
                     <div className="space-y-2">
                       <Label htmlFor="full-name" className="text-sm font-medium">
                         Full Name *
                       </Label>
                       <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="full-name"
                           type="text"
                           placeholder="Enter your full name"
                           value={fullName}
                           onChange={(e) => setFullName(e.target.value)}
                           className="pl-10 h-12"
                           required
                         />
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="student-id" className="text-sm font-medium">
                         Student ID *
                       </Label>
                       <div className="relative">
                         <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="student-id"
                           type="text"
                           placeholder="Enter your student ID"
                           value={studentId}
                           onChange={(e) => setStudentId(e.target.value)}
                           className="pl-10 h-12"
                           required
                         />
                       </div>
                     </div>
 
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="grade-level" className="text-sm font-medium">
                           Grade Level
                         </Label>
                         <Select value={gradeLevel} onValueChange={setGradeLevel}>
                           <SelectTrigger className="h-12">
                             <SelectValue placeholder="Select" />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="7">Grade 7</SelectItem>
                             <SelectItem value="8">Grade 8</SelectItem>
                             <SelectItem value="9">Grade 9</SelectItem>
                             <SelectItem value="10">Grade 10</SelectItem>
                             <SelectItem value="11">Grade 11</SelectItem>
                             <SelectItem value="12">Grade 12</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
 
                       <div className="space-y-2">
                         <Label htmlFor="section" className="text-sm font-medium">
                           Section
                         </Label>
                         <Input
                           id="section"
                           type="text"
                           placeholder="e.g., STEM-A"
                           value={section}
                           onChange={(e) => setSection(e.target.value)}
                           className="h-12"
                         />
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="signup-email" className="text-sm font-medium">
                         Email *
                       </Label>
                       <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="signup-email"
                           type="email"
                           placeholder="Enter your email"
                           value={signupEmail}
                           onChange={(e) => setSignupEmail(e.target.value)}
                           className="pl-10 h-12"
                           required
                         />
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="signup-password" className="text-sm font-medium">
                         Password *
                       </Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="signup-password"
                           type={showSignupPassword ? 'text' : 'password'}
                           placeholder="Create a password"
                           value={signupPassword}
                           onChange={(e) => setSignupPassword(e.target.value)}
                           className="pl-10 pr-10 h-12"
                           required
                           minLength={6}
                         />
                         <button
                           type="button"
                           onClick={() => setShowSignupPassword(!showSignupPassword)}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                         >
                           {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                         </button>
                       </div>
                     </div>
 
                     <div className="space-y-2">
                       <Label htmlFor="confirm-password" className="text-sm font-medium">
                         Confirm Password *
                       </Label>
                       <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input
                           id="confirm-password"
                           type="password"
                           placeholder="Confirm your password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           className="pl-10 h-12"
                           required
                         />
                       </div>
                       {confirmPassword && signupPassword !== confirmPassword && (
                         <p className="text-sm text-destructive">Passwords do not match</p>
                       )}
                     </div>
 
                     <Button 
                       type="submit" 
                       variant="hero" 
                       size="lg" 
                       className="w-full"
                       disabled={isSigningUp || (signupPassword !== confirmPassword)}
                     >
                       {isSigningUp ? (
                         <span className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           Creating Account...
                         </span>
                       ) : (
                         <>
                           <UserPlus className="h-5 w-5" />
                           Create Account
                         </>
                       )}
                     </Button>
                   </form>
                 </TabsContent>
               </Tabs>
             </CardContent>
           </Card>
         </div>
       </main>
 
       <Footer />
     </div>
   );
 }
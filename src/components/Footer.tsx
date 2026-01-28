import schoolLogo from '@/assets/school-logo.jpg';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={schoolLogo} 
              alt="CPMNHS Logo" 
              className="h-12 w-12 rounded-full object-cover shadow-md"
            />
            <div>
              <h3 className="font-bold text-foreground">Congressman Pablo Malasarte National High School</h3>
              <p className="text-sm text-muted-foreground">Cabad, Balilihan, Bohol</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2024 CPMNHS Voting System. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Developed for Supreme Student Government Elections
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

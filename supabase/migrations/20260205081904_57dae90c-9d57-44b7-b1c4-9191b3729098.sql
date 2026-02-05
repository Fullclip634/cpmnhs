-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'voter');

-- Create profiles table for storing user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    student_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    grade_level TEXT,
    section TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Create elections table
CREATE TABLE public.elections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    school_year TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create positions table
CREATE TABLE public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    max_votes INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    party TEXT,
    photo_url TEXT,
    motto TEXT,
    grade_level TEXT,
    section TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
    position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE NOT NULL,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE NOT NULL,
    voted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (voter_id, position_id, election_id)
);

-- Create voter_status table to track who has voted
CREATE TABLE public.voter_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    election_id UUID REFERENCES public.elections(id) ON DELETE CASCADE NOT NULL,
    has_voted BOOLEAN NOT NULL DEFAULT false,
    voted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (user_id, election_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_status ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, student_id, grade_level, section)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
        NEW.raw_user_meta_data->>'student_id',
        NEW.raw_user_meta_data->>'grade_level',
        NEW.raw_user_meta_data->>'section'
    );
    
    -- Assign voter role by default
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'voter');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_elections_updated_at
    BEFORE UPDATE ON public.elections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
    ON public.user_roles FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for elections (public read, admin write)
CREATE POLICY "Anyone can view active elections"
    ON public.elections FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage elections"
    ON public.elections FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for positions (public read, admin write)
CREATE POLICY "Anyone can view positions"
    ON public.positions FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage positions"
    ON public.positions FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for candidates (public read, admin write)
CREATE POLICY "Anyone can view candidates"
    ON public.candidates FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage candidates"
    ON public.candidates FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for votes
CREATE POLICY "Users can insert their own votes"
    ON public.votes FOR INSERT
    WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Admins can view all votes for counting"
    ON public.votes FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for voter_status
CREATE POLICY "Users can view their own voting status"
    ON public.voter_status FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voting status"
    ON public.voter_status FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voting status"
    ON public.voter_status FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all voting status"
    ON public.voter_status FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Create view for vote counts (used for results)
CREATE OR REPLACE VIEW public.vote_counts AS
SELECT 
    c.id AS candidate_id,
    c.name AS candidate_name,
    c.position_id,
    p.name AS position_name,
    p.election_id,
    COUNT(v.id) AS vote_count
FROM public.candidates c
LEFT JOIN public.votes v ON c.id = v.candidate_id
JOIN public.positions p ON c.position_id = p.id
GROUP BY c.id, c.name, c.position_id, p.name, p.election_id;

-- Create function to get election statistics
CREATE OR REPLACE FUNCTION public.get_election_stats(election_uuid UUID)
RETURNS TABLE (
    total_voters BIGINT,
    total_voted BIGINT,
    participation_rate NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        (SELECT COUNT(*) FROM public.user_roles WHERE role = 'voter') AS total_voters,
        (SELECT COUNT(*) FROM public.voter_status WHERE election_id = election_uuid AND has_voted = true) AS total_voted,
        CASE 
            WHEN (SELECT COUNT(*) FROM public.user_roles WHERE role = 'voter') > 0 
            THEN ROUND(
                (SELECT COUNT(*) FROM public.voter_status WHERE election_id = election_uuid AND has_voted = true)::NUMERIC / 
                (SELECT COUNT(*) FROM public.user_roles WHERE role = 'voter')::NUMERIC * 100, 2
            )
            ELSE 0
        END AS participation_rate
$$;
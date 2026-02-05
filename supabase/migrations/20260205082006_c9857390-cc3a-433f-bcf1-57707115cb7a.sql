-- Drop the security definer view and recreate with security_invoker
DROP VIEW IF EXISTS public.vote_counts;

CREATE OR REPLACE VIEW public.vote_counts
WITH (security_invoker = on) AS
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
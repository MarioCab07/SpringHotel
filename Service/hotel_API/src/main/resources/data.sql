INSERT INTO public.reason (reason_id, name)
SELECT 1, 'Booking'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.reason
    WHERE reason_id = 1
);

INSERT INTO public.reason (reason_id, name)
SELECT 2, 'Check-in'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.reason
    WHERE reason_id = 2
);

INSERT INTO public.reason (reason_id, name)
SELECT 3, 'Check-out'
WHERE NOT EXISTS (
    SELECT 1
    FROM public.reason
    WHERE reason_id = 3
);

INSERT INTO payment_method (id, name, description)
VALUES (1, 'Card', 'Payment made with a debit or credit card')
ON CONFLICT (id) DO NOTHING;

-- 2) CASH → ID 2
INSERT INTO payment_method (id, name, description)
VALUES (2, 'Cash', 'Payment made with physical currency')
ON CONFLICT (id) DO NOTHING;
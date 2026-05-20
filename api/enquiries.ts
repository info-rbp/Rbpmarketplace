type EnquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  businessSlug?: string;
  enquiryType: string;
  budgetRange: string;
  timeline: string;
  message: string;
};

type MinimalRequest = {
  method?: string;
  body?: unknown;
};

type MinimalResponse = {
  setHeader: (name: string, value: string[]) => void;
  status: (code: number) => {
    json: (payload: unknown) => void;
  };
};

export default async function handler(req: MinimalRequest, res: MinimalResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = req.body as EnquiryPayload;

  if (!payload?.name || !payload?.email || !payload?.enquiryType || !payload?.budgetRange || !payload?.timeline || !payload?.message) {
    return res.status(400).json({ error: 'Missing required enquiry fields' });
  }

  // TODO: Replace console logging with durable storage when a database or CRM is configured.
  console.log('Business-In-A-Box enquiry received', payload);

  return res.status(200).json({ success: true });
}
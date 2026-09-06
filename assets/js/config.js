/* ==========================================================================
   THE BATH SUITE — SITE CONFIG
   The only file you need to edit when the client supplies their details.
   Every page reads from here, so a value entered once appears everywhere.
   ========================================================================== */

window.BATHSUITE = {

  /* ----------------------------------------------------------------------
     1. PREVIEW MODE
     true   → any detail left blank below shows a yellow [PLACEHOLDER] tag,
              so nothing looks finished when it isn't. Use while the client
              is still supplying information.
     false  → any detail left blank is HIDDEN completely (its whole row
              disappears). Set this to false before the site goes live.
     ---------------------------------------------------------------------- */
  PREVIEW: true,

  /* ----------------------------------------------------------------------
     2. CONTACT DETAILS — not supplied by the client yet.
     Fill a value in and it appears on every page automatically.
     Leave '' (empty) and it behaves per PREVIEW above.
     ---------------------------------------------------------------------- */

  // Becomes a tap-to-call link on phones and the Call button on the mobile bar.
  // The business 1800 number, supplied 2026-09-06, replacing the temporary
  // mobile. Also hard-coded in the markup and the JSON-LD — see README.
  phone: '1800 374 188',

  // Becomes a mailto link, and is where the enquiry forms deliver.
  // TEMPORARY. Mohammed wants Info@thebathsuite.com.au, but that domain is
  // not registered (only thebathsuite.com is), so the mailbox cannot exist
  // yet. Using the working Gmail until the domain and mailbox are sorted.
  email: 'Winspear.ma@gmail.com',

  // Suburbs / regions covered, one entry per line.
  // Supplied by Mohammed 2026-08-18.
  areas: [
    'Eastern Suburbs',
    'Sydney Metro',
    'Inner West',
    'Sutherland Shire'
  ],

  // Opening hours, one entry per line.
  // Confirmed by Mohammed 2026-08-18 ("hours as you suggested is fine").
  // Sunday was not discussed — "Closed" is an assumption, easy to remove.
  hours: [
    'Monday – Friday: 7am – 5pm',
    'Saturday: By appointment',
    'Sunday: Closed'
  ],

  /* Public contact address, given by Mohammed 2026-08-18 as the
     "contact us" address.
     NOTE: he did not give a postcode. 2224 is the standard postcode for
     Sylvania NSW — worth confirming before this goes on the live domain,
     since it also feeds the address Google reads. */
  addressLine: '53 Corea Street',
  suburb: 'Sylvania',
  postcode: 'NSW 2224',

  /* ----------------------------------------------------------------------
     3. FORM DELIVERY — where enquiries are emailed.

     Using FormSubmit, which needs no account: the address below simply
     receives the enquiries.

     ONE-TIME ACTIVATION IS STILL REQUIRED. The first time the form is
     submitted, FormSubmit emails Winspear.ma@gmail.com asking to confirm
     the address. Until somebody clicks that link, nothing is delivered. So:

       1. Make sure Winspear.ma@gmail.com exists and can receive mail
       2. Submit the form once on the live site
       3. Open that inbox and click FormSubmit's activation link
       4. Submit once more and confirm the enquiry arrives

     The same address is used in the form action on every page, so changing
     it here alone is not enough — see README for the find-and-replace.
     ---------------------------------------------------------------------- */
  FORM_ENDPOINT: 'https://formsubmit.co/Winspear.ma@gmail.com',

  /* Where the enquiry email should be replied to / titled */
  FORM_SUBJECT: 'New website enquiry — The Bath Suite'
};

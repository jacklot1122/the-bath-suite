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
  // NOTE: Mohammed said 2026-08-18 this number is temporary and will change.
  // Update it here and it changes on every page at once.
  phone: '0403 845 057',

  // Becomes a mailto link. Worth moving to a branded address
  // (e.g. hello@thebathsuite.com.au) once the domain is sorted.
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

     Set up (5 minutes, free plan is fine):
       1. Sign up at https://formspree.io with the client's email address
       2. Create a new form  →  copy the endpoint it gives you
       3. Paste it below, replacing the placeholder
       4. Send one test enquiry and confirm it lands in their inbox

     Until this is a real endpoint, the forms refuse to submit and show a
     clear message rather than silently losing an enquiry.
     ---------------------------------------------------------------------- */
  FORM_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',

  /* Where the enquiry email should be replied to / titled */
  FORM_SUBJECT: 'New website enquiry — The Bath Suite'
};

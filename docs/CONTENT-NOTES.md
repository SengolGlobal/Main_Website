# Content notes: sources, proposed copy, and items to confirm

The primary source of truth is `Assets/Company Profile Presentation (1).pdf` (11 slides). This file records which website content comes from it, which copy is newly proposed, and what the company still needs to confirm before launch.

## 1. Verified facts used as-is (from the company profile)

| Topic | Profile content | Where used |
| --- | --- | --- |
| Positioning | India-based freight and logistics partner; tailored freight packages to fit your needs and timelines; extensive global network for reliable cargo movement | Home, About, meta descriptions |
| Ecosystem | "One connected logistics ecosystem": Air Freight, Sea Freight, Rail Freight, Road Transport, Customs Clearance, Warehousing; integrated solutions, seamless connections, end-to-end delivery | About, Services (diagram) |
| Air freight | Time-definite express service and consolidation; charter and part-charter options; special cargo and airport-to-warehouse delivery | Air Freight page |
| Sea freight | Complete range across every cargo type; reliable port-to-door reach worldwide; end-to-end customs support | Sea Freight page |
| Door-to-door and inland | End-to-end pickup, documentation and customs clearance; flexible road and rail solutions with real-time tracking; live visibility and electronic proof of delivery | Door-to-Door page (worded as "shipment visibility and status updates", with "electronic proof of delivery where available") |
| Specialist cargo and compliance | Expert handling for complex shipments; end-to-end customs clearance; complete documentation support; proven across diverse industries | Specialist Cargo page |
| Why choose Sengol | Tailored logistics plans; clear, proactive communication; dependable coordination minimising delays and damage; cost-aware routing; full shipment visibility and tracking | Home "Why Sengol" |
| Network and capabilities | India-based operations, customs brokerage capability, warehousing, transportation network, specialised cargo experience; imports to India and exports from India | Home network section, About strengths |
| Network figures | 550+ verified freight forwarders, 100+ countries covered, 600+ cities the network reaches | Always labelled as the **partner network**, never as offices or employees |
| India network | Chennai, Mumbai, Navi Mumbai / Nhava Sheva, Mundra, Delhi, Ahmedabad, Tuticorin, Bengaluru, Cochin, Visakhapatnam, Kolkata, Hyderabad | Home, Network page, India map |
| International connections | North America: USA, Canada, Mexico · Middle East: UAE, Egypt, Turkey, Oman · Asia: Bangladesh, Sri Lanka, China, Vietnam, Thailand, Malaysia, Indonesia, Philippines, Taiwan, Japan, South Korea · Australia & Oceania: Australia, New Zealand · Europe: London, Germany, Italy (spelled "Itlay" in the profile, corrected), Croatia, Lithuania, Poland, Spain | Network map and lists |
| Contact | 4F-CS-27, 4th Floor, Ansal Plaza Mall, Vaishali Sec-1, Ghaziabad, Uttar Pradesh – 201010 · +91 8448336307 · +91 9540603266 · network@sengolgroup.com · bdm@sengolgroup.com · www.sengolgroup.com | Header, footer, Contact, Quote, structured data |
| Brand | Logo, "Logistics Simplified" tagline; "Delivering promises, globally" / "Let's move your cargo with confidence" phrasing | Logo files, CTA band |

## 2. Newly proposed website copy (not stated in the profile)

The following was written for the website. It is framed as approach or process, not as company history or facts:

- Hero headline "Connecting India to the world. Delivering logistics with confidence." and the supporting paragraph.
- "Our approach" items (understand the shipment, coordinate end to end, communicate clearly, keep costs in view).
- The 5-step shipment coordination process, the per-service "How it works" steps and the "What you gain" benefits, all derived from the profile bullets.
- FAQ answers. They avoid promises: transit and clearance times are explicitly **not guaranteed**, and feasibility depends on cargo and regulations.
- Map wording: routes are explicitly **illustrative** and are not scheduled services, transit times, live tracking or physical offices.

No founding date, leadership biographies, history, mission statement, certifications, awards, testimonials, client logos, fleet sizes or additional offices were added.

## 3. Items for the company to confirm before launch

1. **FCL / LCL sea freight.** The profile says "complete range across every cargo type" but does not name FCL or LCL, so the website does not claim them. Confirm whether they should be listed explicitly.
2. **Real-time tracking and ePOD.** The profile mentions "real-time tracking", "live visibility" and "electronic proof of delivery". The site words these as "status updates and tracking information" and "electronic proof of delivery where available", and shows **no** tracking tool. Confirm whether a customer tracking portal exists and should be linked.
3. **Warehousing.** Mentioned as a capability (ecosystem, network slide). Confirm whether warehousing is owned, partnered or coordinated, and in which locations, before adding more detail.
4. **Nature of the India network locations.** The 12 cities are shown as "network locations / gateways", not as Sengol branches. Confirm whether any are company offices.
5. **Legal pages.** The Privacy Policy and Terms are **placeholders**, visibly marked "Draft for review" on every language version. They need review by the company and its legal advisers (including governing jurisdiction, data-retention periods and any DPDP Act 2023 requirements) before publication.
6. **Form recipients.** Enquiries are configured to go to network@sengolgroup.com and bdm@sengolgroup.com (`ENQUIRY_TO_EMAIL`). Confirm the right inboxes and provide email-service credentials (see README).
7. **Domain and hosting.** Canonical URLs assume `https://www.sengolgroup.com` (`NEXT_PUBLIC_SITE_URL`). Confirm the production domain.
8. **Translations.** All languages are complete, professional translations prepared for this project. Before launch, have native-speaking reviewers, ideally with freight-forwarding knowledge, check at least German, Korean and Arabic. Note for Simplified Chinese: Taiwan is rendered as 中国台湾, the standard form for mainland-China audiences; change it to 台湾 if the company prefers.
9. **Photography.** Photos are from Unsplash (free commercial use under the Unsplash License, credit shown in the footer). Replace them with the company's own operations photography when available. The full list is in `src/data/site.ts`.
10. **Logo usage.** Web logos were derived from `Assets/no blur no font change.svg` (the lower, full "GLOBAL LOGISTICS PVT LTD" lockup), with a white variant for dark backgrounds. Confirm that the white variant is acceptable under the brand guidelines.
11. **Brand name format.** "Sengol Global Logistics Pvt. Ltd." is used for legal and contact references and "Sengol Global Logistics" in running copy. Confirm the preferred format.

## 4. Missing assets that would strengthen the site

- Company-owned photography (offices, team, warehouse or port operations).
- Any verifiable credentials the company wants to show (registrations, memberships, licences). These were deliberately left out because none are in the profile.
- Social media profile links (none provided; no social icons are shown).

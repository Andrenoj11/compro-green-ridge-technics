# Search indexing and service SEO

## Approved scope

Services follow the supplied 2026 company profile, pages 7-10:

| Page | Profile group |
| --- | --- |
| `/id/services/management` | Management Services |
| `/id/services/inspection` | Inspection Services |
| `/id/services/testing` | System Test Services |
| `/id/services/commissioning` | Commissioning Services |

The approved service areas are **Jabodetabek and Batam**. These are service areas;
the company address remains in Jakarta Selatan as stated in the profile. No
Batam office, phone/WhatsApp number, ratings, certification or completed project
claim is inferred. Phone/WhatsApp is deferred at the owner's request.

Home/service titles and descriptions are localized in Indonesian, English,
Arabic and Chinese. Visible service-area copy, Organization and Service schema
agree with those descriptions. Existing canonical `www` URLs, route paths and
language alternates are preserved; no duplicate city landing pages are created.

## 1. Verify Search Console ownership

Use a company-controlled Google account at <https://search.google.com/search-console>.
Add a **Domain** property: `greenridgetechnics.com` without `https://`, `www` or a
path. Add the TXT verification value supplied by Google in the Hostinger DNS
zone for this domain (name `@`). Preserve other records. Complete verification
and retain the verification record afterwards. This can be done before enabling
indexing. Reference: [Google ownership verification](https://support.google.com/webmasters/answer/9008080).

## 2. Deploy and enable production indexing

Commit and push the SEO changes. Wait for verify, publish and deploy to succeed.
CI builds with indexing disabled and tests that same image in both disabled and
enabled runtime modes. `robots.ts` is explicitly dynamic so a cached CI policy
cannot keep blocking production. Local defaults remain non-indexable.

The production policy in `deploy/compose.ci.yaml` enables indexing. The root-owned
installed copy on the VPS must also be updated; git pull alone is insufficient.
As **deploy on the VPS**, after the new application image is deployed:

```sh
cd /opt/green-ridge
git pull --ff-only
sudo install -o root -g root -m 644 deploy/compose.ci.yaml /etc/green-ridge-ci/compose.yaml
sudo bash -c 'COMPOSE_IGNORE_ORPHANS=true APP_IMAGE="$(cat /var/lib/green-ridge-deploy/current-image)" docker compose --env-file /dev/null -p green-ridge -f /etc/green-ridge-ci/compose.yaml up -d --no-deps --force-recreate --wait --wait-timeout 180 web'
```

The existing root-owned contact settings, recipients and persistent quota volume
are reused. Caddy does not need a configuration update for this change.

Check the actual deployed output:

```sh
curl -sS https://www.greenridgetechnics.com/robots.txt
curl -sS https://www.greenridgetechnics.com/id | grep -o 'name="robots" content="[^"]*"'
curl -I https://www.greenridgetechnics.com/sitemap.xml
```

Expect `Allow: /`, `Disallow: /api/`, and the sitemap URL in robots; no sitewide
`Disallow: /`. Page metadata should be `index, follow`; sitemap should return 200.
The 68 supported localized page URLs remain in the sitemap. Unknown/removed
project pages still return 404 and are not included.

## 3. Submit and monitor

In the verified Search Console property, submit
`https://www.greenridgetechnics.com/sitemap.xml`. Use URL Inspection → Test live URL
for `/id` and the four primary service pages. Confirm Google can crawl them and
then request indexing. Submitting a sitemap or a request does not guarantee
indexing or a ranking. Crawl results can lag behind a deployment.

Review Page indexing and Performance reports over time. Start by distinguishing
brand queries (Green Ridge Technics) from service queries and location queries.
Query suggestions are hypotheses, not measured volume or competition estimates:
management/MEP assessment, MEP inspection, system testing/TAB, commissioning,
with Jakarta/Jabodetabek or Batam only where relevant. Use actual Search Console
impressions, clicks and qualified inquiries to choose subsequent content work.

References: [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide),
[requesting recrawls](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Further preparation

Add publishable project evidence, original photos, accurate technical explanations
and case studies as supplied by the company. Google Business Profile can be considered if the
business meets Google's in-person/service-area eligibility requirements. Phone
and WhatsApp can be added later when the company approves the public number.

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    if (request.method !== 'POST') {
        return new Response('Use POST with JSON body: { "domain": "...", "subs": [...] }', {
            status: 400,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    let body;
    try {
        body = await request.json();
    } catch (err) {
        return new Response('Invalid JSON body', {
            status: 400,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    const { domain, subs } = body;

    if (!domain || !Array.isArray(subs) || subs.length === 0) {
        return new Response('Missing or invalid "domain" or "subs" array', {
            status: 400,
            headers: { 'Content-Type': 'text/plain' }
        });
    }

    return await resolveViaWorkers(domain, subs);
}

async function resolveViaWorkers(domain, subs) {
    const workers = [
        "shiny-fog-4f85.xxxx-b64.workers.dev",
        "winter-feather-xxxxx.paoratts.workers.dev",
        "square-xxxx-7750.mosiujn.workers.dev",
        "wild-king-xxxx.karabde.workers.dev",
        "royal-bird-xxxx.shermila.workers.dev",
        "broken-hill-5af1.xxxx.workers.dev",
        "xxxx-tree-468b.yashof.workers.dev",
        "steep-brook-0e4a.xxxx.workers.dev",
        "plain-surf-xxxx.slantpish.workers.dev",
        "young-xxxxx-7005.montazerat.workers.dev",
        "rough-voice-1227.xxxx.workers.dev",
        "long-thunder-xxxx.pepbarb.workers.dev",
        "rough-hill-552b.xxxx.workers.dev",
        "bitter-poetry-fcde.xxxx.workers.dev",
        "patient-recipe-xxxx.saatbarg.workers.dev",
        "holy-lake-xxxx.avazze.workers.dev",
        "noisy-limit-cf43.xxxxx.workers.dev",
        "red-salad-xxxx.yengdrya.workers.dev",
        "autumn-sound-febd.xxxx.workers.dev",
        "yellow-haze-8ff0.xxxxx.workers.dev",
        "empty-cake-xxxx.tazdashnem.workers.dev",
        "young-xxxx-4c85.shonambah.workers.dev",
        "jolly-brook-d3c5.xxxx.workers.dev",
        "icy-pine-xxxx.bmoghashek.workers.dev",
        "twilight-smoke-3837.xxxx.workers.dev",
        "jolly-cake-dfc2.xxxx.workers.dev",
        "jolly-brook-xxxx.haftad.workers.dev",
        "bitter-flower-2eaa.xxxx.workers.dev",
        "lingering-xxxx-e364.esrasori.workers.dev",
        "cold-frost-fc93.xxxx.workers.dev"
    ];

    const alive = new Set();
    const ghosted = new Set();
    const broken = new Set();
    const batchSize = 10;

    for (let i = 0; i < subs.length; i += batchSize) {
        const batch = subs.slice(i, i + batchSize);

        const tasks = batch.map(async (sub, j) => {
            const fqdn = `${sub}.${domain}`;
            const dnsQueryUrl = `https://cloudflare-dns.com/dns-query?name=${fqdn}&type=A`;
            const encodedDieuri = encodeURIComponent(dnsQueryUrl);
            const encodedHeaders = encodeURIComponent("Acceptnnppapplication/dns-json");

            const worker = workers[(i + j) % workers.length];
            const dispatchUrl = `https://${worker}/?dieuri=${encodedDieuri}&diemet=GET&diehed=${encodedHeaders}&diecok=null&diebod=null`;

            try {
                const res = await fetch(dispatchUrl);
                const data = await res.json();

                if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
                    alive.add(sub);
                } else if (data.Status === 3 || !data.Answer) {
                    ghosted.add(sub);
                } else {
                    broken.add(sub);
                }
            } catch (err) {
                broken.add(sub);
            }
        });

        await Promise.all(tasks);
    }

    const result = {
        requestcount: subs.length,
        alive: alive.size,
        ghosted: ghosted.size,
        broken: broken.size,
        alive_subs: Array.from(alive)
        //ghosted_subs: Array.from(ghosted),
        //broken_subs: Array.from(broken)
    };

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

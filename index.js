export default {
  async fetch(request) {
    const targetUrl = "https://script.google.com/macros/s/AKfycbyJ9Q7Bw17IiKo982nX08FeIsPMieDdXGxm-WKNbfK__c3rj99c2qCToMlIenD-Daw7Ow/exec";

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "follow"
    });

    const response = await fetch(newRequest);
    const headers = new Headers(response.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return new Response(await response.text(), {
      status: response.status,
      headers
    });
  }
}

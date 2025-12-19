Deno.serve(async (req) => {
  try {
    const accessToken = Deno.env.get('PATREON_ACCESS_TOKEN');
    
    if (!accessToken) {
      return Response.json({ error: 'Patreon access token not configured', posts: [] });
    }

    // First get the current user's campaign
    const identityRes = await fetch('https://www.patreon.com/api/oauth2/v2/identity?include=campaign&fields[campaign]=vanity', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!identityRes.ok) {
      const errorText = await identityRes.text();
      return Response.json({ error: `Identity API failed: ${identityRes.status}`, details: errorText, posts: [] });
    }

    const identityData = await identityRes.json();
    const campaignId = identityData.included?.[0]?.id;

    if (!campaignId) {
      return Response.json({ error: 'No campaign found for this account', posts: [] });
    }

    // Fetch posts for this campaign
    const postsRes = await fetch(`https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/posts?fields[post]=title,published_at,url,image,thumbnail_url&page[count]=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    if (!postsRes.ok) {
      const errorText = await postsRes.text();
      return Response.json({ error: `Posts API failed: ${postsRes.status}`, details: errorText, posts: [] });
    }

    const postsData = await postsRes.json();
    
    const posts = postsData.data?.map(post => ({
      id: post.id,
      title: post.attributes?.title || 'Untitled',
      published_at: post.attributes?.published_at,
      url: post.attributes?.url || `https://www.patreon.com/posts/${post.id}`,
      image: post.attributes?.image?.large_url || post.attributes?.image?.url || post.attributes?.thumbnail_url || null,
    })) || [];

    return Response.json({ posts });
  } catch (error) {
    return Response.json({ error: error.message, posts: [] }, { status: 200 });
  }
});
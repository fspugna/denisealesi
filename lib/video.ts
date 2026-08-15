export function getYouTubeVideoId(url: string) {
    try {
        const parsed = new URL(url)
        if (parsed.hostname === 'youtu.be') return parsed.pathname.split('/').filter(Boolean)[0] || null
        if (parsed.hostname.endsWith('youtube.com')) {
            return parsed.searchParams.get('v')
                || parsed.pathname.match(/\/(?:embed|v|shorts)\/([^/?]+)/)?.[1]
                || null
        }
    } catch {}
    return null
}

export function getYouTubeThumbnail(url: string) {
    const id = getYouTubeVideoId(url)
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function getVideoEmbedUrl(url: string) {
    const youtubeId = getYouTubeVideoId(url)
    if (youtubeId) return `https://www.youtube.com/embed/${youtubeId}`
    try {
        const parsed = new URL(url)
        return parsed.hostname.endsWith('facebook.com') && parsed.pathname === '/plugins/video.php' ? parsed.href : null
    } catch {
        return null
    }
}
